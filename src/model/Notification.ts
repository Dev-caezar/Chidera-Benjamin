import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["contact", "system"],
      default: "system",
    },
    title: { type: String, required: true },
    message: String,
    read: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    replies: [{ message: String, sentAt: { type: Date, default: Date.now } }],
    meta: Schema.Types.Mixed,
  },
  { timestamps: true },
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
