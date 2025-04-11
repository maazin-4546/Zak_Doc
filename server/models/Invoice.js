const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        invoice_number: String,
        date: String,
        company_name: String,
        vendor_name: String,
        tax_amount: String,
        total: String,
        category: String,
        isProcess: Boolean,
        isSyncedToZoho: {
            type: Boolean,
            default: false,
        },
        zohoInvoiceId: {
            type: String,
            default: null,
        },
        products: [
            {
                product_name: String,
                quantity: Number,
                unit_amount: String,
            },
        ],
    },
    { timestamps: true }
);



const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;


