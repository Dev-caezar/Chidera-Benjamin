"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload, Loader2, Plus, X, ChevronLeft, ChevronRight, Check } from "lucide-react";

type Outcome = { label: string; value: string };
type GalleryItem = { url: string; alt?: string; caption?: string };
type Persona = {
    name: string;
    role: string;
    bio: string;
    goals: string[];
    frustrations: string[];
    image?: string;
};
type ProcessStep = { phase: string; description: string; image?: string };
type TypographyItem = { name: string; usage: string; sampleText: string };
type ColorItem = { name: string; hex: string; usage: string };

type Project = {
    _id?: string;
    title?: string;
    slug?: string;
    summary?: string;
    role?: string;
    client?: string;
    year?: number;
    duration?: string;
    team?: string[];
    tools?: string[];
    tags?: string[];
    coverImage?: string;
    coverImageAlt?: string;
    gallery?: GalleryItem[];
    links?: { live?: string; prototype?: string; figma?: string };
    outcomes?: Outcome[];
    introduction?: string;
    challenge?: string;
    goals?: string[];
    personas?: Persona[];
    process?: ProcessStep[];
    designSystem?: {
        typography?: TypographyItem[];
        colorPalette?: ColorItem[];
        notes?: string;
    };
    solution?: string;
    reflection?: string;
    featured?: boolean;
    order?: number;
    published?: boolean;
    metaDescription?: string;
};

interface ProjectFormProps {
    initial?: Project;
    onSuccess?: () => void;
}

const inputClass =
    "w-full rounded-xl border border-zinc-200/80 px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all font-poppins";

function toList(value: FormDataEntryValue | null) {
    return String(value || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}

async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Image upload failed");
    }
    const data = await res.json();
    return data.url;
}

function Field({
    label,
    required,
    hint,
    children,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
        </div>
    );
}

const STEPS = [
    "Cover & Basics",
    "Project details",
    "Case study",
    "Personas",
    "Process",
    "Design system",
    "Links & Outcomes",
    "Gallery",
    "Display & SEO",
];

export default function ProjectForm({ initial, onSuccess }: ProjectFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
    const [gallery, setGallery] = useState<GalleryItem[]>(
        initial?.gallery?.map((g) => ({
            url: g.url,
            alt: g.alt || "",
            caption: g.caption || "",
        })) || []
    );
    const [outcomes, setOutcomes] = useState<Outcome[]>(
        initial?.outcomes?.map((o) => ({
            label: o.label || "",
            value: o.value || "",
        })) || []
    );
    const [personas, setPersonas] = useState<Persona[]>(
        initial?.personas?.map((p) => ({
            name: p.name || "",
            role: p.role || "",
            bio: p.bio || "",
            goals: p.goals || [],
            frustrations: p.frustrations || [],
            image: p.image || "",
        })) || []
    );
    const [process, setProcess] = useState<ProcessStep[]>(
        initial?.process?.map((p) => ({
            phase: p.phase || "",
            description: p.description || "",
            image: p.image || "",
        })) || []
    );
    const [typography, setTypography] = useState<TypographyItem[]>(
        initial?.designSystem?.typography?.map((t) => ({
            name: t.name || "",
            usage: t.usage || "",
            sampleText: t.sampleText || "",
        })) || []
    );
    const [colorPalette, setColorPalette] = useState<ColorItem[]>(
        initial?.designSystem?.colorPalette?.map((c) => ({
            name: c.name || "",
            hex: c.hex || "",
            usage: c.usage || "",
        })) || []
    );

    const [basics, setBasics] = useState({
        title: initial?.title || "",
        slug: initial?.slug || "",
        summary: initial?.summary || "",
        coverImageAlt: initial?.coverImageAlt || "",
    });
    const [details, setDetails] = useState({
        role: initial?.role || "",
        client: initial?.client || "",
        year: initial?.year || new Date().getFullYear(),
        duration: initial?.duration || "",
        team: initial?.team?.join(", ") || "",
        tools: initial?.tools?.join(", ") || "",
        tags: initial?.tags?.join(", ") || "",
    });
    const [narrative, setNarrative] = useState({
        introduction: initial?.introduction || "",
        challenge: initial?.challenge || "",
        goals: initial?.goals?.join(", ") || "",
        solution: initial?.solution || "",
        reflection: initial?.reflection || "",
    });
    const [designSystemNotes, setDesignSystemNotes] = useState(
        initial?.designSystem?.notes || ""
    );
    const [links, setLinks] = useState({
        live: initial?.links?.live || "",
        prototype: initial?.links?.prototype || "",
        figma: initial?.links?.figma || "",
    });
    const [display, setDisplay] = useState({
        order: initial?.order ?? 0,
        metaDescription: initial?.metaDescription || "",
        featured: initial?.featured || false,
        published: initial?.published || false,
    });

    async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            setCoverImage(await uploadImage(file));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setUploading(true);
        setError("");
        try {
            const urls = await Promise.all(files.map(uploadImage));
            setGallery((prev) => [
                ...prev,
                ...urls.map((url) => ({ url, alt: "", caption: "" })),
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    function updateGallery(i: number, patch: Partial<GalleryItem>) {
        setGallery((prev) => prev.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
    }
    function updateOutcome(i: number, patch: Partial<Outcome>) {
        setOutcomes((prev) => prev.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
    }
    function updatePersona(i: number, patch: Partial<Persona>) {
        setPersonas((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
    }
    function updateProcessStep(i: number, patch: Partial<ProcessStep>) {
        setProcess((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
    }
    function updateTypography(i: number, patch: Partial<TypographyItem>) {
        setTypography((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
    }
    function updateColor(i: number, patch: Partial<ColorItem>) {
        setColorPalette((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
    }

    async function handlePersonaImageChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            updatePersona(i, { image: await uploadImage(file) });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    async function handleProcessImageChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            updateProcessStep(i, { image: await uploadImage(file) });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    function goNext() {
        if (step === 0 && (!basics.title.trim() || !basics.slug.trim())) {
            setError("Title and slug are required before continuing.");
            return;
        }
        setError("");
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function goBack() {
        setError("");
        setStep((s) => Math.max(s - 1, 0));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!basics.title.trim() || !basics.slug.trim()) {
            setError("Title and slug are required.");
            setStep(0);
            return;
        }

        setSaving(true);
        setError("");

        const body = {
            title: basics.title,
            slug: basics.slug.trim().toLowerCase(),
            summary: basics.summary,
            coverImage,
            coverImageAlt: basics.coverImageAlt,
            role: details.role,
            client: details.client,
            year: details.year || undefined,
            duration: details.duration,
            team: toList(details.team),
            tools: toList(details.tools),
            tags: toList(details.tags),
            introduction: narrative.introduction,
            challenge: narrative.challenge,
            goals: toList(narrative.goals),
            solution: narrative.solution,
            reflection: narrative.reflection,
            personas: personas.filter((p) => p.name.trim()),
            process: process.filter((p) => p.phase.trim() || p.description.trim()),
            designSystem: {
                typography: typography.filter((t) => t.name.trim()),
                colorPalette: colorPalette.filter((c) => c.hex.trim()),
                notes: designSystemNotes,
            },
            links: { live: links.live, prototype: links.prototype, figma: links.figma },
            outcomes: outcomes.filter((o) => o.label.trim() || o.value.trim()),
            gallery: gallery.map(({ url, alt, caption }) => ({ url, alt, caption })),
            order: Number(display.order) || 0,
            metaDescription: display.metaDescription,
            featured: display.featured,
            published: display.published,
        };

        const url = initial?._id ? `/api/projects/${initial._id}` : "/api/projects";
        const method = initial?._id ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        setSaving(false);

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Something went wrong");
            return;
        }

        router.refresh();
        if (onSuccess) onSuccess();
    }

    const isLastStep = step === STEPS.length - 1;

    return (
        <form onSubmit={handleSubmit} className="font-poppins">
            <div className="flex items-center justify-center gap-1.5 mb-6 overflow-x-auto pb-1">
                {STEPS.map((label, i) => (
                    <div key={label} className="flex items-center justify-center gap-1.5 shrink-0">
                        <button
                            type="button"
                            onClick={() => setStep(i)}
                            className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-semibold transition-colors ${i === step
                                ? "bg-orange-500 text-white"
                                : i < step
                                    ? "bg-green-400 text-white"
                                    : "bg-orange-500 text-white"
                                }`}
                        >
                            {i < step ? <Check size={12} /> : i + 1}
                        </button>
                        {i < STEPS.length - 1 && (
                            <div className={`w-4 h-px ${i < step ? "bg-zinc-900/30" : "bg-zinc-200"}`} />
                        )}
                    </div>
                ))}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 text-center">
                Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </p>

            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600 mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4 min-h-80">
                {step === 0 && (
                    <>
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Cover Image
                            </label>
                            {coverImage ? (
                                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-zinc-200/80 group">
                                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="px-4 py-2 bg-white text-zinc-900 rounded-xl text-xs font-semibold cursor-pointer shadow-md">
                                            Change Image
                                            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-200 rounded-2xl hover:border-zinc-400 hover:bg-zinc-50/50 transition-all cursor-pointer">
                                    <div className="flex flex-col items-center justify-center pt-4 pb-5 text-zinc-400">
                                        {uploading ? (
                                            <Loader2 size={22} className="animate-spin text-zinc-600 mb-2" />
                                        ) : (
                                            <Upload size={22} className="mb-2" />
                                        )}
                                        <p className="text-xs font-medium text-zinc-600">
                                            {uploading ? "Uploading image..." : "Click to upload cover image"}
                                        </p>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">PNG, JPG, or WEBP</p>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleCoverChange} disabled={uploading} className="hidden" />
                                </label>
                            )}
                            <input
                                value={basics.coverImageAlt}
                                onChange={(e) => setBasics((b) => ({ ...b, coverImageAlt: e.target.value }))}
                                placeholder="Describe the cover image for screen readers"
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Title" required>
                                <input
                                    value={basics.title}
                                    onChange={(e) => setBasics((b) => ({ ...b, title: e.target.value }))}
                                    placeholder="e.g. Fintech Mobile App"
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Slug" required>
                                <input
                                    value={basics.slug}
                                    onChange={(e) => setBasics((b) => ({ ...b, slug: e.target.value }))}
                                    placeholder="e.g. fintech-mobile-app"
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                        <Field label="Summary" hint="One or two lines shown on the project card.">
                            <textarea
                                value={basics.summary}
                                onChange={(e) => setBasics((b) => ({ ...b, summary: e.target.value }))}
                                rows={2}
                                placeholder="e.g. Simplified signup so more users finish verification."
                                className={inputClass}
                            />
                        </Field>
                    </>
                )}

                {step === 1 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Role">
                                <input
                                    value={details.role}
                                    onChange={(e) => setDetails((d) => ({ ...d, role: e.target.value }))}
                                    placeholder="e.g. Lead UI/UX Designer"
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Client">
                                <input
                                    value={details.client}
                                    onChange={(e) => setDetails((d) => ({ ...d, client: e.target.value }))}
                                    placeholder="e.g. Acme Bank"
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Year">
                                <input
                                    type="number"
                                    value={details.year}
                                    onChange={(e) => setDetails((d) => ({ ...d, year: Number(e.target.value) }))}
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Duration">
                                <input
                                    value={details.duration}
                                    onChange={(e) => setDetails((d) => ({ ...d, duration: e.target.value }))}
                                    placeholder="e.g. 3 months"
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                        <Field label="Team (comma separated)">
                            <input
                                value={details.team}
                                onChange={(e) => setDetails((d) => ({ ...d, team: e.target.value }))}
                                placeholder="e.g. 2 engineers, 1 PM"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Tools (comma separated)">
                            <input
                                value={details.tools}
                                onChange={(e) => setDetails((d) => ({ ...d, tools: e.target.value }))}
                                placeholder="e.g. Figma, Framer, Maze"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Tags (comma separated)">
                            <input
                                value={details.tags}
                                onChange={(e) => setDetails((d) => ({ ...d, tags: e.target.value }))}
                                placeholder="e.g. UI/UX, Design System, Mobile"
                                className={inputClass}
                            />
                        </Field>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Field label="Introduction" hint="Sets the scene before the challenge.">
                            <textarea
                                value={narrative.introduction}
                                onChange={(e) => setNarrative((n) => ({ ...n, introduction: e.target.value }))}
                                rows={3}
                                placeholder="e.g. Acme Bank's onboarding flow had a 40% drop-off rate..."
                                className={inputClass}
                            />
                        </Field>
                        <Field label="The challenge" hint="What was broken or missing before you got involved.">
                            <textarea
                                value={narrative.challenge}
                                onChange={(e) => setNarrative((n) => ({ ...n, challenge: e.target.value }))}
                                rows={3}
                                placeholder="e.g. Users abandoned signup due to unclear verification steps..."
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Goals (comma separated)" hint="What success looked like going in.">
                            <input
                                value={narrative.goals}
                                onChange={(e) => setNarrative((n) => ({ ...n, goals: e.target.value }))}
                                placeholder="e.g. Reduce drop-off, Simplify KYC, Improve trust"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Solution" hint="Description of the final design direction.">
                            <textarea
                                value={narrative.solution}
                                onChange={(e) => setNarrative((n) => ({ ...n, solution: e.target.value }))}
                                rows={3}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Reflection" hint="What you'd do differently, or what you learned.">
                            <textarea
                                value={narrative.reflection}
                                onChange={(e) => setNarrative((n) => ({ ...n, reflection: e.target.value }))}
                                rows={3}
                                className={inputClass}
                            />
                        </Field>
                    </>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        {personas.length === 0 && (
                            <p className="text-xs text-zinc-400 text-center py-6">
                                No personas yet — add one if research shaped this project.
                            </p>
                        )}
                        {personas.map((p, i) => (
                            <div key={i} className="p-3.5 rounded-2xl border border-zinc-200/80 space-y-3">
                                <div className="flex gap-3">
                                    {p.image ? (
                                        <img src={p.image} alt={p.name || "Persona"} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                    ) : (
                                        <label className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center shrink-0 cursor-pointer hover:border-zinc-400">
                                            <Upload size={16} className="text-zinc-400" />
                                            <input type="file" accept="image/*" onChange={(e) => handlePersonaImageChange(i, e)} className="hidden" />
                                        </label>
                                    )}
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <input value={p.name} onChange={(e) => updatePersona(i, { name: e.target.value })} placeholder="Name, e.g. Sarah" className={inputClass} />
                                        <input value={p.role} onChange={(e) => updatePersona(i, { role: e.target.value })} placeholder="Role, e.g. Busy parent" className={inputClass} />
                                    </div>
                                    <button type="button" onClick={() => setPersonas((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Remove persona" className="self-start p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                                <textarea value={p.bio} onChange={(e) => updatePersona(i, { bio: e.target.value })} placeholder="Short bio" rows={2} className={inputClass} />
                                <div className="grid grid-cols-2 gap-2">
                                    <input value={p.goals.join(", ")} onChange={(e) => updatePersona(i, { goals: toList(e.target.value) })} placeholder="Goals (comma separated)" className={inputClass} />
                                    <input value={p.frustrations.join(", ")} onChange={(e) => updatePersona(i, { frustrations: toList(e.target.value) })} placeholder="Frustrations (comma separated)" className={inputClass} />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setPersonas((prev) => [...prev, { name: "", role: "", bio: "", goals: [], frustrations: [], image: "" }])}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900"
                        >
                            <Plus size={14} /> Add persona
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        {process.length === 0 && (
                            <p className="text-xs text-zinc-400 text-center py-6">
                                No process steps yet — break down your research, ideation, testing, etc.
                            </p>
                        )}
                        {process.map((p, i) => (
                            <div key={i} className="p-3.5 rounded-2xl border border-zinc-200/80 space-y-3">
                                <div className="flex gap-3">
                                    {p.image ? (
                                        <img src={p.image} alt={p.phase || "Process step"} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                    ) : (
                                        <label className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center shrink-0 cursor-pointer hover:border-zinc-400">
                                            <Upload size={16} className="text-zinc-400" />
                                            <input type="file" accept="image/*" onChange={(e) => handleProcessImageChange(i, e)} className="hidden" />
                                        </label>
                                    )}
                                    <input value={p.phase} onChange={(e) => updateProcessStep(i, { phase: e.target.value })} placeholder="Phase, e.g. Research" className={`${inputClass} flex-1`} />
                                    <button type="button" onClick={() => setProcess((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Remove step" className="self-start p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                                <textarea value={p.description} onChange={(e) => updateProcessStep(i, { description: e.target.value })} placeholder="What happened in this phase" rows={2} className={inputClass} />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setProcess((prev) => [...prev, { phase: "", description: "", image: "" }])}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900"
                        >
                            <Plus size={14} /> Add process step
                        </button>
                    </div>
                )}

                {step === 5 && (
                    <>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-zinc-700">Typography</p>
                            {typography.map((t, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input value={t.name} onChange={(e) => updateTypography(i, { name: e.target.value })} placeholder="Name, e.g. Heading" className={inputClass} />
                                    <input value={t.usage} onChange={(e) => updateTypography(i, { usage: e.target.value })} placeholder="Usage, e.g. H1–H3" className={inputClass} />
                                    <input value={t.sampleText} onChange={(e) => updateTypography(i, { sampleText: e.target.value })} placeholder="Sample text" className={inputClass} />
                                    <button type="button" onClick={() => setTypography((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Remove typography" className="shrink-0 p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => setTypography((prev) => [...prev, { name: "", usage: "", sampleText: "" }])} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900">
                                <Plus size={14} /> Add typography
                            </button>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-zinc-700">Color palette</p>
                            {colorPalette.map((c, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input type="color" value={c.hex || "#000000"} onChange={(e) => updateColor(i, { hex: e.target.value })} className="w-10 h-10 rounded-lg border border-zinc-200/80 shrink-0 cursor-pointer" />
                                    <input value={c.name} onChange={(e) => updateColor(i, { name: e.target.value })} placeholder="Name, e.g. Primary" className={inputClass} />
                                    <input value={c.hex} onChange={(e) => updateColor(i, { hex: e.target.value })} placeholder="#000000" className={inputClass} />
                                    <input value={c.usage} onChange={(e) => updateColor(i, { usage: e.target.value })} placeholder="Usage, e.g. Buttons" className={inputClass} />
                                    <button type="button" onClick={() => setColorPalette((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Remove color" className="shrink-0 p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => setColorPalette((prev) => [...prev, { name: "", hex: "", usage: "" }])} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900">
                                <Plus size={14} /> Add color
                            </button>
                        </div>

                        <Field label="Design system notes" hint="Any other system details worth mentioning.">
                            <textarea
                                value={designSystemNotes}
                                onChange={(e) => setDesignSystemNotes(e.target.value)}
                                rows={2}
                                className={inputClass}
                            />
                        </Field>
                    </>
                )}

                {step === 6 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="Live site">
                                <input value={links.live} onChange={(e) => setLinks((l) => ({ ...l, live: e.target.value }))} placeholder="https://" className={inputClass} />
                            </Field>
                            <Field label="Prototype">
                                <input value={links.prototype} onChange={(e) => setLinks((l) => ({ ...l, prototype: e.target.value }))} placeholder="https://" className={inputClass} />
                            </Field>
                            <Field label="Figma file">
                                <input value={links.figma} onChange={(e) => setLinks((l) => ({ ...l, figma: e.target.value }))} placeholder="https://" className={inputClass} />
                            </Field>
                        </div>

                        <p className="text-xs font-semibold text-zinc-700 pt-2">Outcomes</p>
                        <div className="space-y-2">
                            {outcomes.map((o, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input value={o.label} onChange={(e) => updateOutcome(i, { label: e.target.value })} placeholder="Label, e.g. Signups" className={inputClass} />
                                    <input value={o.value} onChange={(e) => updateOutcome(i, { value: e.target.value })} placeholder="Value, e.g. +25%" className={inputClass} />
                                    <button type="button" onClick={() => setOutcomes((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Remove outcome" className="shrink-0 p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => setOutcomes((prev) => [...prev, { label: "", value: "" }])} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900">
                                <Plus size={14} /> Add outcome
                            </button>
                        </div>
                    </>
                )}

                {step === 7 && (
                    <div className="space-y-3">
                        {gallery.map((g, i) => (
                            <div key={g.url} className="flex gap-3 p-2.5 rounded-2xl border border-zinc-200/80">
                                <img src={g.url} alt={g.alt || "Gallery preview"} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <input value={g.alt || ""} onChange={(e) => updateGallery(i, { alt: e.target.value })} placeholder="Alt text" className={inputClass} />
                                    <input value={g.caption || ""} onChange={(e) => updateGallery(i, { caption: e.target.value })} placeholder="Caption (optional)" className={inputClass} />
                                </div>
                                <button type="button" onClick={() => setGallery((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Remove image" className="self-start p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 cursor-pointer">
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                            Add gallery images
                            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} disabled={uploading} className="hidden" />
                        </label>
                    </div>
                )}

                {step === 8 && (
                    <>
                        <Field label="Order" hint="Lower numbers appear first.">
                            <input
                                type="number"
                                value={display.order}
                                onChange={(e) => setDisplay((d) => ({ ...d, order: Number(e.target.value) }))}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Meta description" hint="Shown in search results and link previews.">
                            <textarea
                                value={display.metaDescription}
                                onChange={(e) => setDisplay((d) => ({ ...d, metaDescription: e.target.value }))}
                                rows={2}
                                className={inputClass}
                            />
                        </Field>
                        <div className="flex flex-col gap-2.5 pt-1">
                            <label className="inline-flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={display.featured}
                                    onChange={(e) => setDisplay((d) => ({ ...d, featured: e.target.checked }))}
                                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                />
                                <span className="text-xs font-medium text-zinc-700">Feature this project on the homepage</span>
                            </label>
                            <label className="inline-flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={display.published}
                                    onChange={(e) => setDisplay((d) => ({ ...d, published: e.target.checked }))}
                                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                />
                                <span className="text-xs font-medium text-zinc-700">Publish immediately to live portfolio</span>
                            </label>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-100">
                <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-orange-600 hover:text-orange-500 disabled:opacity-0 disabled:pointer-events-none transition-all"
                >
                    <ChevronLeft size={14} /> Back
                </button>

                {isLastStep ? (
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-orange-500 disabled:opacity-50 active:scale-[0.98] transition-all"
                    >
                        {saving && <Loader2 size={14} className="animate-spin" />}
                        {saving ? "Saving..." : initial?._id ? "Update Project" : "Create Project"}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-orange-400 active:scale-[0.98] transition-all"
                    >
                        Next <ChevronRight size={14} />
                    </button>
                )}
            </div>
        </form>
    );
}