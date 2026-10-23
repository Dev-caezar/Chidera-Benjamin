"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Search, Star, FolderKanban } from "lucide-react";
import ProjectModal from "./ProjectModal";
import DeleteProjectButton from "./DeleteProjectButton";

type Project = {
    _id: string;
    title: string;
    slug: string;
    role?: string;
    year?: number;
    tags?: string[];
    published?: boolean;
    featured?: boolean;
    coverImage?: string;
};

export default function ProjectsListClient({
    projects,
}: {
    projects: Project[];
}) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);

    const filtered = useMemo(() => {
        return projects.filter((p) => {
            const matchesSearch =
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.slug.toLowerCase().includes(search.toLowerCase());
            const matchesFilter =
                filter === "all" ||
                (filter === "published" && p.published) ||
                (filter === "draft" && !p.published);
            return matchesSearch && matchesFilter;
        });
    }, [projects, search, filter]);

    function openNew() {
        setEditing(null);
        setModalOpen(true);
    }

    function openEdit(project: Project) {
        setEditing(project);
        setModalOpen(true);
    }

    function handleModalClose() {
        setModalOpen(false);
        router.refresh();
    }

    return (
        <div className="space-y-6 max-w-full mx-auto pb-12 font-poppins">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2.5">
                        <FolderKanban className="w-6 h-6 text-orange-600" />
                        Projects
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1 font-medium">
                        {projects.length} total project{projects.length === 1 ? "" : "s"} · Manage case studies and portfolios
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-600/10 hover:bg-orange-500 active:scale-[0.98] transition-all shrink-0"
                >
                    <Plus size={15} />
                    New project
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or slug..."
                        className="w-full rounded-xl border border-zinc-200/80 bg-white pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-1 bg-zinc-100/80 border border-zinc-200/80 rounded-xl p-1 self-start sm:self-auto">
                    {(["all", "published", "draft"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f
                                ? "bg-white text-zinc-900 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-900"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List / Table Container */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
                {filtered.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-1 shadow-sm">
                            <Search size={20} />
                        </div>
                        <p className="text-sm font-medium text-zinc-700">
                            {projects.length === 0
                                ? "No projects yet — create your first case study."
                                : "No projects match your search criteria."}
                        </p>
                        <p className="text-xs text-zinc-400 max-w-xs">
                            {projects.length === 0
                                ? "Get started by adding details, team notes, metrics, and cover artwork."
                                : "Try clearing your search terms or changing the active filters."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {filtered.map((p) => (
                            <div
                                key={p._id}
                                className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-50/80 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200/80 overflow-hidden shrink-0">
                                    {p.coverImage ? (
                                        <img
                                            src={p.coverImage}
                                            alt={p.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-medium">
                                            No img
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-xs sm:text-sm text-zinc-900 truncate">
                                            {p.title}
                                        </p>
                                        {p.featured && (
                                            <span className="flex items-center gap-1 bg-orange-50 text-orange-600 border border-orange-200/60 px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0">
                                                <Star size={10} className="fill-orange-500" /> Featured
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                                        <span className="text-zinc-400">/{p.slug}</span>
                                        {p.role && ` · ${p.role}`}
                                        {p.year && ` · ${p.year}`}
                                    </p>
                                </div>

                                <span
                                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 border ${p.published
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                                        : "bg-zinc-100 text-zinc-500 border-zinc-200/80"
                                        }`}
                                >
                                    {p.published ? "Published" : "Draft"}
                                </span>

                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl transition-colors"
                                        aria-label="Edit project"
                                        title="Edit project"
                                    >
                                        <Pencil size={15} />
                                    </button>

                                    <DeleteProjectButton id={p._id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ProjectModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                projectToEdit={editing}
            />
        </div>
    );
}