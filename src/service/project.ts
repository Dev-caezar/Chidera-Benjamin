import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Project from "@/model/Project";
import { serialize, omitProtected } from "@/lib/serialize";
import type { Project as ProjectType, ProjectInput } from "@/types/project";
import { slugify } from "@/lib/slig";

export async function getPublishedProjects() {
  await connectDB();
  const docs = await Project.find({ published: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return serialize<ProjectType[]>(docs);
}

export async function getFeaturedProjects(limit = 4) {
  await connectDB();
  const docs = await Project.find({ published: true, featured: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return serialize<ProjectType[]>(docs);
}

export async function getProjectBySlug(slug: string) {
  let clean = slug;
  try {
    clean = decodeURIComponent(slug);
  } catch {
    // malformed encoding: use it as-is
  }

  await connectDB();
  const doc = await Project.findOne({ slug: clean, published: true }).lean();
  return doc ? serialize<ProjectType>(doc) : null;
}

export async function getAllProjects() {
  await connectDB();
  const docs = await Project.find().sort({ createdAt: -1 }).lean();
  return serialize<ProjectType[]>(docs);
}

export async function getProjectById(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const doc = await Project.findById(id).lean();
  return doc ? serialize<ProjectType>(doc) : null;
}

export async function createProject(data: ProjectInput) {
  await connectDB();
  const doc = await Project.create(
    omitProtected({ ...data, slug: slugify(data.slug) }),
  );
  return serialize<ProjectType>(doc);
}

export async function updateProject(id: string, data: Partial<ProjectInput>) {
  if (!isValidObjectId(id)) return null;
  await connectDB();

  const patch = omitProtected(data);
  if (typeof patch.slug === "string") patch.slug = slugify(patch.slug);

  const doc = await Project.findByIdAndUpdate(
    id,
    { $set: patch },
    { new: true, runValidators: true },
  ).lean();
  return doc ? serialize<ProjectType>(doc) : null;
}

export async function deleteProject(id: string) {
  if (!isValidObjectId(id)) return false;
  await connectDB();
  return !!(await Project.findByIdAndDelete(id));
}
