
const express = require('express');
const app = express();
const requestRouter = express.Router();


const UserModel = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

app.use(express.json());
app.use(cookieParser());

requestRouter.post('/sendConnectionRequest', userAuth, (req, res) => {
    
    const user = req.user;

    res.send(user.firstName+"send the connect request")
})

module.exports = requestRouter;