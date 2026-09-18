"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEnsureCsrfQuery, useGetMeQuery } from "@/redux/features/auth/authApi";
import AdminShell from "./AdminShell";

function AdminSplash({ label = "Loading admin…" }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted">
      <p className="text-sm font-semibold text-ink-500">{label}</p>
    </div>
  );
}

function AdminForbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <p className="eyebrow mb-3">Admin</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
          Access denied
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          This account does not have permission to manage website content.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/admin/login" className="btn btn-teal btn-sm">
            Sign in with another account
          </Link>
          <Link href="/" className="btn btn-ghost btn-sm">
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
          Could not reach the admin API
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Check that the Django server is running, then try again.
        </p>
        <Link href="/" className="btn btn-ghost btn-sm mt-6">
          Back to website
        </Link>
      </div>
    </div>
  );
}

function AdminAuthGate({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const { data, error, isLoading } = useGetMeQuery();

  useEffect(() => {
    setReady(true);
  }, []);

  const unauthenticated =
    error?.status === 401 ||
    (error?.status === 403 &&
      error?.data?.detail === "Authentication credentials were not provided.");
  const forbidden = error?.status === 403 && !unauthenticated;

  useEffect(() => {
    if (unauthenticated) {
      const next = encodeURIComponent(pathname || "/admin");
      router.replace(`/admin/login?next=${next}`);
    }
  }, [unauthenticated, pathname, router]);

  if (!ready || isLoading) return <AdminSplash />;
  if (unauthenticated) return <AdminSplash label="Redirecting to sign in…" />;
  if (forbidden) return <AdminForbidden />;
  if (error) return <AdminError />;
  if (!data?.user) return <AdminSplash />;

  return <AdminShell user={data.user}>{children}</AdminShell>;
}

export default function AdminRoot({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEnsureCsrfQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === "/admin/login") {
    return children;
  }
  if (!mounted) {
    return <AdminSplash />;
  }

  return <AdminAuthGate>{children}</AdminAuthGate>;
}
