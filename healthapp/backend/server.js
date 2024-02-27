const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();

const { runExample } = require('./articles.js');

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

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  });

app.post('/login', (req, res) => {
    let sqlQuery = "SELECT CASE WHEN EXISTS (SELECT 1 FROM users WHERE email = ?) THEN 'true' ELSE 'false' END AS result;";
    db.query(sqlQuery, [req.body.email], async (err, result) => {
        if (err) {
            console.error(err.message);
        } else if (result[0].result == 'false') {
            res.json("Email does not exist!")
        } else {
            sqlQuery = "SELECT password FROM users WHERE email = ?;";
            db.query(sqlQuery, [req.body.email], async (err, result) => {
                if (err) {
                    console.error(err.message);
                } else {
                    const isValid = await bcrypt.compare(req.body.password, result[0].password);
                    if (isValid) {
                        sqlQuery = "SELECT * FROM users WHERE email = ?;";
                        db.query(sqlQuery, [req.body.email], (err, result) => {
                            if (err) {
                                console.error(err.message);
                                res.redirect('/error'); // Redirect or handle error
                            } else {
                                const adjustedResult = result.map(user => {
                                    if (user.date_of_birth) {
                                        // Ensure user.date_of_birth is treated as a UTC string to avoid timezone issues
                                        let dateOfBirth = new Date(user.date_of_birth);
                                        // Add one day
                                        dateOfBirth.setDate(dateOfBirth.getDate() + 1);
                                        // Convert back to a string format yyyy-mm-dd
                                        let adjustedDateStr = dateOfBirth.toISOString().split('T')[0];
                                        user.date_of_birth = adjustedDateStr; // Update the date_of_birth with adjusted date
                                    }
                                    return user;
                                });
                                res.json(adjustedResult);
                            }
                        });
                    } else {
                        res.json("incorrect pasword")
                    }
                }
            });
        }
    });
})

app.post('/register', (req, res) => {
    let sqlQuery = "SELECT CASE WHEN EXISTS (SELECT 1 FROM users WHERE email = ?) THEN 'true' ELSE 'false' END AS result;";
    let data = [req.body.email];
    db.query(sqlQuery, data, async (err, result) => {
        if (err) {
            console.error(err.message);
            res.json(err.message)
        } else if (result[0].result == 'true') {
            res.json('user already exists');
        } else {
            // Insert new user
            sqlQuery = "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?,?)";
            const hash = await bcrypt.hash(req.body.password, 10);
            db.query(sqlQuery, [req.body.firstName, req.body.lastName, req.body.email, hash], (err, result) => {
                if (err) {
                    res.json(err.message);
                } else {
                    db.query("SELECT * FROM users WHERE email = ?", req.body.email, (err, result) => {
                        if (err) {
                            console.error(err.message);
                            res.redirect('/error'); // Redirect or handle error
                        } else {
                            const adjustedResult = result.map(user => {
                                if (user.date_of_birth) {
                                    // Ensure user.date_of_birth is treated as a UTC string to avoid timezone issues
                                    let dateOfBirth = new Date(user.date_of_birth);
                                    // Add one day
                                    dateOfBirth.setDate(dateOfBirth.getDate() + 1);
                                    // Convert back to a string format yyyy-mm-dd
                                    let adjustedDateStr = dateOfBirth.toISOString().split('T')[0];
                                    user.date_of_birth = adjustedDateStr; // Update the date_of_birth with adjusted date
                                }
                                return user;
                            });
                            res.json(adjustedResult);
                        }                    
                    })
                }
            });
        }
    });
})

app.post('/chatbot', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Adjust the model as per your requirement
            messages: [
                {
                    role: 'system',
                    content: 'You are a Care Compass Health professional.'
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

app.post('/api/add_questions', (req, res) => {
    try {
        let sqlQuery = "INSERT INTO Forum (user_id, title, description) VALUES (?, ?, ?)";
        let data = [req.body.user_id, req.body.title, req.body.description];
        db.query(sqlQuery, data, (err, result) => {
            if (err) {
                console.error(err.message);
            } else {
                let sqlQuery = "SELECT * FROM Forum";
                db.query(sqlQuery, (err, result) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        res.json(result);
                    }
                })
            }
        })
    } catch (error) {
        console.error(error);
    }
})

app.get('/api/get_questions', (req, res) => {
    try {
        db.query("SELECT * FROM Forum", (err, result) => {
            res.json(result);
        })
    } catch (error) {
        res.status(404).send("No Results");
    }
})

app.get('/api/articles', (req, res) => {
    try {
        db.query("SELECT * FROM Article", (err, result) => {
            if (err) {
                console.error(err);
            } else {
                res.json(result);
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/api/notifications', (req, res) => {
    try {
        const { userId } = req.body;
        db.query("SELECT * FROM medications WHERE user_id = ?;", [userId], (err, result) => {
            if (err) {
                console.error(err);
            } else {
                res.json(result);
            }
        })
    } catch (error) {
        console.error(error)
    }
})

app.delete('/api/notifications/:id', (req, res) => {
    try {
        const notificationId = req.params.id;
        db.query("DELETE FROM medications WHERE id = ?;", [notificationId], (err, result) => {
            res.status(200).json({ message: `Notification with ID ${notificationId} deleted successfully.` });
        })
    } catch (error) {
        console.error(error);
    }

});

app.post('/api/addNotification/', (req, res) => {
    try {
        let data = [req.body.name, req.body.dosage, req.body.dosage_form, req.body.frequency, req.body.userId]
        db.query("INSERT INTO medications (name, dosage, dosage_form, frequency, user_id) VALUES (?, ?, ?, ?, ?);", data, (err, result) => {
            res.json("added")
        })
    } catch (error) {
        console.error(error);
    }
})

app.post('/api/updateUser/', (req, res) => {
    try {
        const userId = req.body.userId;
        const { username, first_name, last_name, date_of_birth, email, phone, sex, blood_type, skin_type, weight, height, address } = req.body;
        const query = `
            UPDATE users
            SET 
                username = ?, 
                first_name = ?, 
                last_name = ?, 
                date_of_birth = ?, 
                email = ?, 
                phone = ?, 
                sex = ?, 
                blood_type = ?, 
                skin_type = ?, 
                weight = ?, 
                height = ?, 
                address = ?
            WHERE 
                id = ?;
        `;
        db.query(query, [username, first_name, last_name, date_of_birth, email, phone, sex, blood_type, skin_type, weight, height, address, userId], (err, result) => {
            if (err) {
                console.error(err);
            } else {
                db.query("SELECT * FROM users WHERE id = ?;", [userId], (err, result) => {
                    if (err) {
                        console.error(err);
                    } else {
                        const adjustedResult = result.map(user => {
                            if (user.date_of_birth) {
                                // Ensure user.date_of_birth is treated as a UTC string to avoid timezone issues
                                let dateOfBirth = new Date(user.date_of_birth);
                                // Add one day
                                dateOfBirth.setDate(dateOfBirth.getDate() + 1);
                                // Convert back to a string format yyyy-mm-dd
                                let adjustedDateStr = dateOfBirth.toISOString().split('T')[0];
                                user.date_of_birth = adjustedDateStr; // Update the date_of_birth with adjusted date
                            }
                            return user;
                        });
                        res.json(adjustedResult);
                    }
                })
            }
        })
    } catch (error) {
        console.error(error);
    }
})

const readline = require('readline');
const { callbackify } = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input === 'run') {
    runExample();
  }
});

app.listen(8081, () => {
    console.log("listening on port 8081...");
})