import { connectDB } from "@/lib/mongodb";
import Notification from "@/model/Notification";
import { auth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const body = await req.json();

  const notification = await Notification.findByIdAndUpdate(
    id,
    { read: body.read ?? true },
    { new: true },
  );

  if (!notification) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(notification);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
