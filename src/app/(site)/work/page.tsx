export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProjects } from "@/lib/project";

export const metadata = {
    title: "Work",
    description: "Selected product design case studies.",
};

export default async function WorkPage() {
    const projects = await getPublishedProjects();

    return (
        <section className="max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24 font-sans">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#F44A00] mb-3">
                Case studies
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
                Selected work
            </h1>
            <p className="mt-4 max-w-xl text-zinc-600 text-sm sm:text-base leading-relaxed">
                Product design projects, from research to shipped interface.
            </p>

            {projects.length === 0 ? (
                <p className="mt-16 text-sm text-zinc-500">No projects published yet.</p>
            ) : (
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {projects.map((p: any) => (
                        <Link key={p._id} href={`/work/${p.slug}`} className="group block">
                            <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200/80 shadow-xs transition-all duration-300 group-hover:border-orange-500/40 group-hover:shadow-md">
                                {p.coverImage ? (
                                    <Image
                                        src={p.coverImage}
                                        alt={p.coverImageAlt || p.title}
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

                            <div className="mt-4 flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="font-heading text-base font-bold text-zinc-900 group-hover:text-[#F44A00] transition-colors duration-200">
                                        {p.title}
                                    </h2>
                                    {p.summary && (
                                        <p className="mt-1 text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                                            {p.summary}
                                        </p>
                                    )}
                                    {p.tags?.length > 0 && (
                                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                                            {p.tags.slice(0, 3).map((t: string) => (
                                                <span
                                                    key={t}
                                                    className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-medium text-zinc-600"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-900 transition-all duration-300 group-hover:border-[#F44A00] group-hover:bg-[#F44A00] group-hover:text-white">
                                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:rotate-45" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}