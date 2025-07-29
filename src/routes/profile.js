
const express = require('express');
const app = express();
const profileRouter = express.Router();

const UserModel = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");


app.use(express.json());
app.use(cookieParser());

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const userProfile = req.user;

    if (!userProfile) {
      throw new Error("NO USER FOUND");
    }

    res.send("Your Profile is :" + userProfile);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
         if (!validateEditProfileData(req)) {
        throw new Error("Edit Not ALLOWED")
         }
        
        const editUser = req.user;
        console.log(editUser);
        Object.keys(req.body).forEach((key)=>(editUser[key]=req.body[key]))
        console.log(editUser);

       await editUser.save();

        res.json({
            message: `${editUser.firstName} your profile is updated successfully`,
            data:editUser
        });
    }
    catch (err) {
        res.status(400).send("ERROR :"+err.message)
    }

   
    
})


module.exports = profileRouter;