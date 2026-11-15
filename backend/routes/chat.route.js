const express = require("express");
const Isauth = require("../middlewares/auth.middleware");
const chat_controllers = require("../controllers/chat.controller");

const router = express.Router();
router.use(Isauth);//middleware to check before going to next steps
router.get("/:id/chat", chat_controllers.list);
router.post("/:id/chat", chat_controllers.send);
router.patch("/:id/chat/read", chat_controllers.markRead);
router.get("/:id/chat/stream", chat_controllers.stream);
module.exports = router;
