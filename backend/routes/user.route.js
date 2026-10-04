const express = require("express");
const userrouter = express.Router();
const { handlesignup, handlelogin } = require("../controllers/user.controller.js");
const Isauth = require("../middlewares/auth.middleware.js");
userrouter.post('/login', handlelogin);
userrouter.post("/signup", handlesignup);
userrouter.post("/logout", (req, res) => {
  res.clearCookie("uid");
  return res.status(200).json({
    message: "Logout successful",
  });
});
userrouter.get("/me", Isauth, (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});
module.exports=userrouter;