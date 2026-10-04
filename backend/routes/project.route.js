const express = require("express");
const Isauth = require("../middlewares/auth.middleware");
const { member, roles, writable } = require("../middlewares/project.middleware");
const c = require("../controllers/project.controller");

const router = express.Router();

router.use(Isauth);
router.post("/", c.create);
router.get("/", c.list);
router.post("/join", c.join);
router.get("/:id", member, c.get);
router.patch("/:id", member, roles("OWNER", "ADMIN"), c.update);
router.delete("/:id", member, roles("OWNER"), c.archive);
router.get("/:id/join-code", member, roles("OWNER"), c.joinCode);
router.get("/:id/members", member, c.members);
router.patch("/:id/members/:memberId", member, roles("OWNER"), writable, c.updateMember);
router.delete("/:id/members/:memberId", member, writable, c.removeMember);

module.exports = router;
