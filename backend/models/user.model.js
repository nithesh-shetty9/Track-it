const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
});

// Model name is "User" (capitalised) so other schemas can use ref: "User".
// Mongoose still maps it to the same "users" collection as before.
const User = mongoose.model("User", userSchema);

module.exports = User;
