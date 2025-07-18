const express = require("express")

const app = express();




app.get("/data",(req,res,next)=> {
    next()
    res.send("get success2")
    
    
},
(req,res)=> {
    
    res.send("get success")
    
}
)

app.post("/data/2",(req,res)=> {
    
    res.send("deleted succesfully")

})

app.use("/hello",(req,res)=> {
    
    res.send("ok serverrrr hello")

})

app.listen(3000, () => {
    console.log("starting backend")
   
})

// console.log("starting backend",express)

