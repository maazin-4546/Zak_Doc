// ? Backup of working code
// ! This is the working code using gemini API (integrated with UI)

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

app.use(cors());
app.use(express.json());

// Configure Multer for file upload
const upload = multer({ dest: "uploads/" });

const MODEL_CONFIG = {
    temperature: 0.2,
    topP: 1,
    topK: 32,
    maxOutputTokens: 4096,
};

// Function to read image as Base64
const imageToBase64 = (imagePath) => {
    return fs.readFileSync(imagePath).toString("base64");
};

// Function to extract data from the image
const extractInvoiceData = async (imagePath) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const userPrompt = "Extract the invoice details from this image and return a valid JSON object. Do not include Markdown, explanations, or any extra text. Just return JSON.";

        const imageBase64 = imageToBase64(imagePath);
        const imageParts = [{ inlineData: { mimeType: "image/png", data: imageBase64 } }];

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [...imageParts, { text: userPrompt }] }],
            generationConfig: MODEL_CONFIG,
        });

        let responseText = result.response.text();

        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            responseText = jsonMatch[1];
        }

        const extractedData = JSON.parse(responseText.trim());
        return extractedData;
    } catch (error) {
        console.error("Error extracting invoice data:", error.message);
        return { error: error.message };
    }
};


app.post("/extract", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image uploaded" });

        const imagePath = path.resolve(req.file.path);
        const extractedData = await extractInvoiceData(imagePath);

        fs.unlinkSync(imagePath); // Delete uploaded file after processing

        res.json({ success: true, data: extractedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
