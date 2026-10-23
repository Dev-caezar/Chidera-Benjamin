// src/lib/projects.ts
import { connectDB } from "@/lib/mongodb";
import Project from "@/model/Project";

export async function getPublishedProjects() {
  await connectDB();
  const projects = await Project.find({ published: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(projects));
}

export async function getProjectBySlug(slug: string) {
  await connectDB();
  const project = await Project.findOne({ slug, published: true }).lean();
  return project ? JSON.parse(JSON.stringify(project)) : null;
}
