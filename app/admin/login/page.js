import { Suspense } from "react";
import AdminLoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in — Admin — Orbeetal",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-primary-deep text-sm font-semibold text-white/70">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
