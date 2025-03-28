const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/invoiceController");
const authMiddleware = require("../middleware/authMiddleware")
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


router.post("/extract", authMiddleware, upload.single("file"), extractInvoice);

//? GET invoices based on category
router.get("/api/user-invoices/category/:category", authMiddleware, getInvoiceDataFromCategory);

// GET invoice by id
router.get("/api/invoices/:id", getInvoiceDataById);

router.get("/api/invoices/category-count/:category", getCountOfSpecificCategory);

// update the latest inserted data
router.put("/api/invoices/:invoiceId", updateInvoiceData);

// delete invoice
router.delete("/api/delete-invoice/:invoiceId", authMiddleware, deleteInvoiceData);

// Get all invoices for a specific user
router.get("/api/user-invoices", authMiddleware, getUserSpcificInvoice);

router.get("/api/invoices/filter/by-date", authMiddleware, getReceiptsByDateRange);

router.get("/api/user-weekly-amounts", authMiddleware, getAmountWeeklySpending);

router.get("/api/categorywise-spending", authMiddleware, getCategoryWiseSpending);

router.get("/api/invoice-category-count", authMiddleware, getInvoiceCategoryCount);


module.exports = router;