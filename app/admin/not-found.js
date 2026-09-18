import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-lg">
      <div className="card p-8">
        <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
          Page not found
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          This admin section does not exist.
        </p>
        <Link href="/admin" className="btn btn-ghost btn-sm mt-6">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
