const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT;
const cors = require("cors");
const jwt = require("jsonwebtoken")


require('dotenv').config();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



mongoose
  .connect(
    process.env.MONGO_URI ,
    {
      useNewUrlParser: true,
      useunifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB");
  });

app.listen(port, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
