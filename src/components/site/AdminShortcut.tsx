"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminShortcut() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Trigger on Ctrl + Shift + A (or Cmd + Shift + A)
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "a") {
                e.preventDefault();
                router.push("/admin");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    return null; // Invisible component placed in your Root Layout
}