const Notification = require("../models/notification.model");
const User = require("../models/user.model");

const notify = async (user, type, message, refs = {}) => {
  if (!user) return;
  const recipient = await User.findById(user).select("notificationsEnabled");
  if (!recipient || recipient.notificationsEnabled === false) return;
  await Notification.create({ user, type, message, ...refs });
};

module.exports = { notify };
