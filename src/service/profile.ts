import { connectDB } from "@/lib/mongodb";
import Profile from "@/model/Profile";

export async function getProfile() {
  await connectDB();
  const profile = await Profile.findOne({ key: "main" }).lean();
  return profile ? JSON.parse(JSON.stringify(profile)) : null;
}
