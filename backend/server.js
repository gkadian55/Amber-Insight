const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const upload = require('./middleware/upload'); // 🟢 Import our upload engine

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
    res.send("Amber Insight Server Core is Online.");
});

// 🟢 NEW: File Upload Endpoint
app.post('/api/documents/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded or file format invalid." });
        }

        // Return file metadata so the frontend knows it was safely received
        res.status(200).json({
            message: "File uploaded successfully!",
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`⚡ Amber Insight Console active on: http://localhost:${PORT}`);
});