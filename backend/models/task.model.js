const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const taskSchema = new mongoose.Schema(
  {
    project: { type: ObjectId, ref: "Project", default: null },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, default: "", maxlength: 2000 },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    assignee: { type: ObjectId, ref: "User", default: null },
    createdBy: { type: ObjectId, ref: "User", required: true },
    dueDate: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    progressNotes: [
      {
        author: { type: ObjectId, ref: "User", required: true },
        content: { type: String, required: true, trim: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ createdBy: 1, project: 1 });

module.exports = mongoose.model("Task", taskSchema);
