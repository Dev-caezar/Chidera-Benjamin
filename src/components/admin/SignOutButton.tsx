"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-sm text-zinc-600 hover:text-zinc-900"
        >
            Sign out
        </button>
    )
}