
const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require("../models/connectionRequest");

const USER_SAFE_DATA="firstName lastname photoUrl age gender"

userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
   
    try {
        const loggedInuser = req.user;
        
        const connectionRequest = await ConnectionRequestModel.find({
          toUserId: loggedInuser._id,
          status: "interested",
        }).populate("fromUserId", ["firstName", "lastName"]);


        res.send("Data Fetched Successfully" + connectionRequest);
        
    }
    catch (err) {
        res.status(400).send("ERROR :"+err.message)
    }



})

userRouter.get('/user/connections', userAuth, (req, res) => {

    try {
        const loggedInUser = req.user;
        
        const connectionRequest = ConnectionRequestModel.find({
          $or: [
            {
              toUserId: loggedInUser._id,
              status: "accepted",
            },
            {
              fromUserId: loggedInUser._id,
              status: "accepted",
            },
          ],
        })
          .populate("fromUserid", USER_SAFE_DATA)
          .populate("toUserid", USER_SAFE_DATA);

      const data = connectionRequest.map((item) => {
        if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return item.toUserId
        }
        return fromUserId;
        })

        res.json({
          data: data
        });
    }
    catch (err) {
        res.status(400).send({message:err.message})
    }



})



module.exports = userRouter;