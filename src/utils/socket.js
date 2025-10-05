const socket = require("socket.io");
const chatModel = require("../models/chatSchema");
const ConnectionRequest = require("../models/connectionRequest");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", async({ firstName, userId, chatId }) => {
      const roomId = [userId, chatId].sort().join("_");

      //  const areConnected = await ConnectionRequest.findOne({
      //     $or: [
      //       { fromUserId: userId, toUserId: chatId, status: "interested" },
      //     { fromUserId: chatId, toUserId: userId, status: "interested" }
      //     ]
      //   });
     
      //   if (!areConnected) {
      //     console.log(
      //       "you cannot jion the room ,because you both are not connected"
      //     );
      //     return "you cannot jion the room ,because you both are not connected";
      //   }

      //   console.log("yoy can jion the room")


      console.log("joining room at ", roomId, "by", firstName);
      socket.join(roomId);
    });

    socket.on("sendMessage",async ({ firstName, userId, chatId, text }) => {
       

      try {
        const roomId = [userId, chatId].sort().join("_");
        console.log(firstName, " has send a message---->", text);

        // const areConnected = await ConnectionRequest.findOne({
        //   $or: [
        //     { fromUserId: userId, toUserId: chatId, status: "interested" },
        //   { fromUserId: chatId, toUserId: userId, status: "interested" }
        //   ]
        // });
     
        // if (!areConnected) {
        //   console.log(
        //     "you cannot send message to this person ,because you both are not connected"
        //   );
        //   return "you cannot send message to this person ,because you both are not connected"
        // }

        // console.log("yoy can send message")


        //save message to DATABASE
        let chat = await chatModel.findOne({
          participants: { $all: [userId, chatId] },
        });

        if (!chat) {
          chat = new chatModel({
            participants: [userId, chatId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        const savedChat = await chat.save();

         console.log("savedChat", savedChat);

         io.to(roomId).emit("messageReceived", { userId, firstName, text });
      } catch (err) {
        console.log("errr",err)
        }
       
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
