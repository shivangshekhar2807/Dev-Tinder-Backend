
route starts checking from url and tally with the route in the code...if it finds the route and the route is over in the code then it will enter that...but if it tally and the url route is over but still something left in code url then it will search in next one.



app.get("/data",(req,res)=> {
    
    res.send("get success")
    
})

app.get ---> is route and the callback function inside it is route handler