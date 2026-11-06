import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
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
        <section className="border-t border-zinc-200 py-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#F44A00]">
                {eyebrow}
            </p>
            {title && (
                <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
}

function Prose({ text }: { text: string }) {
    return (
        <p className="max-w-3xl whitespace-pre-line text-base leading-relaxed text-zinc-600 md:text-lg">
            {text}
        </p>
    );
}

export default async function CaseStudyPage({ params }: Props) {
    const { slug } = await params;
    const p = await getProjectBySlug(slug);
    if (!p) notFound();

    // Optional arrays get a default once, so nothing below needs ?. or !
    const goals = p.goals ?? [];
    const personas = p.personas ?? [];
    const process = p.process ?? [];
    const designSystem = p.designSystem ?? [];
    const gallery = p.gallery ?? [];
    const outcomes = p.outcomes ?? [];

    const all = await getPublishedProjects();
    const index = all.findIndex((x) => x._id === p._id);
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
            <div className="bg-[#0B0301] pt-18">
                <ProjectHero project={p} />
            </div>

            <div className="mx-auto max-w-6xl px-6 md:px-12">
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

                <div className="mt-14 space-y-4">
                    {p.introduction && (
                        <Section eyebrow="Overview">
                            <Prose text={p.introduction} />
                        </Section>
                    )}

                    {(p.challenge || goals.length > 0) && (
                        <Section eyebrow="The challenge">
                            {p.challenge && <Prose text={p.challenge} />}
                            {goals.length > 0 && (
                                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {goals.map((g) => (
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

                    {personas.length > 0 && (
                        <Section eyebrow="Research" title="Who we designed for">
                            <ImageBlocks images={personas} columns={2} />
                        </Section>
                    )}

                    {process.length > 0 && (
                        <Section eyebrow="Process" title="How it came together">
                            <ImageBlocks images={process} />
                        </Section>
                    )}

                    {p.solution && (
                        <Section eyebrow="The solution">
                            <Prose text={p.solution} />
                        </Section>
                    )}

                    {designSystem.length > 0 && (
                        <Section eyebrow="Design system">
                            <ImageBlocks images={designSystem} />
                        </Section>
                    )}

                    {gallery.length > 0 && (
                        <Section eyebrow="Gallery">
                            <ImageBlocks images={gallery} />
                        </Section>
                    )}

                    {outcomes.length > 0 && (
                        <Section eyebrow="Results">
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {outcomes.map((o, i) => (
                                    <div key={i} className="rounded-3xl bg-zinc-900 p-6 text-white shadow-md">
                                        <p className="font-heading text-4xl font-bold text-[#F44A00]">{o.value}</p>
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

                {next && next._id !== p._id && (
                    <Link
                        href={`/work/${next.slug}`}
                        className="group mt-16 flex items-center justify-between rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-xs transition-all hover:border-orange-200 hover:bg-orange-50/40"
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#F44A00]">
                                Next project
                            </p>
                            <p className="mt-2 font-heading text-2xl font-semibold text-zinc-900 transition-colors group-hover:text-[#F44A00]">
                                {next.title}
                            </p>
                        </div>
                        <ArrowRight
                            size={22}
                            className="text-zinc-900 transition-transform group-hover:translate-x-1 group-hover:text-[#F44A00]"
                        />
                    </Link>
                )}
            </div>
        </article>
    );
}