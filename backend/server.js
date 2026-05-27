const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { PDFParse } = require('pdf-parse'); // Destructure the modern Class constructor directly
const connectDB = require('./config/db');
const upload = require('./middleware/upload');
const Document = require('./models/Document');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database connection core
connectDB();

// Core Middleware Pipeline
app.use(cors());
app.use(express.json());

// Base Server Verification Route
app.get('/', (req, res) => {
    res.send("Amber Insight Server Core is Online.");
});

/**
 * @route   POST /api/documents/upload
 * @desc    Receives a single PDF document, extracts its raw text contents via 
 * class-based parsing, and saves the complete dataset profile to MongoDB.
 * @access  Public (Development Ecosystem)
 */
app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
    try {
        // Validation check to ensure a physical file was routed through Multer
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded or file format invalid." });
        }

        // 1. Read the physical file buffer from our local uploads directory
        const dataBuffer = fs.readFileSync(req.file.path);

        // 2. Initialize the modern asynchronous class constructor
        const parser = new PDFParse({ data: dataBuffer });

        let extractedText = '';
        let totalPages = 1;

        try {
            // Explicitly invoke the text extraction promise wrapper
            const textResult = await parser.getText();
            // Pull out the exact string text content
            extractedText = typeof textResult === 'string' ? textResult : (textResult.text || '');

            // Extract total metadata pages count
            const infoResult = await parser.getInfo();
            totalPages = infoResult?.total || 1;
        } finally {
            // Crucial: Always destroy the worker stream instance to free up server system memory
            if (typeof parser.destroy === 'function') {
                await parser.destroy();
            }
        }

        // 3. Construct a new structural record inside our Mongoose schema
        const newDocument = new Document({
            fileName: req.file.filename,
            fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
            rawText: extractedText || "No selectable text could be harvested from this asset structure.",
            summary: "Pending AI generation layer...",
            extractedInsights: [`Total pages processed: ${totalPages}`]
        });

        // 4. Persist the complete document profile directly into MongoDB
        const savedDocument = await newDocument.save();

        // 5. Respond back to the React UI dashboard with the saved record profile
        res.status(201).json({
            message: "Document successfully uploaded, parsed, and logged in database!",
            documentId: savedDocument._id,
            data: savedDocument
        });

    } catch (error) {
        console.error("❌ Pipeline Processing Failure:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Activate the network listening ring
app.listen(PORT, () => {
    console.log(`⚡ Amber Insight Console active on: http://localhost:${PORT}`);
});