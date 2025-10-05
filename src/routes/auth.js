
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

    const emailPresent = await UserModel.findOne({ email });
    
    if (emailPresent) {
       throw new Error("User with this Email allready present");
    }
      
      validateSignUpData(req);

    const hashPassword = await bcrypt.hash(password, 10);

  

    const user = new UserModel({
      firstName,
      lastName,
      email,
      gender,
      photoUrl,
      password: hashPassword,
     
    });

    const userRes = await user.save();

     const token = await jwt.sign(
       {
         _id: userRes._id,
         firstName: userRes.firstName,
       },
       "shivangshekha2807",
       {
         expiresIn: "1h",
       }
     );
    
    res.cookie("Token", token);

    res.status(201).json({
      message: "User Added Successfully",
      user: userRes,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message || "Signup failed",
    });
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
        {
          _id: emailPresent._id,
          firstName: emailPresent.firstName,
        },
        "shivangshekha2807",
        {
          expiresIn: "1h",
        }
      );

      // console.log("token", token);

      res.cookie("Token", token);
      res.status(201).json({
        message: "Login Successfull",
        user: emailPresent,
      });
    } else {
      throw new Error("Password Incorrect");
    }
  } catch (err) {
    res.status(400).json({
      error: err.message || "Login failed",
    });
  }
});


authRouter.post('/logout', async (req, res) => {
    res.cookie('Token', null, {
        expires: new Date(Date.now()),
    });
    res.json({
      status: "LOGOUT SUCCESSFULL",
    });
})

module.exports = authRouter;