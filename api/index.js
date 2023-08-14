const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
const jwt = require("jsonwebtoken")

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



mongoose
  .connect(
    "mongodb+srv://Marzooq:securePass@cluster0.u6xslkm.mongodb.net/ecommerce?retryWrites=true&w=majority",
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
  console.log(`server is running on port ${port}`);
});
