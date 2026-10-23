// src/app/api/contact/route.ts
import { connectDB } from "@/lib/mongodb";
import Notification from "@/model/Notification";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PER_HOUR = 3;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Honeypot: hidden field real users never fill. Pretend it worked.
    if (body.website) {
      return Response.json({ ok: true }, { status: 201 });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return Response.json(
        { error: "Please enter a valid email." },
        { status: 400 },
      );
    }
    if (name.length > 100) {
      return Response.json({ error: "Name is too long." }, { status: 400 });
    }
    if (message.length < 10 || message.length > 3000) {
      return Response.json(
        { error: "Message must be between 10 and 3000 characters." },
        { status: 400 },
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    await connectDB();

    // Rate limit per IP, backed by the database
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await Notification.countDocuments({
      type: "contact",
      "meta.ip": ip,
      createdAt: { $gte: hourAgo },
    });
    if (recent >= MAX_PER_HOUR) {
      return Response.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 },
      );
    }

    // Dedupe identical back-to-back submissions
    const duplicate = await Notification.exists({
      type: "contact",
      "meta.email": email,
      message,
    });
    if (duplicate) {
      return Response.json({ ok: true }, { status: 201 });
    }

    await Notification.create({
      type: "contact",
      title: `New message from ${name}`,
      message,
      meta: { name, email, ip },
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[contact]", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
