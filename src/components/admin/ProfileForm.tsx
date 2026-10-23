// src/components/admin/ProfileForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Plus, X, Check } from "lucide-react";

type Experience = {
    company: string;
    role: string;
    period: string;
    description: string;
};

type Profile = {
    name?: string;
    headline?: string;
    intro?: string;
    bio?: string;
    headshot?: string;
    headshotAlt?: string;
    location?: string;
    email?: string;
    resumeUrl?: string;
    availability?: { open?: boolean; note?: string };
    skills?: string[];
    socials?: Record<string, string | undefined>;
    experience?: Experience[];
    metaDescription?: string;
};

const SOCIALS = ["linkedin", "dribbble", "behance", "x", "github", "instagram"];

const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-sm";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {title}
            </h2>
            {children}
        </section>
    );
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700">{label}</label>
            {children}
            {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
        </div>
    );
}

async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Image upload failed");
    }
    return (await res.json()).url;
}

export default function ProfileForm({ initial }: { initial: Profile | null }) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const [basics, setBasics] = useState({
        name: initial?.name || "",
        headline: initial?.headline || "",
        intro: initial?.intro || "",
        bio: initial?.bio || "",
        location: initial?.location || "",
        email: initial?.email || "",
        resumeUrl: initial?.resumeUrl || "",
        headshotAlt: initial?.headshotAlt || "",
        metaDescription: initial?.metaDescription || "",
    });
    const [headshot, setHeadshot] = useState(initial?.headshot || "");
    const [availability, setAvailability] = useState({
        open: initial?.availability?.open || false,
        note: initial?.availability?.note || "",
    });
    const [skills, setSkills] = useState(initial?.skills?.join(", ") || "");
    const [socials, setSocials] = useState<Record<string, string>>(
        Object.fromEntries(SOCIALS.map((s) => [s, initial?.socials?.[s] || ""]))
    );
    const [experience, setExperience] = useState<Experience[]>(
        initial?.experience?.map((e) => ({
            company: e.company || "",
            role: e.role || "",
            period: e.period || "",
            description: e.description || "",
        })) || []
    );

    function updateExperience(i: number, patch: Partial<Experience>) {
        setExperience((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
    }

    async function handleHeadshot(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            setHeadshot(await uploadImage(file));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        setError("");

        const body = {
            ...basics,
            headshot,
            availability,
            skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
            socials,
            experience: experience.filter((x) => x.company.trim() || x.role.trim()),
        };

        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        setSaving(false);

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Something went wrong");
            return;
        }

        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2500);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-full">
            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600">
                    {error}
                </div>
            )}

            <Card title="Identity">
                <div className="flex items-center gap-4">
                    <label className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center cursor-pointer hover:border-orange-400 transition-colors shrink-0 shadow-sm">
                        {headshot ? (
                            <img src={headshot} alt="Headshot" className="w-full h-full object-cover" />
                        ) : uploading ? (
                            <Loader2 size={18} className="animate-spin text-orange-600" />
                        ) : (
                            <Upload size={18} className="text-zinc-400" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeadshot}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                    <div className="flex-1">
                        <Field label="Headshot alt text">
                            <input
                                value={basics.headshotAlt}
                                onChange={(e) => setBasics((b) => ({ ...b, headshotAlt: e.target.value }))}
                                placeholder="Describe the photo for screen readers"
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name">
                        <input
                            value={basics.name}
                            onChange={(e) => setBasics((b) => ({ ...b, name: e.target.value }))}
                            placeholder="Benjamin Chidera"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Headline">
                        <input
                            value={basics.headline}
                            onChange={(e) => setBasics((b) => ({ ...b, headline: e.target.value }))}
                            placeholder="Product Designer"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Location">
                        <input
                            value={basics.location}
                            onChange={(e) => setBasics((b) => ({ ...b, location: e.target.value }))}
                            placeholder="Lagos, Nigeria"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Public email">
                        <input
                            type="email"
                            value={basics.email}
                            onChange={(e) => setBasics((b) => ({ ...b, email: e.target.value }))}
                            placeholder="hello@example.com"
                            className={inputClass}
                        />
                    </Field>
                </div>
            </Card>

            <Card title="About">
                <Field label="Hero intro" hint="One or two lines shown under your name on the homepage.">
                    <textarea
                        value={basics.intro}
                        onChange={(e) => setBasics((b) => ({ ...b, intro: e.target.value }))}
                        rows={2}
                        className={inputClass}
                    />
                </Field>
                <Field label="Bio" hint="Separate paragraphs with a blank line.">
                    <textarea
                        value={basics.bio}
                        onChange={(e) => setBasics((b) => ({ ...b, bio: e.target.value }))}
                        rows={8}
                        className={inputClass}
                    />
                </Field>
                <Field label="Skills (comma separated)">
                    <input
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="UX research, Prototyping, Design systems"
                        className={inputClass}
                    />
                </Field>
            </Card>

            <Card title="Availability and resume">
                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={availability.open}
                        onChange={(e) => setAvailability((a) => ({ ...a, open: e.target.checked }))}
                        className="w-4 h-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-xs font-medium text-zinc-700">
                        Show "available for work" on the site
                    </span>
                </label>
                <Field label="Availability note">
                    <input
                        value={availability.note}
                        onChange={(e) => setAvailability((a) => ({ ...a, note: e.target.value }))}
                        placeholder="Open to freelance from November"
                        className={inputClass}
                    />
                </Field>
                <Field label="Resume URL" hint="Link to a PDF (Drive, Dropbox, or an uploaded file).">
                    <input
                        value={basics.resumeUrl}
                        onChange={(e) => setBasics((b) => ({ ...b, resumeUrl: e.target.value }))}
                        placeholder="https://"
                        className={inputClass}
                    />
                </Field>
            </Card>

            <Card title="Social links">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SOCIALS.map((s) => (
                        <Field key={s} label={s === "x" ? "X / Twitter" : s[0].toUpperCase() + s.slice(1)}>
                            <input
                                value={socials[s]}
                                onChange={(e) => setSocials((prev) => ({ ...prev, [s]: e.target.value }))}
                                placeholder="https://"
                                className={inputClass}
                            />
                        </Field>
                    ))}
                </div>
            </Card>

            <Card title="Experience">
                <div className="space-y-3">
                    {experience.map((x, i) => (
                        <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input
                                    value={x.company}
                                    onChange={(e) => updateExperience(i, { company: e.target.value })}
                                    placeholder="Company"
                                    className={inputClass}
                                />
                                <input
                                    value={x.role}
                                    onChange={(e) => updateExperience(i, { role: e.target.value })}
                                    placeholder="Role"
                                    className={inputClass}
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        value={x.period}
                                        onChange={(e) => updateExperience(i, { period: e.target.value })}
                                        placeholder="2022 – Now"
                                        className={inputClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setExperience((prev) => prev.filter((_, idx) => idx !== i))}
                                        aria-label="Remove"
                                        className="shrink-0 p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={x.description}
                                onChange={(e) => updateExperience(i, { description: e.target.value })}
                                placeholder="What you did there"
                                rows={2}
                                className={inputClass}
                            />
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() =>
                        setExperience((prev) => [
                            ...prev,
                            { company: "", role: "", period: "", description: "" },
                        ])
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-500 mt-2"
                >
                    <Plus size={14} /> Add experience
                </button>
            </Card>

            <Card title="SEO">
                <Field label="Meta description" hint="Used for search results and link previews on the About page.">
                    <textarea
                        value={basics.metaDescription}
                        onChange={(e) => setBasics((b) => ({ ...b, metaDescription: e.target.value }))}
                        rows={2}
                        className={inputClass}
                    />
                </Field>
            </Card>

            <div className="flex items-center justify-end gap-3 pt-2">
                {saved && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <Check size={14} /> Saved successfully
                    </span>
                )}
                <button
                    type="submit"
                    disabled={saving || uploading}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50 active:scale-[0.98] transition-all shadow-sm"
                >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {saving ? "Saving..." : "Save profile"}
                </button>
            </div>
        </form>
    );
}