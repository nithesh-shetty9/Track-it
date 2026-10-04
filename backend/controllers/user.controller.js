const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const { setUser, cookieOptions } = require("../services/user.service");
const { need } = require("../utils/http");

// Never send the password hash (or any other field) back to the client.
const toSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  notificationsEnabled: user.notificationsEnabled !== false,
});

const handlesignup = async (req, res) => {
  try {
    // Whitelist: only these fields are accepted from the client.
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = setUser(user);
    res.cookie("uid", token, cookieOptions);

    return res.status(201).json({
      message: "User created successfully",
      user: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const handlelogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });

    // Same message for "no such user" and "wrong password" so emails can't be probed.
    const valid = user && (await bcrypt.compare(String(password), user.password));
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = setUser(user);
    res.cookie("uid", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to log in",
      error: error.message,
    });
  }
};

const handleme = (req, res) => res.json({ user: toSafeUser(req.user) });

const handleupdate = async (req, res) => {
  const { name, email, notificationsEnabled } = req.body;
  if (name !== undefined) {
    need(String(name).trim(), 400, "Name is required");
    req.user.name = String(name).trim();
  }
  if (email !== undefined) {
    const normalized = String(email).toLowerCase().trim();
    need(normalized, 400, "Email is required");
    need(!(await User.exists({ email: normalized, _id: { $ne: req.user._id } })), 409, "Email already registered");
    req.user.email = normalized;
  }
  if (typeof notificationsEnabled === "boolean") req.user.notificationsEnabled = notificationsEnabled;
  await req.user.save();
  res.json({ user: toSafeUser(req.user) });
};

const handlepassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  need(String(newPassword || "").length >= 6, 400, "Password must have at least 6 characters");
  need(await bcrypt.compare(String(currentPassword || ""), req.user.password), 401, "Current password is incorrect");
  req.user.password = await bcrypt.hash(String(newPassword), 10);
  await req.user.save();
  res.json({ message: "Password updated" });
};

module.exports = { handlesignup, handlelogin, handleme, handleupdate, handlepassword };
