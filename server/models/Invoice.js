const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoice_number: { type: String },
    date: { type: String },
    company_name: { type: String },
    vendor_name: { type: String },
    tax_amount: { type: String },
    total: { type: String },
    products: [
        {
            product_name: { type: String },
            quantity: { type: Number },
            unit_amount: { type: String }
        }
    ]
});


const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;


