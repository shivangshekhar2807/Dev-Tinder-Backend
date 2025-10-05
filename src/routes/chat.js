const express = require('express');
const { userAuth } = require('../middlewares/auth');
const chatModel = require('../models/chatSchema');
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;

    const userId = req.user._id;

    let chat = await chatModel
      .findOne({
        participants: { $all: [userId, targetUserId] },
      })
      .populate("messages.senderId", "firstName photoUrl");

    if (!chat) {
      chat = new chatModel({
        participants: [userId, targetUserId],
        messages: [],
      });
    }

   

    // const savedChat = await chat.save();

    res.status(200).json({
      status: "Chat saved successfully",
      data: chat,
    });
  } catch (err) {
    res.status(400).json({
      status: "Chat not found",
      message: err.message,
    });
  }
});

module.exports = chatRouter;