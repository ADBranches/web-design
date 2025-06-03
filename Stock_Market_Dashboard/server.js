require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

// Fix: Explicitly allow your frontend origin (replace 'null' with your actual origin)
app.use(cors({
  origin: '*', // Allow all origins (for testing)
  methods: ['GET'] // Only allow GET requests
}));

app.get('/api/stock', async (req, res) => {
  try {
    const symbol = req.query.symbol;
    if (!symbol) return res.status(400).json({ error: "Symbol is required" });

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data); // Send Alpha Vantage data directly
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));