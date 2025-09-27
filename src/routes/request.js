
const express = require('express');
const app = express();
const requestRouter = express.Router();


const userModel = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require('../models/connectionRequest')
const UserModel=require('../models/user')

app.use(express.json());
app.use(cookieParser());

requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req, res) => {

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"]
        
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message:"invalid status type"+status
            })
        }

        const existingConnectionrequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if (existingConnectionrequest) {
            return res.status(400).send("Connection Request already exist")
        }

        const toUser = await userModel.findById(toUserId);

        if (!toUser) {
            res.send(400).send("User not Found")
        }
        
        const connectionRequest = new ConnectionRequestModel({
          fromUserId,
          toUserId,
          status,
        });

        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + "is" + status + "in" + toUser.firstName,
            data,
        })
    }
    catch (err) {
        res.status(400).send("ERROR :"+err.message)
        
    }
    
    const user = req.user;

    res.send(user.firstName+"send the connect request")
})




requestRouter.post('/request/review/:status/:fromUserId', userAuth, async(req, res) => {

    try {
    const status = req.params.status;
    const fromUserId = req.params.fromUserId;
    const toUserId = req.user._id;

    const allowedStatus = ["accepted", "rejected"];

    const allowed = allowedStatus.includes(status);

    if (!allowed) {
        throw new Error("Status Not valid")
    }
        
        const connectionRequest = await ConnectionRequestModel.findOne({
           fromUserId,
          toUserId,
          status:"interested"
        });

        if (!connectionRequest) {
            throw new Error("Connection Request Not Found")
        }
       
        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({message:"Connection request"+status,data})
    }
    catch (err) {
        res.status(400).send("ERROR :"+err.message)
    }
    
  


})



module.exports = requestRouter;