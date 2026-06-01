const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai'); // Modern Google Gen AI SDK
const connectDB = require('./config/db');
const upload = require('./middleware/upload');
const Document = require('./models/Document');
const { optionalAuth } = require('./middleware/auth'); // Import the new security layer

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

// Serve uploaded files statically so the frontend can reference them if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Authentication Routing Module (Handles /api/auth/signup and /api/auth/login)
app.use('/api/auth', require('./routes/authRoutes'));

// Base Server Verification Route
app.get('/', (req, res) => {
    res.send("Amber Insight Server Core is Online.");
});

/**
 * @route   POST /api/documents/upload
 * @desc    Ingests an asset (PDF, PNG, JPG), binds user association if authorized, 
 * and streams it to Gemini for insight compiling.
 * @access  Public / User Conditional
 */
app.post('/api/documents/upload', optionalAuth, upload.single('file'), async (req, res) => {
    try {
        // Validation check to ensure a physical file was routed through Multer
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded or file format invalid." });
        }

        // 1. Read the physical file buffer from our local uploads directory
        const fileBuffer = fs.readFileSync(req.file.path);

        // 2. Map file extension to its corresponding MIME type for Gemini's structural engine
        const ext = path.extname(req.file.originalname).toLowerCase();
        let mimeType = 'application/pdf'; // Default fallback

        if (ext === '.png') mimeType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        if (ext === '.txt') mimeType = 'text/plain';

        console.log(`🤖 Processing multi-format asset: "${req.file.filename}" [MIME: ${mimeType}]`);
        console.log(`🚀 Streaming asset data and system analytics core prompt to Gemini...`);

        // 3. 🧠 MULTIMODAL DIRECT PASS CONTEXT PROCESSING
        const systemPrompt = `
        You are the elite Core Analytical Engine of Amber Insight. Your objective is to perform a rigorous, expert-level document intelligence analysis on the attached asset: "${req.file.originalname}".

        Analyze the provided document thoroughly and synthesize your findings into a beautifully structured, executive-grade intelligence report.

        CRITICAL FORMATTING REQUIREMENT: You must structure your entire response using the exact two-part layout detailed below. Use clean, professional Markdown syntax (headers, bolding, bullet points). Do not wrap the parts in unnecessary conversational fluff.

        ---
        ### 🧠 Comprehensive AI Summary
        [Provide a sophisticated, multi-paragraph architectural overview of the core message, themes, purpose, and underlying context of the document. Synthesize complex ideas into a highly scannable, deeply informative narrative.]

        ### ⚡ Target Insights Matrix
        [Provide exactly 3 to 5 critical, highly specific, and actionable key insights, operational metrics, or structural data points discovered inside the asset. Format this section as a clean bulleted list where each bullet begins with a bolded theme or key metric, followed by a detailed explanation. Ensure these are high-value takeaways.]
        ---

        Operational Directives:
        - Maintain a sharp, authoritative, and objective analytical tone.
        - Extract concrete data points, dates, or technical specifics directly from the document if present.
        - Do not invent, hallucinate, or extrapolate facts beyond what is explicitly stated or strongly implied by the structural data in the file.
        `;

        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: systemPrompt },
                        {
                            inlineData: {
                                data: fileBuffer.toString("base64"),
                                mimeType: mimeType
                            }
                        }
                    ]
                }
            ]
        });

        // Capture the generated text block from the payload return structure
        const aiAnalysisResult = aiResponse.text || "AI engine executed but returned a blank stream.";

        // 4. Clean up and parse the lines to isolate target metrics for our array field
        const processedInsights = aiAnalysisResult
            .split('\n')
            .map(line => line.trim())
            .filter(line => {
                const isListItem = line.startsWith('-') || line.startsWith('*') || /^\d+\.\s/.test(line);
                const isSectionHeader = line.toLowerCase().includes('summary') || line.toLowerCase().includes('comprehensive');
                return isListItem && !isSectionHeader;
            })
            .map(line => line.replace(/^[-*\d.\s]+/, '').trim())
            .filter(line => line.length > 0);

        // 5. Construct a new structural record inside our Mongoose schema
        const newDocument = new Document({
            fileName: req.file.originalname,
            fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
            rawText: `[Asset Multi-Format Binary - Ingested via Native Gemini Multimodal Context Pipeline]`,
            summary: aiAnalysisResult,
            extractedInsights: processedInsights.length > 0 ? processedInsights : ["Analysis finalized successfully."],
            // 🟢 AUTH HYDRATION: Connects account if present, otherwise registers null as guest
            user: req.user ? req.user.id : null
        });

        // 6. Persist the complete document profile directly into MongoDB Cluster
        const savedDocument = await newDocument.save();

        // 7. Respond back to the React UI dashboard with the completed record profile
        res.status(201).json({
            message: "Asset successfully parsed and analyzed by Gemini Multimodal Core!",
            documentId: savedDocument._id,
            data: savedDocument
        });

    } catch (error) {
        console.error("❌ Multimodal Ingestion Pipeline Failure:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /api/documents
 * @desc    Retrieves analyzed document profiles. If user is logged in, filters only their history.
 * Guests receive a 401 error or can be routed to zero context.
 * @access  Public / User Conditional
 */
app.get('/api/documents', optionalAuth, async (req, res) => {
    try {
        // If logged in, match their unique user ID reference. Guests get an empty array.
        const queryFilter = req.user ? { user: req.user.id } : { user: "GUEST_NO_HISTORY_STUB" };

        const documents = await Document.find(queryFilter).sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (error) {
        console.error("❌ History Retrieval Failure:", error.message);
        res.status(500).json({ error: "Failed to fetch document tracking list." });
    }
});

/**
 * @route   GET /api/documents/:id
 * @desc    Fetches a single standalone document analysis profile by its MongoDB ObjectId
 * @access  Public
 */
app.get('/api/documents/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ error: "Document analysis profile not found." });
        }
        res.status(200).json(document);
    } catch (error) {
        console.error("❌ Single Document Sync Failure:", error.message);
        res.status(500).json({ error: "Invalid ID format or database error." });
    }
});

// Activate the network listening ring
app.listen(PORT, () => {
    console.log(`⚡ Amber Insight Console active on: http://localhost:${PORT}`);
});