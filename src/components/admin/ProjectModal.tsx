"use client";

import React, { useEffect } from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import { X } from "lucide-react";

type Project = {
  _id?: string;
  title?: string;
  slug?: string;
  role?: string;
  year?: number;
  tags?: string[];
  published?: boolean;
  coverImage?: string;
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export default function ProjectModal({
  isOpen,
  onClose,
  projectToEdit,
}: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-poppins selection:bg-orange-600 selection:text-white">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-zinc-200/80 shadow-2xl overflow-hidden z-10 max-h-[92vh] sm:max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900">
              {projectToEdit ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {projectToEdit
                ? "Update case study information and publishing status."
                : "Add a new project entry to your portfolio."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto">
          <ProjectForm
            key={projectToEdit?._id || "new"}
            initial={projectToEdit || undefined}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}