const Project = require("../models/project.model");
const ProjectMember = require("../models/projectMember.model");
const Task = require("../models/task.model");

const TASK_POPULATE = [
  { path: "assignee", select: "name email" },
  { path: "createdBy", select: "name email" },
  { path: "project", select: "name color type isArchived" },
];

const projectIdsFor = async (userId, archived = false) => {
  const memberships = await ProjectMember.find({ user: userId }).select("project").lean();
  const projects = await Project.find({
    _id: { $in: memberships.map((m) => m.project) },
    isArchived: archived,
  }).select("_id");
  return projects.map((p) => p._id);
};

const projectsFor = async (userId, archived = false) => {
  const ids = await projectIdsFor(userId, archived);
  return Project.find({ _id: { $in: ids } }).sort({ updatedAt: -1 });
};

const myTasksFilter = async (userId, ids) => ({
  $or: [
    { project: null, createdBy: userId },
    { project: { $in: ids || (await projectIdsFor(userId)) }, assignee: userId },
  ],
});

const decorate = async (projects, userId) => {
  const ids = projects.map((p) => p._id);
  const [counts, members] = await Promise.all([
    Task.aggregate([
      { $match: { project: { $in: ids } } },
      { $group: { _id: { project: "$project", status: "$status" }, n: { $sum: 1 } } },
    ]),
    ProjectMember.find({ project: { $in: ids } }).populate("user", "name email").sort({ createdAt: 1 }).lean(),
  ]);
  return projects.map((project) => {
    const data = project.toObject ? project.toObject() : { ...project };
    delete data.joinCode;
    const own = counts.filter((c) => String(c._id.project) === String(data._id));
    const total = own.reduce((sum, c) => sum + c.n, 0);
    const done = own.filter((c) => c._id.status === "DONE").reduce((sum, c) => sum + c.n, 0);
    const people = members.filter((m) => String(m.project) === String(data._id));
    const me = people.find((m) => String(m.user._id) === String(userId));
    return {
      ...data,
      role: me?.role,
      taskCount: total,
      doneCount: done,
      progress: total ? Math.round((done / total) * 100) : 0,
      members: people.map((m) => ({ _id: m.user._id, name: m.user.name, role: m.role })),
    };
  });
};

const touchProject = (id) => id && Project.updateOne({ _id: id }, { $set: { updatedAt: new Date() } });

module.exports = { TASK_POPULATE, projectIdsFor, projectsFor, myTasksFilter, decorate, touchProject };
