// src/app/admin/(dashboard)/projects/page.tsx
import ProjectsListClient from "@/components/admin/ProjectsListClient";
import { connectDB } from "@/lib/mongodb";
import Project from "@/model/Project";

export default async function ProjectsPage() {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 }).lean();

    return <ProjectsListClient projects={JSON.parse(JSON.stringify(projects))} />;
}