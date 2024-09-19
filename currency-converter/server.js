const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 3000;
const apiKey = process.env.API_KEY;

app.get('/api/rates', async (req, res) => {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching currency data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});