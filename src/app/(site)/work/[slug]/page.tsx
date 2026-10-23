import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { getProjectBySlug, getPublishedProjects } from "@/lib/project";

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

    const hasLinks = p.links?.live || p.links?.prototype || p.links?.figma;
    const ds = p.designSystem;

    return (
        <article className="max-w-6xl mx-auto px-6 md:px-12 pt-15 pb-24">
            <Link
                href="/work"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
                <ArrowLeft size={14} /> All work
            </Link>

            <header className="mt-8 space-y-8">
                <div>
                    {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                            {p.tags.map((t: string) => (
                                <span
                                    key={t}
                                    className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-200/60"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                    <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">
                        {p.title}
                    </h1>
                    {p.summary && (
                        <p className="mt-5 max-w-2xl text-lg text-zinc-600">{p.summary}</p>
                    )}
                </div>

                {/* Semi-Hero Cover Image Section */}
                {/* {p.coverImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-xl">
                        <Image
                            src={p.coverImage}
                            alt={p.coverImageAlt || p.title}
                            fill
                            priority
                            sizes="(max-width: 1200px) 100vw, 1200px"
                            className="object-cover"
                        />
                    </div>
                )} */}
            </header>

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

            {hasLinks && (
                <div className="mt-8 flex flex-wrap gap-3">
                    {[
                        { label: "Live site", href: p.links.live },
                        { label: "Prototype", href: p.links.prototype },
                        { label: "Figma file", href: p.links.figma },
                    ]
                        .filter((l) => l.href)
                        .map((l, i) => (
                            <a
                                key={l.label}
                                href={l.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${i === 0
                                    ? "bg-orange-600 text-white hover:bg-orange-500 shadow-sm shadow-orange-600/20"
                                    : "bg-zinc-900 text-white hover:bg-zinc-700"
                                    }`}
                            >
                                {l.label} <ExternalLink size={13} />
                            </a>
                        ))}
                </div>
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
                        <div className="grid gap-6 md:grid-cols-2">
                            {p.personas.map((persona: any, i: number) => (
                                <div key={i} className="rounded-3xl border border-zinc-200 bg-white p-6">
                                    <div className="flex items-center gap-4">
                                        {persona.image && (
                                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                                                <Image
                                                    src={persona.image}
                                                    alt={persona.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-heading text-lg font-semibold text-zinc-900">
                                                {persona.name}
                                            </p>
                                            <p className="text-sm text-orange-600 font-medium">{persona.role}</p>
                                        </div>
                                    </div>
                                    {persona.bio && (
                                        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                                            {persona.bio}
                                        </p>
                                    )}
                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        {persona.goals?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                                                    Goals
                                                </p>
                                                <ul className="space-y-1.5 text-sm text-zinc-700">
                                                    {persona.goals.map((g: string) => (
                                                        <li key={g} className="flex items-center gap-2">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                                            {g}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {persona.frustrations?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                                                    Frustrations
                                                </p>
                                                <ul className="space-y-1.5 text-sm text-rose-600">
                                                    {persona.frustrations.map((f: string) => (
                                                        <li key={f} className="flex items-center gap-2">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {p.process?.length > 0 && (
                    <Section eyebrow="Process" title="How it came together">
                        <ol className="space-y-10">
                            {p.process.map((step: any, i: number) => (
                                <li key={i} className="grid gap-6 md:grid-cols-[auto_1fr]">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white shadow-md shadow-orange-600/20">
                                        0{i + 1}
                                    </span>
                                    <div>
                                        <h3 className="font-heading text-xl font-semibold text-zinc-900">
                                            {step.phase}
                                        </h3>
                                        {step.description && (
                                            <p className="mt-2 max-w-2xl text-zinc-600 leading-relaxed whitespace-pre-line">
                                                {step.description}
                                            </p>
                                        )}
                                        {step.image && (
                                            <div className="relative mt-5 aspect-16/10 w-full overflow-hidden rounded-2xl border border-zinc-200/80">
                                                <Image
                                                    src={step.image}
                                                    alt={step.phase}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </Section>
                )}

                {p.solution && (
                    <Section eyebrow="The solution">
                        <Prose text={p.solution} />
                    </Section>
                )}

                {(ds?.typography?.length > 0 || ds?.colorPalette?.length > 0) && (
                    <Section eyebrow="Design system">
                        {ds.colorPalette?.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {ds.colorPalette.map((c: any, i: number) => (
                                    <div key={i}>
                                        <div
                                            className="h-24 rounded-2xl border border-zinc-200 shadow-inner"
                                            style={{ backgroundColor: c.hex }}
                                        />
                                        <p className="mt-2 text-sm font-medium text-zinc-900">{c.name}</p>
                                        <p className="text-xs uppercase text-zinc-500">{c.hex}</p>
                                        {c.usage && <p className="text-xs text-zinc-400">{c.usage}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                        {ds.typography?.length > 0 && (
                            <div className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">
                                {ds.typography.map((t: any, i: number) => (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:justify-between"
                                    >
                                        <p className="text-2xl text-zinc-900">
                                            {t.sampleText || "The quick brown fox"}
                                        </p>
                                        <p className="text-sm text-zinc-500">
                                            {t.name}
                                            {t.usage && ` · ${t.usage}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {ds.notes && (
                            <div className="mt-6">
                                <Prose text={ds.notes} />
                            </div>
                        )}
                    </Section>
                )}

                {p.gallery?.length > 0 && (
                    <Section eyebrow="Gallery">
                        <div className="space-y-8">
                            {p.gallery.map((g: any, i: number) => (
                                <figure key={i}>
                                    <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl border border-zinc-200/80">
                                        <Image
                                            src={g.url}
                                            alt={g.alt || ""}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {g.caption && (
                                        <figcaption className="mt-3 text-center text-sm text-zinc-500">
                                            {g.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            ))}
                        </div>
                    </Section>
                )}

                {p.outcomes?.length > 0 && (
                    <Section eyebrow="Results">
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {p.outcomes.map((o: any, i: number) => (
                                <div key={i} className="rounded-3xl bg-zinc-900 p-6 text-white">
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
                    className="group mt-16 flex items-center justify-between rounded-3xl border border-zinc-200 bg-zinc-50 p-8 hover:bg-orange-50/40 hover:border-orange-200 transition-all"
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
        </article>
    );
}