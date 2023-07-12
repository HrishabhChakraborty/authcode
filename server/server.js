//import mysql from 'mysql'
//import express from 'express'
//import cors from ' cors'
//import session from 'express-session'
//import cookieParser from 'cookie-parser'

const express = require('express')

var session = require('express-session')
const app = express();
var cors = require('cors');
var mysql = require('mysql');
var cookieParser = require('cookie-parser')

app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'signup'
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (`username`, `email` , `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, result) => {
        if(err) return res.json({Message: "Error in Node"});
        return res.json(result);
    })
})      

app.post('/login', (req, res) => {
    const sql ="SELECT * FROM users WHERE email = ? and password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        if(result.length > 0) {
            req.session.username = result[0].username;
            console.log(req.session.username);
            return res.json({login: true})
        } else {
            return res.json({Login: false})
        }
    })
})

app.listen(8081, () => {
    console.log("connected to the server");
})