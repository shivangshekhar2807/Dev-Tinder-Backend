const express = require("express");
const app = express();
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request')
const userRouter=require('./routes/user')

connectDB().then(() => {
  console.log("DataBase CONNNECTED");
  app.listen(3000, () => {
    console.log("starting backened");
  });
});

app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



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


