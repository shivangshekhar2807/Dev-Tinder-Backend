const express = require("express")

const app = express();




app.get("/data",(req,res)=> {
    
        res.send("ok serverrrr data")
    
})

app.use("/data/2",(req,res)=> {
    
    res.send("ok serverrrr data/2")

})

app.use("/hello",(req,res)=> {
    
    res.send("ok serverrrr hello")

})

app.listen(3000, () => {
    console.log("starting backend")
   
})

// console.log("starting backend",express)

