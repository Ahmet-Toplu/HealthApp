const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');
require('dotenv').config();


const app = express();

app.use(express.json());
app.use(cors());

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

app.get('/api/hospitals', async (req, res) => {
    const { lat, lng } = req.query;
    const radius = 5000;
    const type = 'hospital';
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Ensure your API key is securely stored
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