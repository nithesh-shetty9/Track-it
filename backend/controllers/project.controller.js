const crypto = require("crypto");
const Project = require("../models/project.model");
const ProjectMember = require("../models/projectMember.model");
const Task = require("../models/task.model");
const { fail, need, pick, tx } = require("../utils/http");
const { decorate, projectsFor } = require("../services/project.service");
const { notify } = require("../services/notification.service");

const EDITABLE = ["name", "description", "startDate", "dueDate", "color"];

const checkDates = (project) =>
  need(
    !project.startDate ||
      !project.dueDate ||
      project.startDate <= project.dueDate,
    400,
    "Due date must be after the start date",
  );

const create = async (req, res) => {
  const { name, type = "PERSONAL" } = req.body;
  need(name && String(name).trim(), 400, "Project name is required");
  need(["PERSONAL", "TEAM"].includes(type), 400, "Invalid project type");
  const project = await tx(async (session) => {
    const [created] = await Project.create(
      [
        {
          ...pick(req.body, EDITABLE),
          type,
          owner: req.user._id,
          joinCode:
            type === "TEAM"
              ? crypto.randomBytes(5).toString("hex").toUpperCase()
              : undefined,
        },
      ],
      { session },
    );
    checkDates(created);
    await ProjectMember.create(
      [{ project: created._id, user: req.user._id, role: "OWNER" }],
      { session },
    );
    return created;
  });
  const [data] = await decorate([project], req.user._id);
  res.status(201).json({ project: data, joinCode: project.joinCode });
};

const list = async (req, res) => {
  const projects = await projectsFor(
    req.user._id,
    req.query.archived === "true",
  );
  res.json({ projects: await decorate(projects, req.user._id) });
};

const get = async (req, res) => {
  const [project] = await decorate([req.project], req.user._id);
  res.json({ project });
};

const update = async (req, res) => {
  const project = req.project;
  if (project.isArchived) {
    need(
      req.body.isArchived === false && req.member.role === "OWNER",
      409,
      "This project is archived",
    );
    project.isArchived = false;
  } else {
    Object.assign(project, pick(req.body, EDITABLE));
    need(String(project.name || "").trim(), 400, "Project name is required");
    checkDates(project);
  }
  await project.save();
  const [data] = await decorate([project], req.user._id);
  res.json({ project: data });
};

const archive = async (req, res) => {
  need(!req.project.isArchived, 409, "This project is already archived");
  req.project.isArchived = true;
  await req.project.save();
  res.json({ message: "Project archived" });
};

const join = async (req, res) => {
  const code = String(req.body.code || "")
    .trim()
    .toUpperCase();
  need(code, 400, "Join code is required");
  const project = await Project.findOne({
    joinCode: code,
    type: "TEAM",
  }).select("+joinCode");
  need(project, 404, "Invalid join code");
  need(!project.isArchived, 409, "This project is archived");
  try {
    await ProjectMember.create({
      project: project._id,
      user: req.user._id,
      role: "MEMBER",
    });
  } catch (error) {
    if (error.code === 11000)
      throw fail(409, "You are already a member of this project");
    throw error;
  }
  await Promise.all([
    notify(
      project.owner,
      "PROJECT_JOINED",
      `${req.user.name} joined ${project.name}`,
      { project: project._id },
    ),
    notify(req.user._id, "ADDED_TO_PROJECT", `You joined ${project.name}`, {
      project: project._id,
    }),
  ]);
  const [data] = await decorate([project], req.user._id);
  res.status(201).json({ project: data });
};

const joinCode = async (req, res) => {
  need(req.project.type === "TEAM", 400, "Only team projects have a join code");
  const project = await Project.findById(req.project._id).select("+joinCode");
  res.json({ joinCode: project.joinCode });
};

const members = async (req, res) => {
  const [people, counts] = await Promise.all([
    ProjectMember.find({ project: req.project._id })
      .populate("user", "name email")
      .sort({ createdAt: 1 })
      .lean(),
    Task.aggregate([
      { $match: { project: req.project._id, assignee: { $ne: null } } },
      { $group: { _id: "$assignee", n: { $sum: 1 } } },
    ]),
  ]);
  const byUser = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  res.json({
    members: people.map((m) => ({
      _id: m._id,
      role: m.role,
      user: m.user,
      taskCount: byUser[String(m.user._id)] || 0,
    })),
  });
};

const updateMember = async (req, res) => {
  const { role } = req.body;
  need(["OWNER", "ADMIN", "MEMBER"].includes(role), 400, "Invalid role");
  const target = await ProjectMember.findOne({
    _id: req.params.memberId,
    project: req.project._id,
  });
  need(target, 404, "Member not found");
  need(
    target.role !== "OWNER",
    400,
    "Transfer ownership to change the owner's role",
  );
  if (role === "OWNER") {
    await tx(async (session) => {
      await ProjectMember.updateOne(
        { _id: req.member._id },
        { role: "ADMIN" },
        { session },
      );
      await ProjectMember.updateOne(
        { _id: target._id },
        { role: "OWNER" },
        { session },
      );
      await Project.updateOne(
        { _id: req.project._id },
        { owner: target.user },
        { session },
      );
    });
  } else {
    target.role = role;
    await target.save();
  }
  res.json({ message: "Member updated" });
};

const removeMember = async (req, res) => {
  const target = await ProjectMember.findOne({
    _id: req.params.memberId,
    project: req.project._id,
  });
  need(target, 404, "Member not found");
  need(target.role !== "OWNER", 400, "The owner cannot be removed");
  const self = String(target.user) === String(req.user._id);
  const role = req.member.role;
  need(
    self || role === "OWNER" || (role === "ADMIN" && target.role === "MEMBER"),
    403,
    "You do not have permission to do this",
  );
  await tx(async (session) => {
    await ProjectMember.deleteOne({ _id: target._id }, { session });
    await Task.updateMany(
      { project: req.project._id, assignee: target.user },
      { assignee: null },
      { session },
    );
  });
  if (!self) {
    await notify(
      target.user,
      "REMOVED_FROM_PROJECT",
      `You were removed from ${req.project.name}`,
      { project: req.project._id },
    );
  }
  res.json({ message: "Member removed" });
};

module.exports = {
  create,
  list,
  get,
  update,
  archive,
  join,
  joinCode,
  members,
  updateMember,
  removeMember,
};
