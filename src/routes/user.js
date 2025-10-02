
const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");

const USER_SAFE_DATA =
  "firstName lastName photoUrl age gender skills about isPremium membershipType";

userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
   
    try {
        const loggedInuser = req.user;
        
        const connectionRequest = await ConnectionRequestModel.find({
          toUserId: loggedInuser._id,
          status: "interested",
        }).populate("fromUserId", [
          "firstName",
          "lastName",
          "photoUrl",
          "age",
          "gender",
          "skills",
          "about",
        ]);


      // res.send("Data Fetched Successfully" + connectionRequest);
      res.json({
         status:"Data Fetched Successfully",
         data: connectionRequest,
       });
        
    }
    catch (err) {
        res.status(400).send("ERROR :"+err.message)
    }



})

userRouter.get('/user/connections', userAuth, async(req, res) => {

    try {
        const loggedInUser = req.user;
        
        const connectionRequest = await ConnectionRequestModel.find({
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
          .populate("fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA);

      const data = connectionRequest.map((item) => {
        if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return item.toUserId
        }
        return item.fromUserId;
        })

        res.json({
          data: data
        });
    }
    catch (err) {
        res.status(400).send({message:err.message})
    }



})


userRouter.get('/feed', userAuth, async (req, res) => {

  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page)||1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        {
        fromUserId:loggedInUser._id
        },
        {
          toUserId:loggedInUser._id
        }
      ]
    }).select("fromUserId toUserId")

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((item) => {
      hideUserFromFeed.add(item.fromUserId.toString());
      hideUserFromFeed.add(item.toUserId.toString());
    })

    const Users = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.send(Users)
    
  }
  catch (err) {
    res.status(400).send("ERROR"+err.message)
  }
  
})



module.exports = userRouter;