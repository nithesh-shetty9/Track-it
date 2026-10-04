const Task = require("../models/task.model");
const ProjectMember = require("../models/projectMember.model");
const { need, pick } = require("../utils/http");
const { TASK_POPULATE, myTasksFilter, touchProject } = require("../services/project.service");
const { notify } = require("../services/notification.service");

const FIELDS = ["title", "description", "status", "priority", "assignee", "dueDate"];
const RANK = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const SORT_KEYS = {
  dueDate: (t) => (t.dueDate ? +t.dueDate : Infinity),
  priority: (t) => RANK[t.priority],
  createdAt: (t) => +t.createdAt,
  updatedAt: (t) => +t.updatedAt,
};

const access = async (userId, projectId) => {
  const membership = await ProjectMember.findOne({ project: projectId, user: userId }).populate("project", "name isArchived");
  need(membership, 403, "You are not a member of this project");
  return membership;
};

const writable = (membership) => need(!membership.project.isArchived, 409, "This project is archived");

const resolveAssignee = async (membership, assignee, userId) => {
  if (!assignee) return null;
  if (membership.role === "MEMBER") {
    need(String(assignee) === String(userId), 403, "Members can only assign tasks to themselves");
  }
  need(await ProjectMember.exists({ project: membership.project._id, user: assignee }), 400, "Assignee must belong to the project");
  return assignee;
};

const load = async (req) => {
  const task = await Task.findById(req.params.id);
  need(task, 404, "Task not found");
  if (!task.project) {
    need(String(task.createdBy) === String(req.user._id), 404, "Task not found");
    return { task, membership: null };
  }
  return { task, membership: await access(req.user._id, task.project) };
};

const create = async (req, res) => {
  const data = pick(req.body, ["title", "description", "status", "priority", "dueDate"]);
  need(data.title && String(data.title).trim(), 400, "Task title is required");
  const project = req.body.project || null;
  let assignee = null;
  if (project) {
    const membership = await access(req.user._id, project);
    writable(membership);
    assignee = await resolveAssignee(membership, req.body.assignee, req.user._id);
  }
  const task = await Task.create({
    ...data,
    project,
    assignee,
    createdBy: req.user._id,
    completedAt: data.status === "DONE" ? new Date() : null,
  });
  await touchProject(project);
  if (assignee && String(assignee) !== String(req.user._id)) {
    await notify(assignee, "TASK_ASSIGNED", `${req.user.name} assigned you "${task.title}"`, { task: task._id, project });
  }
  await task.populate(TASK_POPULATE);
  res.status(201).json({ task });
};

const dueFilter = (query) => {
  const due = {};
  if (query.dueFrom) due.$gte = new Date(query.dueFrom);
  if (query.dueTo) due.$lte = new Date(query.dueTo);
  return Object.keys(due).length ? { dueDate: due } : null;
};

const list = async (req, res) => {
  const q = req.query;
  const uid = req.user._id;
  const conditions = [];
  if (q.project) {
    await access(uid, q.project);
    conditions.push({ project: q.project });
  } else {
    conditions.push(await myTasksFilter(uid));
  }
  if (q.scope === "personal") conditions.push({ project: null });
  if (q.scope === "assigned") conditions.push({ project: { $ne: null } });
  if (q.scope === "completed") conditions.push({ status: "DONE" });
  if (q.status) conditions.push({ status: q.status });
  if (q.priority) conditions.push({ priority: q.priority });
  if (q.open) conditions.push({ status: { $ne: "DONE" } });
  if (q.assignee) conditions.push({ assignee: q.assignee === "me" ? uid : q.assignee === "none" ? null : q.assignee });
  if (q.filterProject) conditions.push({ project: q.filterProject === "none" ? null : q.filterProject });
  const due = dueFilter(q);
  if (due) conditions.push(due);
  const tasks = await Task.find({ $and: conditions }).populate(TASK_POPULATE).lean();
  const key = SORT_KEYS[q.sort] || SORT_KEYS.dueDate;
  const direction = q.order === "desc" ? -1 : 1;
  tasks.sort((a, b) => (key(a) === key(b) ? 0 : key(a) < key(b) ? -direction : direction));
  res.json({ tasks });
};

const get = async (req, res) => {
  const { task } = await load(req);
  await task.populate(TASK_POPULATE);
  res.json({ task });
};

const update = async (req, res) => {
  const { task, membership } = await load(req);
  const uid = String(req.user._id);
  if (membership) {
    writable(membership);
    need(
      membership.role !== "MEMBER" || String(task.createdBy) === uid || String(task.assignee) === uid,
      403,
      "You do not have permission to edit this task"
    );
  }
  const data = pick(req.body, FIELDS);
  if ("title" in data) need(data.title && String(data.title).trim(), 400, "Task title is required");
  if (!membership) delete data.assignee;
  if ("assignee" in data) data.assignee = await resolveAssignee(membership, data.assignee, req.user._id);
  const becameDone = data.status === "DONE" && task.status !== "DONE";
  if (data.status && data.status !== task.status) data.completedAt = data.status === "DONE" ? new Date() : null;
  const previousAssignee = String(task.assignee || "");
  task.set(data);
  await task.save();
  await touchProject(task.project);
  const nextAssignee = String(task.assignee || "");
  if (nextAssignee && nextAssignee !== previousAssignee && nextAssignee !== uid) {
    await notify(task.assignee, "TASK_ASSIGNED", `${req.user.name} assigned you "${task.title}"`, { task: task._id, project: task.project });
  }
  if (becameDone && String(task.createdBy) !== uid) {
    await notify(task.createdBy, "TASK_COMPLETED", `${req.user.name} completed "${task.title}"`, { task: task._id, project: task.project });
  }
  await task.populate(TASK_POPULATE);
  res.json({ task });
};

const remove = async (req, res) => {
  const { task, membership } = await load(req);
  if (membership) {
    writable(membership);
    need(["OWNER", "ADMIN"].includes(membership.role), 403, "You do not have permission to delete this task");
  }
  await task.deleteOne();
  await touchProject(task.project);
  res.json({ message: "Task deleted" });
};

module.exports = { create, list, get, update, remove };
