const express = require("express");
const router = express.Router();
const {
    extractInvoice,    
    updateOrInsertInvoiceData,
    getInvoiceDataFromCategory,
    getReceiptsByDateRange,
    getUserSpcificInvoice,
    deleteInvoiceData,
    getAmountWeeklySpending,
    getCategoryWiseSpending,
    getInvoiceCategoryCount,
} = require("../controllers/invoiceController");
const authMiddleware = require("../middleware/authMiddleware")
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


router.post("/extract", authMiddleware, upload.single("file"), extractInvoice);

// !--------------- Invoice Operations -----------------

// Get all invoices for a specific user
router.get("/api/user-invoices", authMiddleware, getUserSpcificInvoice);

// update the latest inserted data
router.post("/api/invoices", updateOrInsertInvoiceData);


// delete invoice
router.delete("/api/delete-invoice/:invoiceId", authMiddleware, deleteInvoiceData);

// !--------------- Filter API's -----------------

// GET invoices based on category
router.get("/api/user-invoices/category/:category", authMiddleware, getInvoiceDataFromCategory);

router.get("/api/invoices/filter/by-date", authMiddleware, getReceiptsByDateRange);

// !--------------- Dashboard -----------------

router.get("/api/user-weekly-amounts", authMiddleware, getAmountWeeklySpending);

router.get("/api/categorywise-spending", authMiddleware, getCategoryWiseSpending);

router.get("/api/invoice-category-count", authMiddleware, getInvoiceCategoryCount);




module.exports = router;