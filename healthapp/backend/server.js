const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();


const app = express();

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const db = mysql.createConnection({
    host: "localhost",
    user: "appuser",
    password: 'app2027',
    database: 'HEALTHAPP'
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    const values = [
        req.body.email,
        req.body.password
    ];
    db.query(sql, values, (err, data) => {
        if(err) return res.json(err);
        if(data.length > 0) {
            return res.json("Login Successful")
        } else {
            return res.json("No Record")
        }
    })
})

app.post('/register', (req, res) => {
    console.log(req.body.firstName, req.body.lastName, req.body.email, req.body.password,)
})

app.post('/chatbot', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Adjust the model as per your requirement
            messages: [
                {
                    role: 'system',
                    content: 'You are a Compass Care Health professional.'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
        });
        
        // Check if 'choices' exists in the response
        if (response.choices) {
            const result = response.choices[0].message.content.trim();
            res.json({ reply: result });
        } else {
            // Handle unexpected response structure
            console.error('Unexpected response structure:', response.choices[0].message.content);
            res.status(500).send('Received unexpected response structure from OpenAI.');
        }
    } catch (error) {
        console.error('OpenAI Error:', error);
        res.status(500).send('Error connecting to OpenAI');
    }
});

app.get('/api/hospitals', async (req, res) => {
    const { lat, lng } = req.query;
    const radius = 5000;
    const type = 'hospital';
    const apiKey = process.env.PLACES_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
  
    try {
      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

app.listen(8081, () => {
    console.log("listening on port 8081...");
})