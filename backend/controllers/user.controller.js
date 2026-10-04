const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const { setUser, cookieOptions } = require("../services/user.service");

// Never send the password hash (or any other field) back to the client.
const toSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
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

module.exports = { handlesignup, handlelogin };
