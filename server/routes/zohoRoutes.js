const express = require("express");
const router = express.Router();
const { fetchInvoices, addInvoices, updateInvoice } = require("../controllers/zohoController");


router.get("/zoho/fetch-invoice", fetchInvoices);

router.post("/zoho/add-invoices", addInvoices);

router.put("/zoho/update-invoices/:invoiceId", updateInvoice);


module.exports = router;