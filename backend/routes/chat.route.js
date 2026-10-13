const express = require("express");
const Isauth = require("../middlewares/auth.middleware");
const c = require("../controllers/chat.controller");

const router = express.Router();
router.use(Isauth);
router.get("/:id/chat", c.list);
router.post("/:id/chat", c.send);
router.patch("/:id/chat/read", c.markRead);
router.get("/:id/chat/stream", c.stream);
module.exports = router;
