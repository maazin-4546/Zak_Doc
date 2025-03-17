const express = require("express");
const router = express.Router();
const { getAllInvoiceData, extractInvoice, updateInvoiceData } = require("../controllers/invoiceController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/extract", upload.single("file"), extractInvoice);

// GET all invoices
router.get("/api/invoices", getAllInvoiceData);

// update the latest inserted data
router.put("/api/invoices/:invoiceId", updateInvoiceData);


module.exports = router;