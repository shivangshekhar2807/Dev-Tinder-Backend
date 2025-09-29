
const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
      //   "mongodb+srv://shivangshekhar302:ss621311@shivang-dev.qdfs9rq.mongodb.net/Tinder"
      process.env.DB_CONNECTION_SECRET
    );
}


module.exports = connectDB;