const express = require("express");
const app = express();
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const {userAuth}=require("./middlewares/auth")

connectDB().then(() => {
  console.log("DataBase CONNNECTED");
  app.listen(3000, () => {
    console.log("starting backened");
  });
});

app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async(req, res, next) => {
 
  const { password,firstName,lastName,email,gender } = req.body;

  try {
    validateSignUpData(req);

    const hashPassword = await bcrypt.hash(password, 10);
    
    console.log("hashPassword", hashPassword);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      gender,
      password: hashPassword,
    });

    const userRes = await user.save();

    res.send(`User Added Successfully ${userRes}`);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.post('/login', async (req,res) => {
  
  const { email, password } = req.body;
  try {
    const emailPresent = await UserModel.findOne({email});

    if (!emailPresent) {
      throw new Error("Email Not Found")
    }

    const passwordPresent =await bcrypt.compare(password, emailPresent.password);

    if (passwordPresent) {
      
      const token = await jwt.sign({ _id: emailPresent._id }, "shivangshekha2807", {
        expiresIn:"1d"
      });
      
      console.log("token", token);

      res.cookie("Token",token)
      res.send("Login Successfull")
    }
    else {
      throw new Error("Password Incorrect");
    }
    
  }
  catch (err) {
    res.status(400).send("ERROR :"+err.message)
  }
})

app.post("/user",userAuth, async (req, res, next) => {
  const user = new UserModel(req.body);

  const userRes = await user.save();

  res.send(`saved to DB ${userRes}`);
});

app.get("/user",userAuth, async (req, res) => {
  const found = await UserModel.find({ firstName: req.body.firstName });

  if (found.length < 1) {
    res.status(404).send("User Not Found");
  }

  res.send(`user found ${found}`);
});

app.delete("/user", async (req, res) => {
  const found = await UserModel.findByIdAndDelete(req.body.userId);

  res.send(`user deleted ${found}`);
});

app.patch("/user/:userId", async (req, res) => {
  const id = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATED = [
      "skills",
      "age",
      "gender",
      "photoUrl",
      "about",
      "firstName",
    ];

    const isUpdatedAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATED.includes(k)
    );

    if (!isUpdatedAllowed) {
      res.status(400).send("updated not Allowed");
    }
    const found = await UserModel.findByIdAndUpdate(id, data, {
      runValidators: true,
    });

    res.send(`user Updated ${found}`);
  } catch (err) {
    res.status(400).send("updation failed" + err.message);
  }
});

app.get("/Alluser",userAuth, async (req, res) => {
  const found = await UserModel.find({});

  if (found.length < 1) {
    res.status(404).send("User Not Found");
  }

  res.send(`user found ${found}`);
});

app.get('/profile',userAuth, async (req, res) => {
  
try{
  
  const userProfile = req.user;

  if (!userProfile) {
    throw new Error("NO USER FOUND")
  }

  
  res.send("Your Profile is :" + userProfile);
}
  catch(err){
    res.status(400).send("ERROR :"+err.message)
  }
  
})
