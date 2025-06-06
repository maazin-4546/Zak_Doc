const invoiceService = require("../services/invoiceService"); //* processFile function call
const Invoice = require("../models/Invoice");
const mongoose = require("mongoose");
const moment = require("moment");

const { refreshZohoToken, updateZohoInvoice, deleteZohoInvoice } = require("../services/zohoService");


const extractInvoice = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Pass entire req instead of just req.file
        const extractedData = await invoiceService.processFile(req);

        if (extractedData.error) {
            return res.status(500).json({ error: extractedData.error });
        }

        res.json({ success: true, message: "Invoice data and category updated successfully!", data: extractedData });
    } catch (error) {
        console.error("Error:");
        res.status(500).json({ error: error.message });
    }
};

// !--------------- Invoice Operations -----------------

const getUserSpcificInvoice = async (req, res) => {
    try {
        // Fetch invoices where userId matches the logged-in user
        const invoices = await Invoice.find({ userId: req.user._id });

        res.json({ success: true, data: invoices });
    } catch (error) {
        console.error("Error fetching invoices:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


const updateOrInsertInvoiceData = async (req, res) => {
    try {
        const { _id, products = [], ...invoiceFields } = req.body;

        if (!_id || _id === "undefined" || _id === "") {
            // Create new invoice
            const newInvoice = new Invoice({
                ...invoiceFields,
                products,
            });

            await newInvoice.save();
            return res.json({ success: true, message: "Invoice created", data: newInvoice });
        }

        // Update existing invoice
        const invoice = await Invoice.findById(_id);
        if (!invoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }

        Object.assign(invoice, invoiceFields);

        if (Array.isArray(products)) {
            products.forEach(({ _id: productId, ...updates }) => {
                const existingProduct = invoice.products.id(productId);
                if (existingProduct) {
                    Object.assign(existingProduct, updates);
                }
            });
            invoice.markModified("products");
        }

        await invoice.save();
        return res.json({ success: true, message: "Invoice updated", data: invoice });

    } catch (error) {
        console.error("Upsert error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const deleteInvoiceData = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        if (!invoiceId) return res.status(400).json({ error: "Invoice ID is required" });

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ error: "Invoice not found" });

        // 🧹 Delete from Zoho if already synced
        if (invoice.isSyncedToZoho && invoice.zohoInvoiceId) {
            await deleteZohoInvoice(invoice.zohoInvoiceId);
        }

        // 💾 Delete from MongoDB
        await Invoice.findByIdAndDelete(invoiceId);

        res.json({ success: true, message: "Invoice deleted successfully" });

    } catch (error) {
        console.error("❌ Error deleting invoice:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// !--------------- Filter API's -----------------

const getInvoiceDataFromCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const decodedCategory = decodeURIComponent(category);

        // KEY FIX: Changed 'user' to 'userId' to match your schema
        const invoices = await Invoice.find({
            userId: userId,  // ← Changed from 'user' to 'userId'
            category: decodedCategory
        });

        res.json({
            success: true,
            data: invoices  // Consistent response format with your other API
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            error: "Server error",
            details: error.message
        });
    }
};

const getReceiptsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user._id;

        // Validate inputs
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Both startDate and endDate are required"
            });
        }

        const invoices = await Invoice.find({
            userId: userId,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            }
        });

        res.json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// !--------------- Dashboard -----------------

// API to get total weekly spending
const getAmountWeeklySpending = async (req, res) => {
    try {
        const { filter } = req.query; // Extract filter parameter
        const userId = req.user._id;

        let startDate = moment().startOf("day"); // Default: Today
        switch (filter) {
            case "7d":
                startDate = moment().subtract(7, "days").startOf("day");
                break;
            case "14d":
                startDate = moment().subtract(14, "days").startOf("day");
                break;
            case "1m":
                startDate = moment().subtract(1, "months").startOf("day");
                break;
            case "3m":
                startDate = moment().subtract(3, "months").startOf("day");
                break;
            case "6m":
                startDate = moment().subtract(6, "months").startOf("day");
                break;
            case "1y":
                startDate = moment().subtract(1, "years").startOf("day");
                break;
            default:
                startDate = moment("2000-01-01"); // Fetch all data
        }

        // Fetch invoices for the selected time range
        const invoices = await Invoice.find({
            userId,
            createdAt: { $gte: startDate.toDate() }
        });

        // Process data for weekly aggregation
        const weeklyData = {};

        invoices.forEach(invoice => {
            const createdAt = moment(invoice.createdAt).startOf("week").format("YYYY-MM-DD");

            // Convert total to a number (remove "$" sign if exists)
            const totalAmount = parseFloat(invoice.total.replace(/[^0-9.]/g, ""));

            if (!weeklyData[createdAt]) {
                weeklyData[createdAt] = 0;
            }
            weeklyData[createdAt] += totalAmount;
        });

        // Convert object to array for graph consumption
        const result = Object.keys(weeklyData).map(date => ({
            weekStart: date,
            total: weeklyData[date]
        }));

        res.json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching weekly amounts:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// API to get categorywise spending
const getCategoryWiseSpending = async (req, res) => {
    try {
        const { filter } = req.query; // Extract filter parameter
        const userId = req.user._id;

        let startDate = moment().startOf("day"); // Default: Today
        switch (filter) {
            case "7d":
                startDate = moment().subtract(7, "days").startOf("day");
                break;
            case "14d":
                startDate = moment().subtract(14, "days").startOf("day");
                break;
            case "1m":
                startDate = moment().subtract(1, "months").startOf("day");
                break;
            case "3m":
                startDate = moment().subtract(3, "months").startOf("day");
                break;
            case "6m":
                startDate = moment().subtract(6, "months").startOf("day");
                break;
            case "1y":
                startDate = moment().subtract(1, "years").startOf("day");
                break;
            default:
                startDate = moment("2000-01-01"); // Fetch all data
        }

        // Fetch invoices within the selected date range
        const invoices = await Invoice.find({
            userId,
            createdAt: { $gte: startDate.toDate() }
        });

        // Object to store category-wise spending
        const categorySpending = {};
        let totalSpending = 0;

        invoices.forEach(invoice => {
            const category = invoice.category;

            // Convert total to a number (remove currency symbols, commas)
            const totalAmount = parseFloat(invoice.total.replace(/[^\d.-]/g, ""));

            if (!categorySpending[category]) {
                categorySpending[category] = 0;
            }
            categorySpending[category] += totalAmount;
            totalSpending += totalAmount;
        });

        // Convert object into array for frontend consumption
        const result = Object.keys(categorySpending).map(category => ({
            category,
            total: categorySpending[category]
        }));

        res.json({
            success: true,
            data: result,
            totalSpending
        });
    } catch (error) {
        console.error("Error fetching category spending:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// CategoryWise count the receipt
const getInvoiceCategoryCount = async (req, res) => {
    try {
        const { filter } = req.query; // Extract filter parameter
        const userId = req.user._id;

        let startDate = moment().startOf("day"); // Default: Today
        switch (filter) {
            case "7d":
                startDate = moment().subtract(7, "days").startOf("day");
                break;
            case "14d":
                startDate = moment().subtract(14, "days").startOf("day");
                break;
            case "1m":
                startDate = moment().subtract(1, "months").startOf("day");
                break;
            case "3m":
                startDate = moment().subtract(3, "months").startOf("day");
                break;
            case "6m":
                startDate = moment().subtract(6, "months").startOf("day");
                break;
            case "1y":
                startDate = moment().subtract(1, "years").startOf("day");
                break;
            default:
                startDate = moment("2000-01-01"); // Fetch all data
        }

        // Fetch invoices and filter based on selected time range
        const categoryCount = await Invoice.aggregate([
            {
                $match: {
                    userId: userId,
                    createdAt: { $gte: startDate.toDate() }
                }
            },
            {
                $group: {
                    _id: "$category", // Group by category
                    count: { $sum: 1 } // Count occurrences
                }
            }
        ]);

        // Calculate total receipts
        const totalReceipts = categoryCount.reduce((sum, category) => sum + category.count, 0);

        // Get the total number of unique categories
        const totalCategories = categoryCount.length;

        res.json({ success: true, data: categoryCount, totalReceipts, totalCategories });
    } catch (error) {
        console.error("Error fetching category count:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = {
    extractInvoice,    
    getInvoiceDataFromCategory,
    getReceiptsByDateRange,
    getUserSpcificInvoice,
    deleteInvoiceData,
    getAmountWeeklySpending,
    getCategoryWiseSpending,
    getInvoiceCategoryCount,
    updateOrInsertInvoiceData
};