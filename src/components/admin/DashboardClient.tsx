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
import { Project } from "@/types/project";
import ErrorState from "./ErrorState";
import { useApi } from "@/hooks/useApi";
import { projectsApi } from "@/api-client/projects";
import BrandLoader from "./Loader";
import { formatProjectDate } from "@/lib/utils";

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
  const { data, error, loading, reload } = useApi(projectsApi.listAll);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "drafts">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = useMemo(() => data ?? [], [data]);
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

  const handleOpenEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (loading && !data) {
    return <BrandLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-24 font-poppins text-zinc-900 selection:bg-[#F44A00] selection:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            Projects Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
            Manage your case studies, draft ideas, and live portfolio showcase.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#F44A00] px-5 md:py-2.5 py-3.5 text-xs font-semibold text-white shadow-md shadow-[#F44A00]/20 hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.4} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Total Entries
              </span>
              <div className="p-2.5 rounded-xl bg-orange-50 text-[#F44A00] border border-orange-200/60 group-hover:scale-105 transition-transform">
                <FolderKanban size={18} />
              </div>
            </div>
            <div className="mt-6 flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                {projects.length}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-medium bg-zinc-50 border border-zinc-200/60 px-2.5 py-1 rounded-lg">
                <TrendingUp size={12} className="text-[#F44A00]" /> Database
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Published Ratio
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 group-hover:scale-105 transition-transform">
                <Globe size={18} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                  {publishedProjects.length}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                  {publishedRatio}% Public
                </span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-200/40">
                <div
                  className="bg-[#F44A00] h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${publishedRatio}%` }}
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 p-5 rounded-3xl bg-linear-to-r from-[#F44A00] via-orange-600 to-amber-600 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-white backdrop-blur-md shrink-0 border border-white/20">
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
              type="button"
              onClick={() => setStatusFilter("drafts")}
              className="w-full sm:w-auto text-center text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer backdrop-blur-xs border border-white/20"
            >
              Filter Drafts
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 flex">
          {focusProject ? (
            <div className="relative w-full p-6 rounded-3xl bg-zinc-900 text-white shadow-xl overflow-hidden group flex flex-col justify-between min-h-55">
              {focusProject.coverImage ? (
                <div className="absolute inset-0 z-0 opacity-25 group-hover:opacity-35 transition-opacity duration-500">
                  <img
                    src={focusProject.coverImage}
                    alt={focusProject.title}
                    className="w-full h-full object-cover blur-md scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-orange-950 via-orange-950/20" />
                </div>
              ) : (
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#F44A00]/15 rounded-full blur-3xl pointer-events-none" />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-semibold text-orange-400 border border-white/10">
                    <Sparkles size={11} />
                    <span>Quick Focus</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${focusProject.published
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-[#F44A00]/15 text-[#F44A00] border-[#F44A00]/30"
                      }`}
                  >
                    {focusProject.published ? "Live" : "Draft Queue"}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-1 truncate">/{focusProject.slug}</p>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white line-clamp-2">
                  {focusProject.title}
                </h3>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between mt-4">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                  <Clock size={11} />
                  {formatProjectDate(focusProject.createdAt) || "Recently added"}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(focusProject as Project)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#F44A00] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-[#F44A00]/20"
                >
                  <span>Edit</span>
                  <Pencil size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full p-6 rounded-3xl bg-zinc-50/50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center shadow-inner">
              <Sparkles size={24} className="text-zinc-400 mb-2" />
              <p className="text-xs font-medium text-zinc-500">No project selected</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200/85 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/40">
          <div className="flex flex-wrap items-center bg-zinc-100/80 p-1 rounded-xl w-full md:w-fit gap-1 border border-zinc-200/60">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${statusFilter === "all"
                ? "bg-white text-[#F44A00] shadow-xs border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-900"
                }`}
            >
              All ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${statusFilter === "published"
                ? "bg-white text-[#F44A00] shadow-xs border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-900"
                }`}
            >
              Published ({publishedProjects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("drafts")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${statusFilter === "drafts"
                ? "bg-white text-[#F44A00] shadow-xs border border-zinc-200/60"
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
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-zinc-200/80 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#F44A00] focus:ring-2 focus:ring-[#F44A00]/10 transition-all font-poppins shadow-xs"
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
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#F44A00] mb-3 shadow-xs">
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
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:px-6 sm:py-4 hover:bg-orange-50/20 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-orange-50 border border-orange-200/60 overflow-hidden shrink-0 relative flex items-center justify-center text-[#F44A00] shadow-xs">
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
                          href={`/work/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-zinc-400 hover:text-[#F44A00] transition-opacity"
                          title="Preview live case study"
                        >
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400 mt-1">
                      <span className="truncate max-w-40 sm:max-w-xs text-[12px]">/{p.slug}</span>
                      {p.createdAt && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                            <Clock size={11} /> {formatProjectDate(p.createdAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${p.published
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                      : "bg-orange-50 text-[#F44A00] border-orange-200/60"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${p.published ? "bg-emerald-500 animate-pulse" : "bg-[#F44A00]"
                        }`}
                    />
                    {p.published ? "Published" : "Draft"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p as Project)}
                      className="p-2 text-zinc-400 hover:bg-orange-50 hover:text-[#F44A00] rounded-xl transition-colors cursor-pointer"
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