const express=require("express");
const app=express();
const port=8000;
const cors = require("cors");
const {connectDB}=require("./config/connect.js");

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: "http://localhost:5173"
}));



//routes
const {router}=require("./routes/user.routes.js");
app.use("/",router);









connectDB().then(()=>{
    console.log("database connected");
    app.listen(port,()=>{
        console.log("server started at "+port);
    })
}).catch((err)=>{
    console.log("failed to connect server");
})

