const Invoice = require("../models/Invoice");
const User = require("../models/user")
const jwt = require("jsonwebtoken");

const { getInvoices, createInvoice, getOrCreateCustomer, refreshZohoToken } = require("../services/zohoService");


// Controller to Fetch Invoices
const fetchInvoices = async (req, res) => {
    const invoices = await getInvoices();
    if (invoices) {
        res.json({ success: true, invoices });
    } else {
        res.status(500).json({ success: false, message: "Failed to fetch invoices" });
    }
};

// Used to format date
const formatDate = (date) => {
    try {
        return new Date(date).toISOString().split("T")[0];
    } catch (err) {
        return new Date().toISOString().split("T")[0]; // fallback to today's date
    }
};

const addInvoices = async (req, res) => {
    try {
        // 1. Decode token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // 2. Refresh Zoho token
        await refreshZohoToken();

        // 3. Get totalSpending from body
        const { totalSpending } = req.body;
        const numericTotalSpending = parseFloat((totalSpending || "0").toString().replace(/[^0-9.]/g, "")) || 0;

        // 4. Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const customerName = `${user.firstName} ${user.lastName}`.trim();
        const email = user.email || "";
        const phone = user.phone || "";

        // 5. Get or create customer in Zoho
        const customerId = await getOrCreateCustomer({
            name: customerName,
            email,
            phone,
            receivables: numericTotalSpending,
        });

        if (!customerId) {
            return res.status(500).json({ success: false, message: "Failed to sync customer" });
        }

        // 6. Sync unsynced invoices
        const invoices = await Invoice.find({ userId, isSyncedToZoho: { $ne: true } });
        const failedInvoices = [];
        let successCount = 0;

        for (const invoice of invoices) {
            const totalAmount = parseFloat((invoice.total || "0").replace(/[^0-9.]/g, "")) || 0;

            const lineItems = (invoice.products || []).map((p) => ({
                name: p.product_name || "Unnamed Product",
                quantity: p.quantity || 1,
                rate: parseFloat((p.unit_amount || "0").replace(/[^0-9.]/g, "")) || 0,
            }));

            const invoicePayload = {
                customer_id: customerId,
                date: formatDate(invoice.createdAt),
                due_date: formatDate(invoice.createdAt),
                line_items: lineItems,
                total: totalAmount,
            };

            const result = await createInvoice(invoicePayload);

            if (result && result.invoice) {
                await Invoice.findByIdAndUpdate(invoice._id, {
                    isSyncedToZoho: true,
                    zohoInvoiceId: result.invoice.invoice_id, // 🔐 Save Zoho ID
                });
                successCount++;
            } else {
                failedInvoices.push(invoice.invoice_number);
            }
        }

        res.json({
            success: true,
            message: `Invoices sync complete. Success: ${successCount}, Failed: ${failedInvoices.length}`,
            failedInvoices,
        });

    } catch (err) {
        console.error("❌ Sync Error:", err);
        res.status(500).json({ success: false, message: "Failed to sync invoices." });
    }
};

module.exports = { fetchInvoices, addInvoices };