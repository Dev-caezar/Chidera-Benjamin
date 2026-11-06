import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getAllNotificationsForAdmin } from "@/lib/notification";
import Notification from "@/model/Notification";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? 100);
    const data = await getAllNotificationsForAdmin(limit);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
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
