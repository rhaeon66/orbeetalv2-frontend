"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useGetMeQuery, useLoginMutation } from "@/redux/features/auth/authApi";
import { safeAdminNext } from "@/components/admin/nav";
import BrandLogo from "@/components/brand/BrandLogo";

function loginMessage(error) {
  if (!error) return "Unable to sign in.";
  if (error.status === "FETCH_ERROR") {
    return "Could not reach the API. Confirm the backend is running.";
  }
  if (typeof error.data?.detail === "string") return error.data.detail;
  return "Unable to sign in.";
}

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeAdminNext(searchParams.get("next"));
  const { data, isSuccess } = useGetMeQuery();
  const [login, { isLoading, error, isError }] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isSuccess && data?.user) {
      router.replace(nextPath);
    }
  }, [data, isSuccess, nextPath, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await login({ username: username.trim(), password }).unwrap();
      router.replace(nextPath);
    } catch {
      /* error banner */
    }
  }

  const field = "form-field";

  return (
    <div className="brand-surface relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo
            width={160}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>

        <div className="rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-lg)] sm:p-8">
          <p className="eyebrow mb-3">Orbeetal CMS</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            Sign in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Staff access only. Sign in to manage website content.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">
                Username
              </span>
              <input
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={field}
                required
                disabled={isLoading}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">
                Password
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={field}
                required
                disabled={isLoading}
              />
            </label>

            {isError && (
              <p
                className="alert-error"
                role="alert"
              >
                {loginMessage(error)}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-teal w-full rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                <>
                  <Lock size={16} aria-hidden />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-500">
          <Link href="/" className="font-semibold text-ink-900 hover:text-accent">
            Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
