const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["TASK_ASSIGNED", "TASK_COMPLETED", "ADDED_TO_PROJECT", "REMOVED_FROM_PROJECT", "PROJECT_JOINED", "DEADLINE"],
      required: true,
    },
    message: { type: String, required: true },
    task: { type: ObjectId, ref: "Task" },
    project: { type: ObjectId, ref: "Project" },
    key: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, key: 1 }, { unique: true, partialFilterExpression: { key: { $type: "string" } } });

module.exports = mongoose.model("Notification", notificationSchema);
