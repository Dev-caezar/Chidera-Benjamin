// src/app/admin/(dashboard)/profile/page.tsx
import ProfileForm from "@/components/admin/ProfileForm";
import { getProfile } from "@/lib/profile";

export default async function ProfilePage() {
    const profile = await getProfile();

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-heading text-2xl font-semibold text-white">
                    Profile
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Powers your About page, Hero, and footer links.
                </p>
            </div>
            <ProfileForm initial={profile} />
        </div>
    );
}