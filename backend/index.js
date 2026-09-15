const express=require("express");
const app=express();
const cors = require("cors");
const port=8001;
const cookieParser = require("cookie-parser");
const connectDB=require("./config/ConnectDB");
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
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