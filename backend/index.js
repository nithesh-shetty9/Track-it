const express=require("express");
const app=express();
const port=8001;
const connectDB=require("./config/ConnectDB");
const userrouter=require("./routes/user.route.js");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/user",userrouter);









connectDB().then(()=>{
    app.listen(port,(req,res)=>{
        console.log("server started at"+port);
    });
}).catch((error)=>{
    console.log("failed to connect to server");
})