import { connectDB } from "@/lib/mongodb";
import Project from "@/model/Project";
import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  await connectDB();
  const rawProject = await Project.findById(id).lean();

  if (!rawProject) {
    notFound();
  }

  const initialData = JSON.parse(
    JSON.stringify({
      _id: rawProject._id.toString(),
      title: rawProject.title || "",
      slug: rawProject.slug || "",
      role: rawProject.role || "",
      year: rawProject.year ? Number(rawProject.year) : undefined,
      tags: rawProject.tags || [],
      published: Boolean(rawProject.published),
      coverImage: rawProject.coverImage || "",
    })
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 font-poppins">
      <div className="flex items-center gap-3 pb-6 border-b border-zinc-200/80">
        <Link
          href="/admin"
          className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Edit Project
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Update details and publishing status for this entry.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
        <ProjectForm initial={initialData} />
      </div>
    </div>
  );
}