"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import AdminFeedback from "./AdminFeedback";
import { getAdminPageMeta } from "./nav";

export default function AdminShell({ user, children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const meta = getAdminPageMeta(pathname);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  return (
    <div className="admin-app min-h-screen bg-surface-muted">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="min-w-0 lg:pl-64">
        <AdminTopBar
          title={meta.title}
          crumbs={meta.crumbs}
          user={user}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <AdminFeedback />
        <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
