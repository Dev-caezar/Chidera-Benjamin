"use client";

import React, { useState, useMemo } from "react";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import ProjectModal from "@/components/admin/ProjectModal";
import {
  FolderKanban,
  FileEdit,
  Pencil,
  Plus,
  Search,
  Sparkles,
  ArrowUpRight,
  Filter,
  XCircle,
  Clock,
  Globe,
  TrendingUp
} from "lucide-react";

export interface SerializedProject {
  _id: string;
  title: string;
  slug: string;
  role?: string;
  year?: number;
  tags?: string[];
  published: boolean;
  coverImage?: string;
  createdAt?: string;
}

interface DashboardClientProps {
  initialProjects?: SerializedProject[];
}

export default function DashboardClient({ initialProjects = [] }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "drafts">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SerializedProject | null>(null);

  const projects = Array.isArray(initialProjects) ? initialProjects : [];

  const publishedProjects = useMemo(() => projects.filter((p) => p.published), [projects]);
  const draftProjects = useMemo(() => projects.filter((p) => !p.published), [projects]);
  const publishedRatio = projects.length
    ? Math.round((publishedProjects.length / projects.length) * 100)
    : 0;

  const focusProject = draftProjects[0] || projects[0];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        (project.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.slug || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (statusFilter === "published") return matchesSearch && project.published;
      if (statusFilter === "drafts") return matchesSearch && !project.published;
      return matchesSearch;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleOpenNew = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: SerializedProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-24 font-poppins text-zinc-900 selection:bg-orange-600 selection:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Projects Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-2 rounded-full bg-orange-600 text-white shadow-xs">
              <Sparkles size={11} className="text-amber-200" /> Admin Workspace
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage your case studies, draft ideas, and live portfolio showcase.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleOpenNew}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 hover:shadow-md active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.4} />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Total Entries
              </span>
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                <FolderKanban size={18} />
              </div>
            </div>
            <div className="mt-6 flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                {projects.length}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-medium bg-zinc-50 px-2.5 py-1 rounded-md">
                <TrendingUp size={12} className="text-orange-500" /> Database
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Published Ratio
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100/60 transition-colors">
                <Globe size={18} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                  {publishedProjects.length}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {publishedRatio}% Public
                </span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${publishedRatio}%` }}
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 p-5 rounded-3xl bg-linear-to-r from-orange-600 via-orange-500 to-amber-600 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-white backdrop-blur-md shrink-0">
                <FileEdit size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {draftProjects.length} Draft{draftProjects.length === 1 ? "" : "s"} Pending Review
                </p>
                <p className="text-xs text-orange-100">
                  Keep your portfolio updated by pushing queued work live.
                </p>
              </div>
            </div>
            <button
              onClick={() => setStatusFilter("drafts")}
              className="w-full sm:w-auto text-center text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              Filter Drafts
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 flex">
          {focusProject ? (
            <div className="w-full p-5 sm:p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Quick Focus
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${focusProject.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-orange-50 text-orange-700"
                      }`}
                  >
                    {focusProject.published ? "Live" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mb-1 truncate">/{focusProject.slug}</p>
                <h3 className="text-base font-bold text-zinc-900 line-clamp-2">
                  {focusProject.title}
                </h3>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between mt-4">
                <span className="text-[11px] text-zinc-400">{focusProject.createdAt}</span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(focusProject)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer group/btn"
                >
                  Edit <Pencil size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full p-6 rounded-3xl bg-zinc-50/50 flex flex-col items-center justify-center text-center shadow-inner">
              <Sparkles size={24} className="text-zinc-400 mb-2" />
              <p className="text-xs font-medium text-zinc-500">No project selected</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/40">
          <div className="flex flex-wrap items-center bg-zinc-100/80 p-1 rounded-xl w-full md:w-fit gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${statusFilter === "all"
                ? "bg-white text-orange-600 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900"
                }`}
            >
              All ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${statusFilter === "published"
                ? "bg-white text-orange-600 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900"
                }`}
            >
              Published ({publishedProjects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("drafts")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${statusFilter === "drafts"
                ? "bg-white text-orange-600 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900"
                }`}
            >
              Drafts ({draftProjects.length})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or slug..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all font-poppins shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <XCircle size={14} />
              </button>
            )}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="py-20 px-6 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-3 shadow-sm">
              <Filter size={20} />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-1">
              No matching projects found
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              {searchQuery
                ? `No entries match "${searchQuery}". Try revising your search term.`
                : "No projects exist under this filter category."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredProjects.map((p) => (
              <div
                key={p._id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:px-6 sm:py-4 hover:bg-orange-50/30 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-orange-50 overflow-hidden shrink-0 relative flex items-center justify-center text-orange-500 shadow-sm">
                    {p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <FolderKanban size={18} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-zinc-900 truncate">
                        {p.title}
                      </p>
                      {p.published && (
                        <a
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-zinc-400 hover:text-orange-600 transition-opacity"
                          title="Preview live case study"
                        >
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400 mt-1">
                      <span className="truncate max-w-40 sm:max-w-xs font-mono text-[11px]">/{p.slug}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                        <Clock size={11} /> {p.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${p.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-orange-50 text-orange-700"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${p.published ? "bg-emerald-500 animate-pulse" : "bg-orange-500"
                        }`}
                    />
                    {p.published ? "Published" : "Draft"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 text-zinc-500 hover:bg-orange-100/60 hover:text-orange-600 rounded-xl transition-colors cursor-pointer"
                      title="Edit project"
                    >
                      <Pencil size={15} strokeWidth={2} />
                    </button>

                    <DeleteProjectButton id={p._id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={selectedProject}
      />
    </div>
  );
}