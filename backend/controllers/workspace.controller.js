const Task = require("../models/task.model");
const Project = require("../models/project.model");
const ProjectMember = require("../models/projectMember.model");
const Notification = require("../models/notification.model");
const { TASK_POPULATE, projectIdsFor, projectsFor, myTasksFilter, decorate } = require("../services/project.service");

const summary = async (req, res) => {
  const uid = req.user._id;
  const from = new Date(req.query.from || Date.now());
  const to = new Date(req.query.to || Date.now());
  const [tasks, projectDocs] = await Promise.all([
    Task.find(await myTasksFilter(uid)).populate(TASK_POPULATE).lean(),
    projectsFor(uid),
  ]);
  const open = tasks.filter((t) => t.status !== "DONE");
  const byDue = (a, b) => new Date(a.dueDate) - new Date(b.dueDate);
  res.json({
    stats: {
      total: tasks.length,
      completed: tasks.length - open.length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      projects: projectDocs.length,
    },
    today: tasks
      .filter((t) => t.dueDate && ((t.dueDate >= from && t.dueDate <= to) || (t.dueDate < from && t.status !== "DONE")))
      .sort(byDue),
    upcoming: open.filter((t) => t.dueDate).sort(byDue).slice(0, 6),
    projects: await decorate(projectDocs, uid),
  });
};

const search = async (req, res) => {
  const text = String(req.query.q || "").trim();
  if (!text) return res.json({ tasks: [], projects: [], members: [] });
  const pattern = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const uid = req.user._id;
  const ids = await projectIdsFor(uid);
  const [tasks, projects, memberships] = await Promise.all([
    Task.find({ $and: [await myTasksFilter(uid, ids), { title: pattern }] })
      .limit(5)
      .populate("project", "name color"),
    Project.find({ _id: { $in: ids }, name: pattern }).limit(5).select("name color type"),
    ProjectMember.find({ project: { $in: ids } })
      .populate({ path: "user", match: { $or: [{ name: pattern }, { email: pattern }] }, select: "name email" })
      .populate("project", "name")
      .lean(),
  ]);
  const seen = new Set();
  const members = memberships
    .filter((m) => m.user && !seen.has(String(m.user._id)) && seen.add(String(m.user._id)))
    .slice(0, 5)
    .map((m) => ({ _id: m.user._id, name: m.user.name, email: m.user.email, project: m.project }));
  res.json({ tasks, projects, members });
};

const notifications = async (req, res) => {
  const uid = req.user._id;
  if (req.user.notificationsEnabled !== false) {
    const now = new Date();
    const soon = await Task.find({
      ...(await myTasksFilter(uid)),
      status: { $ne: "DONE" },
      dueDate: { $lte: new Date(+now + 864e5) },
    }).select("title project dueDate");
    await Promise.all(
      soon.map((t) =>
        Notification.updateOne(
          { user: uid, key: `due:${t._id}` },
          {
            $setOnInsert: {
              type: "DEADLINE",
              message: `"${t.title}" ${t.dueDate < now ? "is overdue" : "is due within 24 hours"}`,
              task: t._id,
              project: t.project,
            },
          },
          { upsert: true }
        )
      )
    );
  }
  const [items, unread] = await Promise.all([
    Notification.find({ user: uid }).sort({ createdAt: -1 }).limit(50),
    Notification.countDocuments({ user: uid, read: false }),
  ]);
  res.json({ notifications: items, unread });
};

const markRead = async (req, res) => {
  const filter = { user: req.user._id, read: false };
  if (req.body.id) filter._id = req.body.id;
  await Notification.updateMany(filter, { read: true });
  res.json({ message: "Notifications updated" });
};

module.exports = { summary, search, notifications, markRead };
