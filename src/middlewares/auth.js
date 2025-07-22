const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const userAuth = async(req, res, next) => {
  try{const cookies = req.cookies;
    const { Token } = cookies;

    if (!Token) {
      throw new Error("TOKEN INVALID");
    }
    
    const decodedMessage = await jwt.verify(Token, "shivangshekha2807");
    
    const { _id } = decodedMessage;

    const user = await UserModel.findById(_id)
    
    if (!user) {
        throw new Error("USER NOT FOUND");
    }
      req.user=user;
      
      next();
  }
  catch (err) {
      res.status(400).send("ERROR :"+err.message)
    }

};

module.exports = {userAuth};