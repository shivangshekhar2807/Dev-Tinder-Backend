// const express = require("express");
// const app = express();
// const connectDB = require("./config/database");
// const UserModel  = require("./models/user");

// connectDB()
//   .then((res) => {
//     console.log("database CONNECTED");
//     app.listen(3000, () => {
//       console.log("starting backend");
//     });
//   })
//   .catch((err) => {
//     console.log(err, "database CONNECTION Failed");
//   });

// app.use(express.json());
    

// app.post("/signUp", async (req, res) => {
  
//   console.log(req.body)
      
//     const userObj = {
//         firstName: "Virat",
//         lastName: "Kohli",
//         email: "ss@g.com",
//         password:"ss621311"
//     }

//     const user = new UserModel(req.body);
    
//    const userRes= await user.save();

//     res.send(`saved Successfully ${userRes}`);

//   })


const express = require('express');
const app = express();
const connectDB = require('./config/database');
const UserModel = require("./models/user");

connectDB().then(() => {
  console.log("DataBase CONNNECTED");
  app.listen(3000, () => {
    console.log("starting backened")
  });
})

app.use(express.json())

app.post('/ok', async(req, res, next) => {
  
  const user = new UserModel(req.body)
  
  const userRes = await user.save();


  res.send(`saved to DB ${userRes}`);
})


app.get('/user', async (req, res) => {

  const found = await UserModel.find({ firstName: req.body.firstName })

  if (found.length < 1) {
    res.status(404).send("User Not Found")
  }
  
  res.send(`user found ${found}`)
  
})

app.delete("/user", async (req, res) => {
  const found = await UserModel.findByIdAndDelete(req.body.userId);

 

  res.send(`user deleted ${found}`);
});


app.get("/Alluser", async (req, res) => {
  const found = await UserModel.find({});

  if (found.length < 1) {
    res.status(404).send("User Not Found");
  }

  res.send(`user found ${found}`);
});


