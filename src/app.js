const express = require("express")

const app = express();

app.use("/data",(req,res)=> {
    if (req.url === "data") {
        res.send("data")
    }
    else {
        res.send("ok serverrrr")
    }
})

app.listen(3000, () => {
    console.log("starting backend")
   
})

// console.log("starting backend",express)

