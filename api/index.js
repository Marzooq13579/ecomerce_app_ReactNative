const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT;
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useunifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB");
  });

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});

const User = require("./models/user");
const Order = require("./models/order");

//send verification mail

async function sendVerificationEmail(email, token) {
  //create a nodemailer transport

  const transporter = nodemailer.createTransport({
    //configure email service
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  //compose the email message

  const mailOptions = {
    from: "testcommerce.com",
    to: email,
    subject: "Email Verification",
    text: `Please click on the following link to verify your email: http://localhost:8000/verify/${token}`,
  };

  //send the email

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("Error sending verification email", err);
  }
}


app.get("/test", async (req, res) => {
  res.send("Hello")
})

app.post("/register", async (req, res) => {
  console.log("register request recieved")
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //create a new user

    const newUser = new User({
      name,
      email,
      password,
    });

    //Generate and store the verification token

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user

    await newUser.save();

    //send verification mail

    sendVerificationEmail(newUser.email, newUser.verificationToken);
    
    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
    });
  } catch (err) {
    console.log("error registering user", err);
    res.status(500).json({ message: "Registration Failed" });
  }
});

//Verify Token Endpoint

app.get("/verify/:token", async (req, res) => {
  console.log("verify token endpoint")
  try {
    const token = req.params.token;

    //Find the user with the given verification token

    const user = await User.findOne({ verificationToken: token });

    if(!user){
      return res.status(404).json({message:"Invalid verification token"})
    }

    //mark the user as verified

    user.verified = true
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({message: "Email verified Successfully"})

  
  } catch (error) {
    res.status(500).json({ message: "Email Verification Failed" });
  }
});
