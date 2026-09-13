const User=require("../models/user.model.js");

const handlesignup=async(req,res)=>{
    try {
            const body = req.body;
            const user = await User.create(body);
            return res.status(201).json({
                message: "User created successfully",
                user
            });
        } catch (error) {
            return res.status(500).json({
                message: "Failed to create user",
                error: error.message
            });
    }
}
const handlelogin=async(req,res)=>{
     const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(404).json({ message: "User not found" }); 
        }
        if(user.password!==password)
        {
            return res.status(401).json({ message: "Invalid password" }); 
        }
        return res.status(200).json({ message: "Login successful", user });
    }
module.exports={handlesignup,handlelogin}
