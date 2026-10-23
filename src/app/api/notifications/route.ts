import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/model/Notification";

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return Response.json(notifications);
}

export async function PATCH() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  await Notification.updateMany({ read: false }, { $set: { read: true } });

  return Response.json({ ok: true });
}
