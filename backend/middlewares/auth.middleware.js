const {getUser}=require("../services/user.service");
const User=require("../models/user.model.js");
const Isauth=async(req,res,next)=>{
     const token = req.cookies.uid;
    const user=getUser(token);
    if(!user){
        return res.status(401).json({
            message:"unauthorized"
        });
    }
const dbUser = await User.findById(user._id);

  if (!dbUser) {
    return res.status(401).json({
      message: "User no longer exists"
    });
  }

  req.user = dbUser;

  next();
};

module.exports = Isauth;