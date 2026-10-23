export async function getProjects() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/projects`, {cache: "no-store"})

    if (!res.ok) {
        throw new Error("Failed to fetch projects")
    }
    return res.json();
}