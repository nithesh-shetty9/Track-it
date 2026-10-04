const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, default: "", maxlength: 500 },
    type: { type: String, enum: ["PERSONAL", "TEAM"], default: "PERSONAL" },
    color: { type: String, match: /^#[0-9a-fA-F]{6}$/, default: "#14845b" },
    startDate: Date,
    dueDate: Date,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    joinCode: { type: String, select: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index(
  { joinCode: 1 },
  { unique: true, partialFilterExpression: { type: "TEAM", joinCode: { $type: "string" } } }
);

module.exports = mongoose.model("Project", projectSchema);
