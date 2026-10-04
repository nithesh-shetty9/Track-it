const express = require("express");
const Isauth = require("../middlewares/auth.middleware");
const c = require("../controllers/task.controller");

const router = express.Router();

router.use(Isauth);
router.post("/", c.create);
router.get("/", c.list);
router.get("/:id", c.get);
router.patch("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
