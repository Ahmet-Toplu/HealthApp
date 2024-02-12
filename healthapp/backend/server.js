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

const questions = [
    {
        id: 1,
        title: "Title 1",
        description: "Description 1"
    },
    {
        id: 2,
        title: "Title 2",
        description: "Description 2"
    }
]

let _id = 0;

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
    let sqlQuery = "SELECT CASE WHEN EXISTS (SELECT 1 FROM users WHERE username = ? OR email = ?) THEN 'true' ELSE 'false' END AS result;";
    db.query(sqlQuery, [req.body.username, req.body.email], async (err, result) => {
        if (err) {
            console.error(err.message);
            res.redirect('/error'); // Redirect or handle error
        } else if (result[0].result == 'false') {
            res.redirect('/signup');
        } else {
            sqlQuery = "SELECT password FROM users WHERE username = ?;";
            db.query(sqlQuery, [req.body.username], async (err, result) => {
                if (err) {
                    console.error(err.message);
                    res.redirect('/error'); // Redirect or handle error
                } else {
                    const isValid = await bcrypt.compare(req.body.password, result[0].password);
                    if (isValid) {
                        sqlQuery = "SELECT * FROM users WHERE username = ?;";
                        db.query(sqlQuery, [req.body.username], (err, result) => {
                            if (err) {
                                console.error(err.message);
                                res.redirect('/error'); // Redirect or handle error
                            } else {
                                const user = result[0];
                                forumData.username = user.username;
                                forumData.userID = user.id;
                                forumData.password = user.password;
                                res.redirect('/index');
                            }
                        });
                    } else {
                        res.redirect('/signup');
                    }
                }
            });
        }
    });
})

app.post('/register', (req, res) => {
    let sqlQuery = "SELECT CASE WHEN EXISTS (SELECT 1 FROM users WHERE username = ? OR email = ?) THEN 'true' ELSE 'false' END AS result;";
    let data = [req.body.firstName, req.body.lastName, req.body.email];
    db.query(sqlQuery, data, async (err, result) => {
        if (err) {
            console.error(err.message);
            res.redirect('/error'); // Redirect or handle error
        } else if (result[0].result == 'true') {
            res.json('User already exists!');
        } else {
            // Insert new user
            sqlQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
            const hash = await bcrypt.hash(req.body.password, 10);
            db.query(sqlQuery, [req.body.username, req.body.email, hash], (err, result) => {
                if (err) {
                    console.error(err.message);
                    res.redirect('/error'); // Redirect or handle error
                } else {
                    forumData.username = req.body.username;
                    res.json(`User added to database. <br> <a href="/">Home Page</a>`);
                }
            });
        }
    });
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
        
        console.log(response.choices[0].message.content);

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

app.get('/api/contact', async (req, res) => {
    const { lat, lng } = req.query;
    const radius = 5000;
    const type = 'hospital';
    const apiKey = process.env.PLACES_API_KEY;
    const nearbySearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
  
    try {
        const searchResponse = await axios.get(nearbySearchUrl);
        const places = searchResponse.data.results;
        const detailsPromises = places.map(place =>
            axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website&key=${apiKey}`)
        );
        const detailsResponses = await Promise.all(detailsPromises);
        const hospitalDetails = detailsResponses.map(response => response.data.result);
        res.json(hospitalDetails);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
});

app.post('/api/add_questions', async (req, res) => {
    try {
        if (_id <= questions[questions.length - 1].id) {
            _id = questions[questions.length - 1].id + 1;
        }
        questions.push({ id: _id, title: req.body.title, description: req.body.description});
        res.json(questions[questions.length - 1]);
    } catch (error) {
        console.error(error);
    }
})

app.get('/api/get_questions', async (req, res) => {
    try {
        res.json(questions);
    } catch (error) {
        res.status(404).send("No Results");
    }
})

app.listen(8081, () => {
    console.log("listening on port 8081...");
})