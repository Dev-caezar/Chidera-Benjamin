import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
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
            New Project
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Add a new case study or entry to your portfolio.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
        <ProjectForm />
      </div>
    </div>
  );
}