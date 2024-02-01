const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

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

app.listen(8081, () => {
    console.log("listening on port 8081...");
})