
const express = require('express');
const app = express();
const authRouter = express.Router();


const UserModel = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

app.use(express.json());
app.use(cookieParser());



authRouter.post("/signUp", async (req, res, next) => {
  const { password, firstName, lastName, email, gender, photoUrl } = req.body;

  try {
    validateSignUpData(req);

    const hashPassword = await bcrypt.hash(password, 10);

    console.log("hashPassword", hashPassword);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      gender,
      photoUrl,
      password: hashPassword,
    });

    const userRes = await user.save();

    res.send(`User Added Successfully ${userRes}`);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});



authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailPresent = await UserModel.findOne({ email });

    if (!emailPresent) {
      throw new Error("Email Not Found");
    }

    const passwordPresent = await bcrypt.compare(
      password,
      emailPresent.password
    );

    if (passwordPresent) {
      const token = await jwt.sign(
        { _id: emailPresent._id },
        "shivangshekha2807",
        {
          expiresIn: "1d",
        }
      );

      console.log("token", token);

      res.cookie("Token", token);
      res.json({
        message: "Login Successfull",
        user: emailPresent,
      });
    } else {
      throw new Error("Password Incorrect");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});


authRouter.post('/logout', async (req, res) => {
    res.cookie('Token', null, {
        expires: new Date(Date.now()),
    });
    res.send("LOGOUT SUCCESSFULL")
})

module.exports = authRouter;