const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    editedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
schema.index({ project: 1, createdAt: -1 });
module.exports = mongoose.model("ChatMessage", schema);
