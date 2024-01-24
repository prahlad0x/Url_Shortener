const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
require("dotenv").config();

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log(existingUser)
      return res
        .status(400)
        .send({ message: "User already exists!", isOk: false });
    }

    const hashedPassword = await bcrypt.hash(password, +process.env.saltRound);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful", isOk: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", isOk: false });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User doesn't exists! ", isOk: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", isOk: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.secret_key, {
      expiresIn: "3d",
    });

    res.status(200).json({ token, isOk: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", isOk: false });
  }
});

authRouter.get("/verify", async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const decoded = jwt.verify(token, process.env.secret_key);
    const user = await User.findOne({ _id: decoded.userId });

    if (!token || !decoded) {
      return res
        .status(401)
        .json({ message: "Not Verified", Is_verified: false, isOk: false });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not Verified", Is_verified: false, isOk: false });
        
    }
    return res.status(200).json({message:"Verified",Is_verified: true, isOk: true })
  } catch (error) {
    res
      .status(401)
      .json({
        message: "Authentication failed",
        Is_verified: false,
        isOk: false,
      });
  }
});

module.exports = { authRouter };
