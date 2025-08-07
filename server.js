const express = require('express');
const bodyparser = require('body-parser');
const router = require('./Routes/route');
// const cors = require('cors');
// const dotenv = require('dotenv');
// dotenv.config();
const mysql = require('mysql2');


const app = express();
// app.use(cors());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


// API routes
app.use("/api", router);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the School Management API");
});

// Server start
const PORT = process.env.PORT ;
app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
