"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ChevronRight, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { apiSlice } from "@/redux/api/apiSlice";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function AdminTopBar({ title, crumbs, user, onOpenSidebar }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch {
      /* still leave the panel */
    }
    dispatch(apiSlice.util.resetApiState());
    router.replace("/admin/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-lg p-2 text-ink-700 hover:bg-surface-muted lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex items-center gap-1 text-xs font-semibold text-ink-400">
              {crumbs.map((crumb, index) => {
                const last = index === crumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                    {index > 0 && (
                      <ChevronRight size={12} className="text-ink-400/70" aria-hidden />
                    )}
                    {crumb.href && !last ? (
                      <Link href={crumb.href} className="hover:text-primary">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={last ? "text-ink-600" : undefined}>{crumb.label}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <h1 className="truncate text-base font-extrabold tracking-tight text-ink-900 sm:text-lg">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="h-10 w-10" />
          <p className="hidden max-w-[10rem] truncate text-sm font-semibold text-ink-600 sm:block">
            {user?.username || "Admin"}
          </p>
          <Link
            href="/"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 hover:text-primary sm:inline"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            aria-label="Sign out"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-cream px-3 py-2 text-sm font-semibold text-ink-700 hover:border-primary/30 hover:text-primary disabled:opacity-60"
          >
            <LogOut size={15} aria-hidden />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
