// ! This is the working code using tesseract (integrated with UI)

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const app = express();
app.use(cors());

// Configure multer for file uploads (store in memory)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/extract-text', upload.single('file'), async (req, res) => {
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        console.log('File received:', req.file.originalname);

        // Extract text using Tesseract.js
        const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng', {
            logger: m => console.log(m) // Logs progress in the server console
        });

        console.log('Extracted Text:', text);
        res.json({ extracted_text: text });
    } catch (error) {
        console.error('Error during text extraction:', error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
