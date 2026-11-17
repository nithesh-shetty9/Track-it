const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastReadAt: { type: Date, default: null },
  },
  { timestamps: true },
);
schema.index({ project: 1, user: 1 }, { unique: true });
module.exports = mongoose.model("ChatRead", schema);
