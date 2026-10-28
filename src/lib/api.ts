import Project from "@/model/Project";
import { connectDB } from "./mongodb";

export async function getProjects() {
  await connectDB();
  const docs = await Project.find({ published: true })
    .sort({ order: 1 })
    .lean();
  return JSON.parse(JSON.stringify(docs));
}
