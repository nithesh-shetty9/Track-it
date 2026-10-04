const express = require("express");
const userrouter = express.Router();
const c = require("../controllers/user.controller.js");
const Isauth = require("../middlewares/auth.middleware.js");
const { cookieOptions } = require("../services/user.service");

userrouter.post("/login", c.handlelogin);
userrouter.post("/signup", c.handlesignup);
userrouter.post("/logout", (req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie("uid", clearOptions);
  return res.status(200).json({ message: "Logout successful" });
});
userrouter.get("/me", Isauth, c.handleme);
userrouter.patch("/me", Isauth, c.handleupdate);
userrouter.patch("/password", Isauth, c.handlepassword);

module.exports = userrouter;
