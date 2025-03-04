const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoice_number: { type: String, required: false },
    date: { type: String, required: false },
    company_name: { type: String, required: false },
    vendor_name: { type: String, required: false },
    tax_amount: { type: String, required: false },
    total: { type: String, required: false },
    products: [
        {
            product_name: { type: String, required: false },
            quantity: { type: Number, required: false },
            unit_amount: { type: String, required: false }
        }
    ]
});


const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;


