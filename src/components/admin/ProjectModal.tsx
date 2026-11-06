"use client";

import React, { useEffect, useState } from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import { X, Check, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSavedSlug, setLastSavedSlug] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsSuccess(false);
      setLastSavedSlug(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSuccess = (savedProject?: { slug?: string }) => {
    if (savedProject?.slug) {
      setLastSavedSlug(savedProject.slug);
    }
    setIsSuccess(true);
    router.refresh();

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-poppins selection:bg-[#F44A00] selection:text-white">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
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
            className="p-2 text-zinc-400 hover:text-[#F44A00] hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative p-5 sm:p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="min-h-80 flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-[#F44A00]/25 flex items-center justify-center text-[#F44A00] mb-4 shadow-sm">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <h3 className="font-heading text-lg font-bold text-zinc-900">
                  {projectToEdit ? "Project Updated!" : "Project Created!"}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Changes saved successfully. Refreshing dashboard...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <ProjectForm
                  key={projectToEdit?._id || "new"}
                  initial={projectToEdit || undefined}
                  onSuccess={handleSuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}