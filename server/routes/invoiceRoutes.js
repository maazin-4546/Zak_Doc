const express = require("express");
const router = express.Router();
const {
    getAllInvoiceData,
    extractInvoice,
    updateInvoiceData,
    getInvoiceDataFromCategory,
    getInvoiceDataById,
    getCountOfSpecificCategory,
    getReceiptsByDateRange,
    getUserSpcificInvoice,
} = require("../controllers/invoiceController");
const authMiddleware = require("../middleware/authMiddleware")
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Invoice = require("../models/Invoice");
//* Path Parameters

router.post("/extract", authMiddleware, upload.single("file"), extractInvoice);

// GET all invoices
router.get("/api/invoices", getAllInvoiceData);

// GET invoices based on category
router.get("/api/invoices/category/:category", getInvoiceDataFromCategory);

// GET invoice by id
router.get("/api/invoices/:id", getInvoiceDataById);

router.get("/api/invoices/category-count/:category", getCountOfSpecificCategory);

// update the latest inserted data
router.put("/api/invoices/:invoiceId", updateInvoiceData);

// Get all invoices for a specific user
router.get("/api/user-invoices", authMiddleware, getUserSpcificInvoice);

//* Filter invoice routes (Query Parameters)
router.get("/api/invoice-date/", getReceiptsByDateRange);



module.exports = router;