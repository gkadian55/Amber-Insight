const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Amber Insight Server Core is Online.");
});

app.listen(PORT, () => {
    console.log(`Amber Insight Console active on: http://localhost:${PORT}`);
});