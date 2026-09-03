const {users}=require("../models/user.model");
const jwt = require("jsonwebtoken");
const setuser=async(req,res)=>{
    const body=req.body;
    const user=await users.create(body);
    res.status(200).json(user);
}
const getuser=async(req,res)=>{
}
module.exports={
    setuser,
    getuser
}