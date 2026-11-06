import Notification from "@/model/Notification";
import { connectDB } from "./mongodb";

export async function getAllNotificationsForAdmin(limit = 100) {
  await connectDB();
  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return JSON.parse(JSON.stringify(notifications));
}
