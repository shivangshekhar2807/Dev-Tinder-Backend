
const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    password: {
        type:String
    },
    email: {
       type:String 
    },
    age: {
        type:Number
    },
    gender: {
        type:String
    }
})

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;





