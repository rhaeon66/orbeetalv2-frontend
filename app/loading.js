import Header from "@/components/banner/Header";
import SectionTransition from "@/components/ui/SectionTransition";
import { pageSurface, pageSurfaceToken } from "@/lib/surfaces";
import SectionShell from "@/components/layouts/SectionShell";

export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite">
      <Header />
      <section className={`${pageSurface(0)} relative overflow-hidden text-ink-900`}>
        <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-30" />
        <SectionShell className="relative pb-16 pt-32 text-center sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
          <span className="sr-only">Loading</span>
          <div className="mx-auto h-8 w-28 rounded-full bg-ink-400/20" />
          <div className="mx-auto mt-6 h-12 w-full max-w-xl rounded-xl bg-ink-400/20" />
          <div className="mx-auto mt-4 h-4 w-full max-w-md rounded bg-ink-400/15" />
          <div className="mx-auto mt-3 h-4 w-2/3 max-w-sm rounded bg-ink-400/15" />
        </SectionShell>
        <SectionTransition fill={pageSurfaceToken(1)} />
      </section>
      <section className={`section ${pageSurface(1)}`}>
        <SectionShell className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card h-40 bg-surface-muted" />
          <div className="card h-40 bg-surface-muted" />
          <div className="card h-40 bg-surface-muted" />
        </SectionShell>
      </section>
    </main>
  );
}
