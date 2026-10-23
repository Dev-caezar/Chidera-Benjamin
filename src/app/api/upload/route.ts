// src/app/api/upload/route.ts
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return Response.json({ error: "Only images are allowed" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: "Max file size is 5MB" }, { status: 400 });
  }

  const blob = await put(`covers/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return Response.json({ url: blob.url });
}
