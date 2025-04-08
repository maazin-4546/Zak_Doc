const Invoice = require("../models/Invoice");
const User = require("../models/user")
const jwt = require("jsonwebtoken");

const { getInvoices, createInvoice, getOrCreateCustomer, refreshZohoToken, updateZohoInvoice } = require("../services/zohoService");


// Controller to Fetch Invoices
const fetchInvoices = async (req, res) => {
    const invoices = await getInvoices();
    if (invoices) {
        res.json({ success: true, invoices });
    } else {
        res.status(500).json({ success: false, message: "Failed to fetch invoices" });
    }
};

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

        // 5. Get or create customer in Zoho with full details
        const customerId = await getOrCreateCustomer({
            name: customerName,
            email: email,
            phone: phone,
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
            if (result) {
                await Invoice.findByIdAndUpdate(invoice._id, { isSyncedToZoho: true });
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

const updateInvoice = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const { invoiceId } = req.params;
        const updatedData = req.body;

        const invoice = await Invoice.findOneAndUpdate({ _id: invoiceId, userId }, updatedData, { new: true });
        if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

        if (invoice.isSyncedToZoho && invoice.zohoInvoiceId) {
            await refreshZohoToken();

            const lineItems = (updatedData.products || []).map(p => ({
                name: p.product_name || "Unnamed Product",
                quantity: p.quantity || 1,
                rate: parseFloat((p.unit_amount || "0").replace(/[^0-9.]/g, "")) || 0,
            }));

            const zohoPayload = {
                customer_id: invoice.customerId,
                date: formatDate(updatedData.createdAt || invoice.createdAt),
                due_date: formatDate(updatedData.createdAt || invoice.createdAt),
                line_items: lineItems,
                total: parseFloat((updatedData.total || "0").replace(/[^0-9.]/g, "")) || 0,
            };

            await updateZohoInvoice(invoice.zohoInvoiceId, zohoPayload);
        }

        res.json({ success: true, message: "Invoice updated successfully" });

    } catch (err) {
        console.error("❌ Update Error:", err);
        res.status(500).json({ success: false, message: "Update failed" });
    }
};




module.exports = { fetchInvoices, addInvoices, updateInvoice };