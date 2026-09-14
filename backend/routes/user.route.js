const User = require("../models/user.model.js");
const express = require("express");
const userrouter = express.Router();
const { handlesignup, handlelogin } = require("../controllers/user.controller.js");
userrouter.post('/signup', handlesignup);
userrouter.post('/login', handlelogin);
module.exports=userrouter;