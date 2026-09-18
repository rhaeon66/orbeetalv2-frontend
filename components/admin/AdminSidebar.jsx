"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { ADMIN_NAV_GROUPS, isAdminNavActive } from "./nav";
import BrandLogo from "@/components/brand/BrandLogo";

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-sage/80 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary-deep text-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-3 border-b border-white/10 px-5">
          <Link href="/admin" className="flex min-w-0 items-center" onClick={onClose}>
            <BrandLogo
              onDark
              alt="Orbeetal CMS"
              width={132}
              height={36}
              className="h-7 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]" aria-label="Admin">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.label || "dashboard"} className="mb-3">
              {group.label ? (
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
                  {group.label}
                </p>
              ) : null}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isAdminNavActive(pathname, item);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon
                          size={17}
                          className={active ? "text-accent" : "text-white/50"}
                          aria-hidden
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
