
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Gender is not Valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default description",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// userSchema.method.getJWT() = async function(){
//   const user = this;

//   const token=await jwt.sign({ _id: user._id }, "shivangshekha2807", {
//           expiresIn:"1d"
//   });
  
  
// }

userSchema.index({firstName:1,email:1})

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;





