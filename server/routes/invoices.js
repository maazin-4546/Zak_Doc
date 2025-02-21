const express = require("express");
const Invoice = require("../models/Invoice");  
const router = express.Router();

// GET all invoices
router.get("/api/invoices", async (req, res) => {
    try {
        const invoices = await Invoice.find({});
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
