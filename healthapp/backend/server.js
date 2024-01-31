const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.unsubscribe(cors());
const db = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login Where name = ? AND surname = ? AND password = ?";
    const values = [
        req.body.name,
        req.body.surname,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.jason("Login Failed");
        return res.json(data);
    })
})

app.listen(8081, () => {
    console.log("listening...");
})