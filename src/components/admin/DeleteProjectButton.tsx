"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectButton({ id }: { id: string }) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false)


    async function handleDelete() {
        const confirmed = window.confirm("Delete this project? This can't be undone.");
        if (!confirmed) return;
        setDeleting(true);
        const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        setDeleting(false);
        if (!res.ok) {
            alert("Failed to delete porject");
            return;
        }

        router.refresh()
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
        >
            {deleting ? "Deleting..." : "Delete"}
        </button>
    )
}