import { connectDB } from "@/lib/mongodb";
import Project from "@/model/Project";
import DashboardClient, { SerializedProject } from "@/components/admin/DashboardClient";

export default async function AdminDashboard() {
  await connectDB();
  
  // Fetch projects from MongoDB sorted by newest first
  const rawProjects = await Project.find().sort({ createdAt: -1 }).lean();

  // Clean serialization layer for Next.js App Router
  const initialProjects: SerializedProject[] = (rawProjects || []).map((p: any) => ({
    _id: p._id ? p._id.toString() : "",
    title: p.title || "Untitled Project",
    slug: p.slug || "",
    published: Boolean(p.published),
    coverImage: p.coverImage || "",
    category: p.category || "Design",
    createdAt: p.createdAt
      ? new Date(p.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recently",
  }));

  const safeProjects = JSON.parse(JSON.stringify(initialProjects));

  return <DashboardClient initialProjects={safeProjects} />;
}