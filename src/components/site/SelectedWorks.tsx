import { getProjects } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const SelectedWork = async () => {
  const allProjects = await getProjects();
  const projects =
    allProjects
      ?.filter((project: any) => project.published)
      ?.slice(0, 4) || [];

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-zinc-500">No published projects yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 px-6 md:px-12 bg-white">
      {/* Container aligned perfectly at max-w-6xl */}
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1.5">
              Portfolio
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Selected work
            </h2>
          </div>

          <Link
            href="/work"
            className="text-sm font-semibold text-zinc-900 hover:text-orange-600 transition-colors hidden sm:inline-block"
          >
            See all work →
          </Link>
        </div>

        {/* Grid aligned directly with container edge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project: any, index: number) => (
            <Link
              key={project._id || project.slug || index}
              href={`/work/${project.slug}`}
              className="group block w-full transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              <div className="space-y-3">
                {/* Compact Image Frame */}
                <div className="relative w-full aspect-16/10 overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200/60 shadow-xs transition-all duration-300 group-hover:border-orange-500/40 group-hover:shadow-md">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-mono text-zinc-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Text Content Flush with Image Edge */}
                <div className="flex items-start justify-between gap-3 px-0.5">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-orange-600 transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {project.role || "Product Designer"}
                      {project.year && ` · ${project.year}`}
                    </p>
                  </div>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 transition-all duration-300 group-hover:border-orange-600 group-hover:bg-orange-600 group-hover:text-white">
                    <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:rotate-45" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SelectedWork;