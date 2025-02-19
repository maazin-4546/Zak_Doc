// ! This is the working code using Gemini API Key (backend only)

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Load environment variables

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const MODEL_CONFIG = {
  temperature: 0.2,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

// Function to read image as Base64
const imageToBase64 = (imagePath) => {
  const absPath = path.resolve(imagePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Image not found: ${absPath}`);
  }
  return fs.readFileSync(absPath).toString("base64");
};

// Function to get JSON output from Gemini API
const extractInvoiceData = async (imagePath) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userPrompt = "Extract the invoice details from this image and return it as a structured JSON response.";

    const imageBase64 = imageToBase64(imagePath);

    const imageParts = [{ inlineData: { mimeType: "image/png", data: imageBase64 } }];

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [...imageParts, { text: userPrompt }] },
      ],
      generationConfig: MODEL_CONFIG,
    });

    console.log("Extracted JSON Data:\n", result.response.text());
  } catch (error) {
    console.error("Error extracting invoice data:", error.message);
  }
};


const imagePath = path.join(__dirname, 'assets', 'recipt2.png');
extractInvoiceData(imagePath);
