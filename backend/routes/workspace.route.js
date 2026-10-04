const express = require("express");
const Isauth = require("../middlewares/auth.middleware");
const c = require("../controllers/workspace.controller");

const router = express.Router();

router.get("/dashboard/summary", Isauth, c.summary);
router.get("/search", Isauth, c.search);
router.get("/notifications", Isauth, c.notifications);
router.patch("/notifications/read", Isauth, c.markRead);

module.exports = router;
