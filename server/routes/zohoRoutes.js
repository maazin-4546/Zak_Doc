const express = require("express");
const router = express.Router();
const { fetchInvoices, addInvoices } = require("../controllers/zohoController");


router.get("/zoho/fetch-invoice", fetchInvoices);

router.post("/zoho/add-invoices", addInvoices);


module.exports = router;