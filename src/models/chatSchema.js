
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
    },
    text: {
        type: String,
        required:true
    },

},{timestamps:true});

const chatSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  ],
  messages: [messageSchema],
});


const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;