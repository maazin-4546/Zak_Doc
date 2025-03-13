const invoiceService = require("../services/invoiceService");
const Invoice = require("../models/Invoice");

const extractInvoice = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const extractedData = await invoiceService.processFile(req.file);

        if (extractedData.error) {
            return res.status(500).json({ error: extractedData.error });
        }

        res.json({ success: true, message: "Invoice data and category updated successfully!", data: extractedData });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const getAllInvoiceData = async (req, res) => {
    try {
        const invoices = await Invoice.find({});
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateInvoiceData = async (req, res) => {
    try {
        const { products, ...updatedFields } = req.body;
        const { invoiceId } = req.params; // Extract ID from request params

        if (!invoiceId) return res.status(400).json({ error: "Invoice ID is required" });

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ error: "Invoice not found" });

        // Update invoice fields dynamically
        Object.assign(invoice, updatedFields);

        // Update product fields if provided
        if (Array.isArray(products)) {
            products.forEach(({ _id, ...productUpdates }) => {
                const product = invoice.products.id(_id);
                if (product) Object.assign(product, productUpdates);
            });
            invoice.markModified("products");
        }

        await invoice.save();
        res.json({ success: true, message: "Invoice updated successfully", data: invoice });
    } catch (error) {
        console.error("Error updating invoice:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { extractInvoice, getAllInvoiceData, updateInvoiceData };