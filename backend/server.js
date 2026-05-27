const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai'); // Import the modern Google Gen AI SDK
const connectDB = require('./config/db');
const upload = require('./middleware/upload');
const Document = require('./models/Document');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database connection core
connectDB();

// Initialize the Google Gen AI core engine with our secured environment token
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Core Middleware Pipeline
app.use(cors());
app.use(express.json());

// Base Server Verification Route
app.get('/', (req, res) => {
    res.send("Amber Insight Server Core is Online.");
});

/**
 * @route   POST /api/documents/upload
 * @desc    Receives a single PDF document, extracts its text, passes it to 
 * Google Gemini for automated analysis, and saves the full payload to MongoDB.
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

        // 2. Initialize the modern class constructor for PDF text extraction
        const parser = new PDFParse({ data: dataBuffer });

        let extractedText = '';
        let totalPages = 1;

        try {
            const textResult = await parser.getText();
            extractedText = typeof textResult === 'string' ? textResult : (textResult.text || '');

            const infoResult = await parser.getInfo();
            totalPages = infoResult?.total || 1;
        } finally {
            // Memory clean up: Free up local server system workers
            if (typeof parser.destroy === 'function') {
                await parser.destroy();
            }
        }

        // Structural validation check
        if (!extractedText.trim()) {
            throw new Error("The document appears to be empty or contains non-extractable text layouts.");
        }

        // 3. 🧠 THE AI ANALYTICAL PROCESSING LAYER
        console.log(`🤖 Dispatching text from "${req.file.filename}" to Gemini Cloud...`);

        // Utilizing gemini-2.5-flash for balanced speed, token efficiency, and text processing depth
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
                You are the core analytical engine of Amber Insight. 
                Analyze the following raw document text extracted from a file named "${req.file.filename}".
                
                Provide your analysis in two clear parts:
                1. A comprehensive summary of the core message, themes, or purpose of the document.
                2. A list of 3-5 critical, actionable key insights or structural data points discovered inside.

                Raw Text to Analyze:
                ${extractedText}
            `
        });

        // Capture the generated text block from the payload return structure
        const aiAnalysisResult = aiResponse.text || "AI layer executed but returned an empty text string.";

        // Clean up and parse the lines to look for bulleted key insights for our array field
        const processedInsights = aiAnalysisResult
            .split('\n')
            .filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
            .map(line => line.replace(/^[-\d.\s]+/, '').trim());

        // 4. Construct a new structural record inside our Mongoose schema
        const newDocument = new Document({
            fileName: req.file.filename,
            fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
            rawText: extractedText,
            summary: aiAnalysisResult, // Hydrating database schema with actual generative text!
            extractedInsights: processedInsights.length > 0 ? processedInsights : [`Total pages processed: ${totalPages}`]
        });

        // 5. Persist the complete document profile directly into MongoDB Cluster
        const savedDocument = await newDocument.save();

        // 6. Respond back to the React UI dashboard with the completed record profile
        res.status(201).json({
            message: "Document successfully uploaded, parsed, and analyzed by Gemini!",
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