const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoice_number: String,
    date: String,
    company_name: String,
    vendor_name: String,
    tax_amount: String,
    total: String,
    category: String,
    isProcess: Boolean,
    products: [
        {
            product_name: String,
            quantity: Number,
            unit_amount: String
        }
    ]
},
    { timestamps: true },
);


const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;


