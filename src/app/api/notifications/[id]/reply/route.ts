import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/model/Notification";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { message } = await req.json();

  if (!message?.trim()) {
    return Response.json({ error: "Reply can't be empty" }, { status: 400 });
  }

  await connectDB();
  const notification = await Notification.findById(id);

  if (!notification) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  if (notification.type !== "contact" || !notification.meta?.email) {
    return Response.json(
      { error: "This notification has no recipient to reply to" },
      { status: 400 },
    );
  }
  const { error } = await resend.emails.send({
    from: process.env.REPLY_FROM_EMAIL!,
    to: notification.meta.email,
    replyTo: process.env.REPLY_TO_EMAIL,
    subject: "Re: your message",
    text: message,
  });

  if (error) {
    return Response.json(
      { error: error.message || "Failed to send email" },
      { status: 502 },
    );
  }

  notification.replies.push({ message, sentAt: new Date() });
  notification.replied = true;
  notification.read = true;
  await notification.save();

  return Response.json(JSON.parse(JSON.stringify(notification)));
}
