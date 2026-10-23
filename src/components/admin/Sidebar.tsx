// src/components/admin/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Plus, ExternalLink, Bell, UserRound } from "lucide-react";
import SignOutButton from "./SignOutButton";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "New project", href: "/admin/projects/new", icon: Plus },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Profile", href: "/admin/profile", icon: UserRound },
];

export default function Sidebar({
  mobile,
  onNavigate,
  unreadCount = 0, // Add unreadCount prop
}: {
  mobile?: boolean;
  onNavigate?: () => void;
  unreadCount?: number;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={
        mobile
          ? "fixed inset-y-0 left-0 z-50 w-[75%] max-w-xs bg-orange-600 flex flex-col shadow-2xl font-poppins"
          : "flex flex-col w-64 shrink-0 h-screen top-0 bg-orange-600 fixed inset-y-0 left-0 shadow-sm font-poppins"
      }
    >
      <div className="px-6 py-6 border-b border-orange-500/40">
        <p className="font-heading font-semibold text-white tracking-tight text-sm">
          Benjamin Chidera
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white mt-1">
          Admin panel
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          const isNotifications = item.href === "/admin/notifications";

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${active
                  ? "bg-orange-400 text-white shadow-sm"
                  : "text-orange-100 hover:bg-orange-400/10 hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} strokeWidth={2.2} />
                <span>{item.label}</span>
              </div>

              {/* Notification Badge */}
              {isNotifications && unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white text-orange-600 shadow-sm">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 space-y-1 border-t border-orange-500/40 bg-orange-700/20">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-orange-100 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ExternalLink size={16} strokeWidth={2.2} />
          View site
        </Link>
        <div className="px-3 py-2">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}