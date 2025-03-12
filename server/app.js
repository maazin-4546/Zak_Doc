const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const connectDB = require("./db/connection");
const Invoice = require("./models/Invoice");
const Category = require("./models/Category");
const invoiceRoutes = require("./routes/invoices");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

app.use(cors());
app.use(express.json());
app.use(invoiceRoutes);

connectDB();

// Configure Multer for file uploads (PDFs & Images)
const upload = multer({ dest: "uploads/" });

const MODEL_CONFIG = {
  temperature: 0.2,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

// Convert image to base64
const imageToBase64 = (imagePath) => {
  return fs.readFileSync(imagePath).toString("base64");
};

// **Extract invoice data from an image using Gemini**
const extractInvoiceFromImage = async (imagePath) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = imageToBase64(imagePath);
    const imageParts = [{ inlineData: { mimeType: "image/png", data: imageBase64 } }];

    const userPrompt = `You are an expert in document data extraction. Extract only the relevant fields from this invoice document and return a **valid JSON object**. The user may upload either a **multi-page PDF** or an **image (JPG, PNG, etc.)**, so ensure proper extraction of all details from the entire document.

    The invoice may be in **English or Arabic**. Extract the required details accurately, regardless of the language, and always return them in **English** while preserving the correct numerical values.
    
    🚀 **Important Fixes for Arabic & English Extraction:**  
    ✔ Ensure **Company Name** and **Vendor Name** are **not swapped**. Use context-based extraction:  
      - **Company Name**: Typically appears **at the top**, near the logo/header, or in sections labeled as **"Company Name" (EN), "اسم الشركة" (AR)**.  
      - **Vendor Name**: Found in **billing sections**, under "Customer Name," "Billed To," or similar labels: **"اسم العميل" (AR)**.  
    ✔ **Invoice Number** detection improved by verifying it follows common formats (e.g., "INV-XXXX", "FAC-XXXX", numerical sequences).  
    ✔ Ensure **currency is extracted correctly** alongside amounts without confusion.  
    ✔ Fix **Arabic text mirroring issues** by handling right-to-left (RTL) text properly.
    ✔ **Categorize the invoice based on its details**: Extract the category to determine the nature of the expense (e.g., Travel & Transportation, Shopping, Food & Beverages, Shopping & Retail, Office & Business Expenses, Medical & Healthcare, Housing & Rent, etc.).
    
    ---
    
    ### 1️⃣ **General Fields**
    - **"invoice_number"**: Extract the invoice number **only if labeled correctly**, ensuring it follows typical patterns such as:
      - **English**: "Invoice No.", "Bill No.", "Receipt No."
      - **Arabic**: "رقم الفاتورة"
      - **Avoid extracting order numbers, shipment numbers, or unrelated numeric strings.**
      
    - **"date"**: Extract the invoice date, ensuring it is labeled as:
      - **English**: "Invoice Date"
      - **Arabic**: "تاريخ الفاتورة"
      - Ignore unrelated dates like "Shipping Date" or "Due Date."
    
    - **"company_name"**: Extract the business/entity issuing the invoice:
      - Usually appears **at the top** of the document.
      - Ignore vendor/customer details in this field.
    
    - **"vendor_name"**: Extract the buyer/customer name:
      - Usually appears in sections labeled as **"Billed To," "Customer Name," "Sold To."**
      - Ignore company details in this field.
    
    - **"category"**: Extract the **category of the invoice** based on business type, vendor name, or purchased items.
      - Possible categories: **Travel & Transportation, Shopping, Food & Beverages, Shopping & Retail, Office & Business Expenses, Medical & Healthcare, Housing & Rent, etc.**
      - **Example Output:**
        --json
    "category": "Food & Beverages"
      
    
    ---
    
    ### 2️⃣ **Amount-Related Fields (Flexible Tax Handling)**
    - **"tax_amount"**: Extract all applicable taxes.
      - **If a single tax exists**, return it as a **string** (e.g., "₹2,974.27").
      - **If multiple tax types exist**, return them as a **structured string** by concatenating tax types with their values, ensuring JSON validity.
      - **Example Outputs:**
        --json
    "tax_amount": "₹2,974.27"      
        OR  
        --json
    "tax_amount": "CGST: ₹117.40, SGST: ₹117.40, IGST: ₹0.00"

      - **Ensure flexibility in data types** to avoid validation errors.
    
    - **"total"**: The **final amount** payable, including tax.
      - **Ensure the amount includes the correct currency.**
      - **Example Output:**  
        --json
    "total": "₹13715.52"
      
    
    ---
    
    ### 3️⃣ **Products Section**
    - **"products"**: Extract all items with:
      - **"product_name"**: Preserve exact item descriptions.
      - **"quantity"**: Extract only the **numeric value** from the quantity field. If the quantity contains units (e.g., "12 Nos", "15 Pcs"), remove non-numeric characters and return only the number.
      - **Example Outputs:**
        --json
    "quantity": 12
      
        --json
    "quantity": 15
      
      - **"unit_amount"**: Ensure amount **includes currency**.
      - **Example Output:**
        --json
    "unit_amount": "$9999"
      
        
    ---
    
    ### 4️⃣ **Multi-Page PDF Handling**
    - If the document is a **multi-page PDF**, extract details **across all pages**.
    - Ensure the output remains **consistent and structured**.
    
    ---
    
    ### 5️⃣ **Data Handling**
    ✔ **Avoid Field Swapping**: Ensure company/vendor names are extracted correctly.  
    ✔ **Prevent Incorrect Invoice Number Extraction**: Verify labels and formats.  
    ✔ **Fix Arabic Mirroring Issues**: Handle RTL text properly.  
    ✔ **Ensure JSON Validity**: No markdown, return only structured JSON.  
    ✔ **Flexible Tax Handling**: Convert multi-tax objects into a structured string format to prevent validation errors.
    ✔ **Ensure Numeric Quantity Extraction**: Convert quantity values to **numbers only** by removing unit labels like "Nos", "Pcs", etc.
    ✔ **Classify the Invoice into a Relevant Category**: Extract and assign an appropriate category based on vendor name, company name, and purchased items.
    
    🚀 **Expected Output Example:**
    --json
    {
      "invoice_number": "INV-12345",
        "date": "2024-02-20",
          "company_name": "Saffron Design",
            "vendor_name": "Priya Chopra",
              "category": "Food & Beverages",
                "tax_amount": "CGST: ₹117.40, SGST: ₹117.40, IGST: ₹0.00",
                  "total": "₹13715.52",
                    "products": [
                      { "product_name": "Frontend design restructure", "quantity": 12, "unit_amount": "$9999" },
                      { "product_name": "Backend API setup", "quantity": 15, "unit_amount": "€3000" }
                    ]
    }    
    
    Return **only JSON output**, with no explanations or additional text.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [...imageParts, { text: userPrompt }] }],
      generationConfig: MODEL_CONFIG,
    });

    let responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
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

// **Extract text from PDF using Python script**
const extractTextFromPDF = (pdfPath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", ["pdf_text_extractor.py", pdfPath]);

    let extractedText = "";
    let errorMessage = "";

    pythonProcess.stdout.on("data", (data) => {
      try {
        const response = JSON.parse(data.toString().trim());
        extractedText = response.text || "";
      } catch (err) {
        errorMessage = "Error parsing JSON from Python output.";
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      errorMessage += data.toString();
      console.error("PDF Extraction Error:", errorMessage);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0 || !extractedText) {
        reject(new Error(errorMessage || "Failed to extract text from PDF"));
      } else {
        resolve(extractedText);
      }
    });
  });
};

// **Extract invoice data from pdf using Gemini**
const extractInvoiceFromText = async (pdfText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userPrompt = `You are an expert in document data extraction. Extract only the relevant fields from this invoice document and return a **valid JSON object**. The user may upload either a **multi-page PDF** or an **image (JPG, PNG, etc.)**, so ensure proper extraction of all details from the entire document.

    The invoice may be in **English or Arabic**. Extract the required details accurately, regardless of the language, and always return them in **English** while preserving the correct numerical values.
    
    🚀 **Important Fixes for Arabic & English Extraction:**  
    ✔ Ensure **Company Name** and **Vendor Name** are **not swapped**. Use context-based extraction:  
      - **Company Name**: Typically appears **at the top**, near the logo/header, or in sections labeled as **"Company Name" (EN), "اسم الشركة" (AR)**.  
      - **Vendor Name**: Found in **billing sections**, under "Customer Name," "Billed To," or similar labels: **"اسم العميل" (AR)**.  
    ✔ **Invoice Number** detection improved by verifying it follows common formats (e.g., "INV-XXXX", "FAC-XXXX", numerical sequences).  
    ✔ Ensure **currency is extracted correctly** alongside amounts without confusion.  
    ✔ Fix **Arabic text mirroring issues** by handling right-to-left (RTL) text properly.
    ✔ **Categorize the invoice based on its details**: Extract the category to determine the nature of the expense (e.g., Travel & Transportation, Shopping, Food & Beverages, Shopping & Retail, Office & Business Expenses, Medical & Healthcare, Housing & Rent, etc.).
    
    ---
    
    ### 1️⃣ **General Fields**
    - **"invoice_number"**: Extract the invoice number **only if labeled correctly**, ensuring it follows typical patterns such as:
      - **English**: "Invoice No.", "Bill No.", "Receipt No."
      - **Arabic**: "رقم الفاتورة"
      - **Avoid extracting order numbers, shipment numbers, or unrelated numeric strings.**
      
    - **"date"**: Extract the invoice date, ensuring it is labeled as:
      - **English**: "Invoice Date"
      - **Arabic**: "تاريخ الفاتورة"
      - Ignore unrelated dates like "Shipping Date" or "Due Date."
    
    - **"company_name"**: Extract the business/entity issuing the invoice:
      - Usually appears **at the top** of the document.
      - Ignore vendor/customer details in this field.
    
    - **"vendor_name"**: Extract the buyer/customer name:
      - Usually appears in sections labeled as **"Billed To," "Customer Name," "Sold To."**
      - Ignore company details in this field.
    
    - **"category"**: Extract the **category of the invoice** based on business type, vendor name, or purchased items.
      - Possible categories: **Travel & Transportation, Shopping, Food & Beverages, Shopping & Retail, Office & Business Expenses, Medical & Healthcare, Housing & Rent, etc.**
      - **Example Output:**
        --json
    "category": "Food & Beverages"
      
    
    ---
    
    ### 2️⃣ **Amount-Related Fields (Flexible Tax Handling)**
    - **"tax_amount"**: Extract all applicable taxes.
      - **If a single tax exists**, return it as a **string** (e.g., "₹2,974.27").
      - **If multiple tax types exist**, return them as a **structured string** by concatenating tax types with their values, ensuring JSON validity.
      - **Example Outputs:**
        --json
    "tax_amount": "₹2,974.27"      
        OR  
        --json
    "tax_amount": "CGST: ₹117.40, SGST: ₹117.40, IGST: ₹0.00"

      - **Ensure flexibility in data types** to avoid validation errors.
    
    - **"total"**: The **final amount** payable, including tax.
      - **Ensure the amount includes the correct currency.**
      - **Example Output:**  
        --json
    "total": "₹13715.52"
      
    
    ---
    
    ### 3️⃣ **Products Section**
    - **"products"**: Extract all items with:
      - **"product_name"**: Preserve exact item descriptions.
      - **"quantity"**: Extract only the **numeric value** from the quantity field. If the quantity contains units (e.g., "12 Nos", "15 Pcs"), remove non-numeric characters and return only the number.
      - **Example Outputs:**
        --json
    "quantity": 12
      
        --json
    "quantity": 15
      
      - **"unit_amount"**: Ensure amount **includes currency**.
      - **Example Output:**
        --json
    "unit_amount": "$9999"
      
        
    ---
    
    ### 4️⃣ **Multi-Page PDF Handling**
    - If the document is a **multi-page PDF**, extract details **across all pages**.
    - Ensure the output remains **consistent and structured**.
    
    ---
    
    ### 5️⃣ **Data Handling**
    ✔ **Avoid Field Swapping**: Ensure company/vendor names are extracted correctly.  
    ✔ **Prevent Incorrect Invoice Number Extraction**: Verify labels and formats.  
    ✔ **Fix Arabic Mirroring Issues**: Handle RTL text properly.  
    ✔ **Ensure JSON Validity**: No markdown, return only structured JSON.  
    ✔ **Flexible Tax Handling**: Convert multi-tax objects into a structured string format to prevent validation errors.
    ✔ **Ensure Numeric Quantity Extraction**: Convert quantity values to **numbers only** by removing unit labels like "Nos", "Pcs", etc.
    ✔ **Classify the Invoice into a Relevant Category**: Extract and assign an appropriate category based on vendor name, company name, and purchased items.
    
    🚀 **Expected Output Example:**
    --json
    {
      "invoice_number": "INV-12345",
        "date": "2024-02-20",
          "company_name": "Saffron Design",
            "vendor_name": "Priya Chopra",
              "category": "Food & Beverages",
                "tax_amount": "CGST: ₹117.40, SGST: ₹117.40, IGST: ₹0.00",
                  "total": "₹13715.52",
                    "products": [
                      { "product_name": "Frontend design restructure", "quantity": 12, "unit_amount": "$9999" },
                      { "product_name": "Backend API setup", "quantity": 15, "unit_amount": "€3000" }
                    ]
    }    
    
    Return **only JSON output**, with no explanations or additional text.  
    
    ** Text Input:** ${pdfText} `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: MODEL_CONFIG,
    });

    let responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
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

//* Main API Route to Process File (PDF or Image)
app.post("/extract", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.resolve(req.file.path);
    let extractedData;

    // **Process PDF**
    if (req.file.mimetype === "application/pdf") {
      console.log("Processing PDF file...");
      const extractedText = await extractTextFromPDF(filePath);
      extractedData = await extractInvoiceFromText(extractedText);
    }
    // **Process Image**
    else if (req.file.mimetype.startsWith("image/")) {
      console.log("Processing Image file...");
      extractedData = await extractInvoiceFromImage(filePath);
    }
    // **Unsupported File Type**
    else {
      return res.status(400).json({ error: "Unsupported file format. Upload a PDF or an image." });
    }

    // Delete uploaded file after processing
    fs.unlinkSync(filePath);

    if (extractedData.error) {
      return res.status(500).json({ error: extractedData.error });
    }

    // Save extracted data to database
    const invoice = new Invoice({
      invoice_number: extractedData.invoice_number,
      date: extractedData.date,
      company_name: extractedData.company_name,
      vendor_name: extractedData.vendor_name || null,
      tax_amount: extractedData.tax_amount || 0,
      total: extractedData.total,
      products: extractedData.products,
      category: extractedData.category,
      isProcess: true,
    });

    await invoice.save();

    // Update or Insert Category in the Category Table
    const existingCategory = await Category.findOne({ category: extractedData.category });
    if (existingCategory) {
      existingCategory.count += 1;
      await existingCategory.save();
    } else {
      const newCategory = new Category({
        category: extractedData.category,
        count: 1,
      });
      await newCategory.save();
    }

    res.json({ success: true, message: "Invoice data and category updated successfully!", data: invoice });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
