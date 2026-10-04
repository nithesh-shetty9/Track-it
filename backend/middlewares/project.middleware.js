const Project = require("../models/project.model");
const ProjectMember = require("../models/projectMember.model");
const { need } = require("../utils/http");

const member = async (req, res, next) => {
  const membership = await ProjectMember.findOne({ project: req.params.id, user: req.user._id });
  need(membership, 404, "Project not found");
  const project = await Project.findById(req.params.id);
  need(project, 404, "Project not found");
  req.member = membership;
  req.project = project;
  next();
};

const roles = (...allowed) => (req, res, next) => {
  need(allowed.includes(req.member.role), 403, "You do not have permission to do this");
  next();
};

const writable = (req, res, next) => {
  need(!req.project.isArchived, 409, "This project is archived");
  next();
};

module.exports = { member, roles, writable };
