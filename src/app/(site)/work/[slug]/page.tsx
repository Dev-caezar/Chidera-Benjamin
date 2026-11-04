import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { getProjectBySlug, getPublishedProjects } from "@/service/project";
import ProjectHero from "@/components/site/ProjectHero";
import ImageBlocks from "@/components/site/ImageBlocks";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const p = await getProjectBySlug(slug);
    if (!p) return { title: "Project not found" };

    const description = p.metaDescription || p.summary;
    return {
        title: `${p.title} — Case Study`,
        description,
        openGraph: {
            title: p.title,
            description,
            images: p.coverImage ? [p.coverImage] : [],
        },
    };
}

function Section({
    eyebrow,
    title,
    children,
}: {
    eyebrow: string;
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="py-12 border-t border-zinc-200">
            <p className="text-xs font-semibold tracking-wider uppercase text-orange-600 mb-3">
                {eyebrow}
            </p>
            {title && (
                <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
}

function Prose({ text }: { text: string }) {
    return (
        <p className="max-w-3xl text-base md:text-lg leading-relaxed text-zinc-600 whitespace-pre-line">
            {text}
        </p>
    );
}

export default async function CaseStudyPage({ params }: Props) {
    const { slug } = await params;
    const p = await getProjectBySlug(slug);
    if (!p) notFound();

    const ds = p.designSystem; // Restored reference

    const all = await getPublishedProjects();
    const index = all.findIndex((x: any) => x.slug === slug);
    const next = all.length > 1 ? all[(index + 1) % all.length] : null;

    const meta = [
        { label: "Role", value: p.role },
        { label: "Client", value: p.client },
        { label: "Year", value: p.year },
        { label: "Duration", value: p.duration },
        { label: "Team", value: p.team?.join(", ") },
        { label: "Tools", value: p.tools?.join(", ") },
    ].filter((m) => m.value);

    return (
        <article className="min-h-screen bg-white pb-32">
            {/* Top Back Navigation & Starfield Hero Section */}
            <div className="bg-[#0B0301] pt-18">
                {/* <div className="max-w-6xl mx-auto px-6 md:px-12 pb-4">
                    <Link
                        href="/work"
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-[#F44A00] transition-colors"
                    >
                        <ArrowLeft size={14} /> All work
                    </Link>
                </div> */}

                <ProjectHero project={p} />
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-12">
                {/* Meta strip */}
                {meta.length > 0 && (
                    <dl className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3">
                        {meta.map((m) => (
                            <div key={m.label}>
                                <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    {m.label}
                                </dt>
                                <dd className="mt-1.5 text-sm font-medium text-zinc-900">{m.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                <div className="mt-14">
                    {p.introduction && (
                        <Section eyebrow="Overview">
                            <Prose text={p.introduction} />
                        </Section>
                    )}

                    {(p.challenge || p.goals?.length > 0) && (
                        <Section eyebrow="The challenge">
                            {p.challenge && <Prose text={p.challenge} />}
                            {p.goals?.length > 0 && (
                                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {p.goals.map((g: string) => (
                                        <li
                                            key={g}
                                            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm font-medium text-zinc-800"
                                        >
                                            {g}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Section>
                    )}

                    {p.personas?.length > 0 && (
                        <Section eyebrow="Research" title="Who we designed for">
                            <ImageBlocks images={p.personas!} columns={2} />
                        </Section>
                    )}

                    {p.process?.length > 0 && (
                        <Section eyebrow="Process" title="How it came together">
                            <ImageBlocks images={p.process!} />
                        </Section>
                    )}

                    {p.solution && (
                        <Section eyebrow="The solution">
                            <Prose text={p.solution} />
                        </Section>
                    )}

                    {(p.designSystem?.length ?? 0) > 0 && (
                        <Section eyebrow="Design system">
                            <ImageBlocks images={p.designSystem!} />
                        </Section>
                    )}

                    {p.gallery?.length > 0 && (
                        <Section eyebrow="Gallery">
                            <ImageBlocks images={p.gallery} />
                        </Section>
                    )}

                    {p.outcomes?.length > 0 && (
                        <Section eyebrow="Results">
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {p.outcomes.map((o: any, i: number) => (
                                    <div key={i} className="rounded-3xl bg-zinc-900 p-6 text-white shadow-md">
                                        <p className="font-heading text-4xl font-bold text-orange-400">{o.value}</p>
                                        <p className="mt-2 text-sm text-zinc-400">{o.label}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {p.reflection && (
                        <Section eyebrow="Reflection">
                            <Prose text={p.reflection} />
                        </Section>
                    )}
                </div>

                {next && next.slug !== slug && (
                    <Link
                        href={`/work/${next.slug}`}
                        className="group mt-16 flex items-center justify-between rounded-3xl border border-zinc-200 bg-zinc-50 p-8 hover:bg-orange-50/40 hover:border-orange-200 transition-all shadow-xs"
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                                Next project
                            </p>
                            <p className="mt-2 font-heading text-2xl font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
                                {next.title}
                            </p>
                        </div>
                        <ArrowRight
                            size={22}
                            className="text-zinc-900 transition-transform group-hover:translate-x-1 group-hover:text-orange-600"
                        />
                    </Link>
                )}
            </div>
        </article>
    );
}