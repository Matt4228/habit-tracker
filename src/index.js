const express = require('express');
const axios = require('axios');
const mysql = require('mysql')

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000'
});

db.connect(err => {
  if(err) {
    throw err
  }
  console.log('Database connected!')
});

app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE habitsql"
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("Database Created")
  })
});

app.get('/createusers', (req,res) => {
  let sql = 'CREATE TABLE users(user_id INT NOT NULL AUTO_INCREMENT, username VARCHAR(45) NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY (user_id)'
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("User table Created")
  })
});

app.get('/createhabits', (req,res) => {
  let sql = 'habit_id INT NOT NULL AUTO_INCREMENT, user_id INT NULL, habit_name VARCHAR(100) NOT NULL, start_date VARCHAR(45) NOT NULL, goal INT ZEROFILL NULL, PRIMARY KEY (habit_id), CONSTRAINT user_id FOREIGN KEY (user_id), REFERENCES mydb.users (user_id)'
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("Habits table Created")
  })
});

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/random');
    const quote = response.data;
    res.send(`<p>${quote.content}</p>`);
  } catch (error) {
    console.error(error);
    res.send('Error fetching quote');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});