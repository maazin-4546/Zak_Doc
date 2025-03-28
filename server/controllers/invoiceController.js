const invoiceService = require("../services/invoiceService");
const Invoice = require("../models/Invoice");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const moment = require("moment");


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
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

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

const getInvoiceDataById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the ID exists
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }

        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCountOfSpecificCategory = async (req, res) => {
    try {
        const { category } = req.params;

        // Validate category from existing records
        const existingCategories = await Invoice.distinct("category");
        if (!existingCategories.includes(category)) {
            return res.status(400).json({ error: "Invalid category" });
        }

        // Get count of the category from Categories table
        const categoryData = await Category.findOne({ category });
        const count = categoryData ? categoryData.count : 0;

        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

const updateInvoiceData = async (req, res) => {
    try {
        const { products, category, ...updatedFields } = req.body;
        const { invoiceId } = req.params;

        if (!invoiceId) return res.status(400).json({ error: "Invoice ID is required" });

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ error: "Invoice not found" });

        const oldCategory = invoice.category; // Store old category before update
        Object.assign(invoice, updatedFields);

        if (Array.isArray(products)) {
            products.forEach(({ _id, ...productUpdates }) => {
                const product = invoice.products.id(_id);
                if (product) Object.assign(product, productUpdates);
            });
            invoice.markModified("products");
        }

        if (category && category !== oldCategory) {
            // ✅ Decrease count of old category
            await Category.findOneAndUpdate(
                { userId: invoice.userId, category: oldCategory },
                { $inc: { count: -1 } }
            );

            // ✅ Increase count of new category (or create if it doesn't exist)
            const existingCategory = await Category.findOne({ userId: invoice.userId, category });
            if (existingCategory) {
                existingCategory.count += 1;
                await existingCategory.save();
            } else {
                const newCategory = new Category({ userId: invoice.userId, category, count: 1 });
                await newCategory.save();
            }

            invoice.category = category;
        }

        await invoice.save();
        res.json({ success: true, message: "Invoice updated successfully", data: invoice });

    } catch (error) {
        console.error("Error updating invoice:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteInvoiceData = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const userId = req.user.id; // Get the logged-in user's ID

        if (!invoiceId) return res.status(400).json({ error: "Invoice ID is required" });

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ error: "Invoice not found" });

        const categoryName = invoice.category;

        // Delete the invoice
        await Invoice.findByIdAndDelete(invoiceId);

        // Update the category count for the user
        const category = await Category.findOne({ userId, category: categoryName });

        if (category) {
            category.count -= 1;
            if (category.count <= 0) {
                await Category.findByIdAndDelete(category._id); // Remove category if count reaches 0
            } else {
                await category.save();
            }
        }

        res.json({ success: true, message: "Invoice deleted successfully" });

    } catch (error) {
        console.error("Error deleting invoice:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// API to get total weekly spending
const getAmountWeeklySpending = async (req, res) => {
    try {
        // Fetch user-specific invoices
        const invoices = await Invoice.find({ userId: req.user._id });

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
}

// API to get categorywise spending
const getCategoryWiseSpending = async (req, res) => {
    try {
        
        const invoices = await Invoice.find({ userId: req.user._id });

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
        const categoryCount = await Invoice.aggregate([
            {
                $match: { userId: req.user._id }
            },
            {
                $group: {
                    _id: "$category", // Group by category
                    count: { $sum: 1 } // Count occurrences
                }
            }
        ]);

        const totalReceipts = categoryCount.reduce((sum, category) => sum + category.count, 0);

        res.json({ success: true, data: categoryCount, totalReceipts });
    } catch (error) {
        console.error("Error fetching category count:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    extractInvoice,    
    updateInvoiceData,
    getInvoiceDataFromCategory,
    getInvoiceDataById,
    getCountOfSpecificCategory,
    getReceiptsByDateRange,
    getUserSpcificInvoice,
    deleteInvoiceData,
    getAmountWeeklySpending,
    getCategoryWiseSpending,
    getInvoiceCategoryCount
};