import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/model/Profile";

export async function GET() {
  try {
    await connectDB();
    const profile = await Profile.findOne({ key: "main" }).lean();
    return Response.json(profile ?? {});
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    delete body._id;
    delete body.key;

    const profile = await Profile.findOneAndUpdate(
      { key: "main" },
      { $set: body },
      { new: true, upsert: true, runValidators: true },
    );
    return Response.json(profile);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
