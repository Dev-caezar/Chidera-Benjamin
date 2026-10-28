import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/admin",
      });
    } catch (err) {
      if (err instanceof AuthError) redirect("/admin/login?error=1");
      throw err; // lets the successful-login redirect through
    }
  }

  return (
    <main className="h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white overflow-hidden">
      {/* Left Side: Designer Image & Visual Overlay */}
      <div className="hidden lg:relative lg:flex flex-col justify-between p-12 text-white overflow-hidden bg-[#0B0301]">
        {/* Background Designer Image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            alt="UI Designer working"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-105"
            src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1200"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0B0301] via-[#0B0301]/80 to-[#0B0301]/40" />
        </div>

        <div className="relative z-10">
          <Link className="text-xs font-semibold tracking-wider uppercase text-zinc-400 hover:text-[#F44A00] transition-colors" href="/">
            ← Back to Portfolio
          </Link>
        </div>

        <div className="relative z-10 max-w-md my-auto">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wide uppercase bg-[#160602] text-[#F44A00] rounded-full border border-[#F44A00]/30">
            Admin Portal
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-white">
            Manage your craft.
          </h2>
          <p className="text-zinc-400 text-sm lg:text-base leading-relaxed">
            Update your case studies, publish new projects, and manage your portfolio content effortlessly.
          </p>
        </div>

        <div className="relative z-10 text-xs text-zinc-500">
          Benjamin Chidera • Product Designer
        </div>
      </div>

      {/* Right Side: Login Form Panel (Maintained White Background) */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-20 bg-white h-full overflow-y-auto">
        {/* Mobile back link */}
        <div className="lg:hidden">
          <Link className="text-xs font-semibold tracking-wider text-zinc-400 uppercase hover:text-[#F44A00] transition-colors" href="/">
            ← Back to Portfolio
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto my-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Please enter your credentials to sign in.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3">
              <svg
                className="w-4 h-4 text-red-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-xs font-medium text-red-700">
                Invalid email or password. Please try again.
              </p>
            </div>
          )}

          <form action={login} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#F44A00] focus:ring-1 focus:ring-[#F44A00] focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#F44A00] focus:ring-1 focus:ring-[#F44A00] focus:bg-white transition-all duration-200"
              />
            </div>

            <button className="w-full mt-2 rounded-xl bg-[#F44A00] py-3.5 text-sm font-medium text-white shadow-sm hover:bg-orange-600 active:scale-[0.99] transition-all duration-200 cursor-pointer">
              Sign in to dashboard
            </button>
          </form>
        </div>

        <div className="hidden lg:block text-xs text-transparent select-none">
          Spacer
        </div>
      </div>
    </main>
  );
}