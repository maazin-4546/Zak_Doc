const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoice_number: { type: String, required: true },  
    date: { type: String, required: true },
    company_name: { type: String, required: true },
    vendor_name: { type: String, required: false },
    tax_amount: { type: Number, required: false },
    total: { type: Number, required: true },
    products: [
        {
            product_name: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit_amount: { type: Number, required: true }
        }
    ]
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;




// const mongoose = require("mongoose");
// const InvoiceSchema = new mongoose.Schema({}, { strict: false }); // Allows storing any JSON format
// module.exports = mongoose.model("Invoice", InvoiceSchema);
