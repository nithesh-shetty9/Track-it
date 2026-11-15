const ChatMessage = require("../models/chatMessage.model");
const ChatRead = require("../models/chatRead.model");
const ProjectMember = require("../models/projectMember.model");
const { need } = require("../utils/http");
const { publish, subscribe } = require("../services/chat.service");

const access = async (userId, projectId) => {
  const membership = await ProjectMember.findOne({
    project: projectId,
    user: userId,
  });
  need(membership, 403, "You are not a member of this project");
};

const list = async (req, res) => {
  await access(req.user._id, req.params.id);
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
  const query = { project: req.params.id };
  if (req.query.before) query.createdAt = { $lt: new Date(req.query.before) };
  const messages = await ChatMessage.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("sender", "name")
    .lean();
  const read = await ChatRead.findOne({
    project: req.params.id,
    user: req.user._id,
  }).lean();
  const unreadCount = await ChatMessage.countDocuments({
    project: req.params.id,
    ...(read?.lastReadAt ? { createdAt: { $gt: read.lastReadAt } } : {}),
  });
  res.json({
    messages: messages.reverse(),
    unreadCount,
    hasMore: messages.length === limit,
  });
};

const send = async (req, res) => {
  await access(req.user._id, req.params.id);
  const content = String(req.body.content || "").trim();
  need(
    content && content.length <= 2000,
    400,
    "Message must contain 1 to 2000 characters",
  );
  const message = await ChatMessage.create({
    project: req.params.id,
    sender: req.user._id,
    content,
  });
  await message.populate("sender", "name");
  const result = {
    _id: message._id,
    project: message.project,
    content: message.content,
    sender: message.sender,
    createdAt: message.createdAt,
    editedAt: message.editedAt,
  };
  publish(req.params.id, result);
  res.status(201).json({ message: result });
};

const markRead = async (req, res) => {
  await access(req.user._id, req.params.id);
  await ChatRead.findOneAndUpdate(
    { project: req.params.id, user: req.user._id },
    { lastReadAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  res.json({ unreadCount: 0 });
};

const stream = async (req, res) => {
  await access(req.user._id, req.params.id);
  res
    .status(200)
    .set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
  res.flushHeaders?.();
  res.write(
    `event: ready\ndata: ${JSON.stringify({ project: req.params.id })}\n\n`,
  );
  const stop = subscribe(req.params.id, (message) =>
    res.write(`event: message\ndata: ${JSON.stringify(message)}\n\n`),
  );
  const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 25000);
  req.on("close", () => {
    clearInterval(heartbeat);
    stop();
  });
};

module.exports = { list, send, markRead, stream };
