const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();
const connectDB = require("./db/connection");
const Invoice = require("./models/Invoice");
const invoiceRoutes = require("./routes/invoices");

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

app.use(cors());
app.use(express.json());
app.use(invoiceRoutes);

connectDB();

// Configure Multer for file upload
const upload = multer({ dest: "uploads/" });

const MODEL_CONFIG = {
    temperature: 0.2,
    topP: 1,
    topK: 32,
    maxOutputTokens: 4096,
};


const imageToBase64 = (imagePath) => {
    return fs.readFileSync(imagePath).toString("base64");
};

// Function to extract data from the image
const extractInvoiceData = async (imagePath) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imageBase64 = imageToBase64(imagePath);
        const imageParts = [{ inlineData: { mimeType: "image/png", data: imageBase64 } }];

        const userPrompt = `You are an expert in document data extraction. Extract only the relevant fields from this invoice image and return a **valid JSON object**. Follow these rules:

        1️⃣ **General Fields**:
        - "invoice_number": The unique invoice number.
        - "date": The **invoice date** (ignore order, shipping, or due dates).
        - "company_name": The **billing company** (not vendor or customer).
        - "vendor_name": The **seller or supplier** of the product.
        - "tax_amount": The **total tax applied**.
        - "total": The **final amount after tax**.

        2️⃣ **Products Section**:
        - "products": A list of objects, each containing:
            - "product_name": The **exact product/service name**.
            - "quantity": The **number of units purchased**.
            - "unit_amount": The **price per unit**.
        
        3️⃣ **Data Handling**:
        - If a field **does not exist**, return **null**.
        - **Ensure JSON validity**, no Markdown formatting.
        - Return data in **proper JSON format**, enclosed in curly braces { }.
        - If multiple products exist, return all in the "products" array.
        - Do **not** return unnecessary details.

        🚀 **Expected Output Example:**
        \`\`\`json
        {
            "invoice_number": "INV-12345",
            "date": "2024-02-20",
            "company_name": "Saffron Design",
            "vendor_name": "Priya Chopra",
            "tax_amount": 1469.52,
            "total": 13715.52,
            "products": [
                { "product_name": "Frontend design restructure", "quantity": 1, "unit_amount": 9999 },
                { "product_name": "Backend API setup", "quantity": 2, "unit_amount": 3000 }
            ]
        }
        \`\`\`
        Return only JSON output with no explanations or additional text.`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [...imageParts, { text: userPrompt }] }],
            generationConfig: MODEL_CONFIG,
        });

        let responseText = result.response.text();
        console.log("Raw Response:", responseText);  // Debugging: Log the raw response

        // Extract JSON correctly
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            responseText = jsonMatch[0];  // Extract only the JSON part
        } else {
            console.error("Failed to parse JSON from response.");
            return { error: "Invalid JSON format received." };
        }

        return JSON.parse(responseText.trim());
    } catch (error) {
        console.error("Error extracting invoice data:", error.message);
        return { error: error.message };
    }
};


// API Route: Extract and Store Invoice Data
app.post("/extract", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image uploaded" });

        const imagePath = path.resolve(req.file.path);
        const extractedData = await extractInvoiceData(imagePath);

        fs.unlinkSync(imagePath); // Delete uploaded file after processing

        if (extractedData.error) {
            return res.status(500).json({ error: extractedData.error });
        }

        
        const invoice = new Invoice({
            invoice_number: extractedData.invoice_number,
            date: extractedData.date,
            company_name: extractedData.company_name,
            vendor_name: extractedData.vendor_name || null, 
            tax_amount: extractedData.tax_amount || 0,
            total: extractedData.total,
            products: extractedData.products 
        });

        await invoice.save();

        res.json({ success: true, message: "Invoice data saved successfully!", data: invoice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
