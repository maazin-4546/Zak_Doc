const express = require('express');
const cors = require('cors');
const multer = require('multer');
const tesseract = require('tesseract.js');

const app = express();

app.use(cors());

const upload = multer();

const extractTextFromImage = async (imageBuffer) => {
    try {
        const { data: { text } } = await tesseract.recognize(imageBuffer);
        return text;
    } catch (error) {
        throw new Error(`An error occurred: ${error.message}`);
    }
};

app.post('/extract-text', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const extractedText = await extractTextFromImage(req.file.buffer);
        res.json({ extracted_text: extractedText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});