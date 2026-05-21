const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); // 🟢 Import our connection script

// Point dotenv specifically to the root folder's .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// 🟢 Connect to the Grid (Database)
connectDB();

// Essential Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
    res.send("Amber Insight Server Core is Online.");
});

app.listen(PORT, () => {
    console.log(`Amber Insight Console active on: http://localhost:${PORT}`);
});