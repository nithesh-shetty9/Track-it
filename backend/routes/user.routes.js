const router = require("express").Router();
const {setuser,getuser}=require("../controllers/user.controllers.js")
router.post("/signup",setuser);
router.get("/login",getuser);
module.exports={
    router
}