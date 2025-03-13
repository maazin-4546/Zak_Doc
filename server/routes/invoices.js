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


// get latest inserted data
router.get("/api/invoices/latest", async (req, res) => {
    try {
        // Fetch the last inserted invoice (sorted by `_id` in descending order)
        const latestInvoice = await Invoice.findOne().sort({ _id: -1 });

        if (!latestInvoice) {
            return res.status(404).json({ error: "No invoices found" });
        }

        res.json({ success: true, data: latestInvoice });
    } catch (error) {
        console.error("Error fetching latest invoice:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// update the latest inserted data
router.put("/api/invoices/latest/product", async (req, res) => {
    try {
        const updatedFields = req.body;

        // Fetch the latest invoice
        const latestInvoice = await Invoice.findOne().sort({ _id: -1 });

        if (!latestInvoice) {
            return res.status(404).json({ error: "No invoices found" });
        }

        // Update invoice-level fields dynamically
        Object.keys(updatedFields).forEach((key) => {
            if (key !== "products" && updatedFields[key] !== undefined) {
                latestInvoice[key] = updatedFields[key];
            }
        });

        // Update specific product fields if `products` array is provided
        if (updatedFields.products && Array.isArray(updatedFields.products)) {
            let isProductUpdated = false;

            updatedFields.products.forEach((updatedProduct) => {
                const productIndex = latestInvoice.products.findIndex(p => p._id.toString() === updatedProduct._id);
                if (productIndex !== -1) {
                    Object.keys(updatedProduct).forEach((key) => {
                        if (key !== "_id" && updatedProduct[key] !== undefined) {
                            latestInvoice.products[productIndex][key] = updatedProduct[key];
                            isProductUpdated = true;
                        }
                    });
                }
            });

            // Mark the products array as modified if changes were made
            if (isProductUpdated) {
                latestInvoice.markModified("products");
            }
        }

        // Save the updated invoice
        await latestInvoice.save();

        res.json({ success: true, message: "Invoice updated successfully", data: latestInvoice });
    } catch (error) {
        console.error("Error updating invoice:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
