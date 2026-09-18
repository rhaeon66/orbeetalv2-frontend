import Header from "@/components/banner/Header";
import PageHero from "@/components/layouts/PageHero";
import { LEGAL_PAGES } from "@/content/legal";
import { pageSurface, pageSurfaceToken } from "@/lib/surfaces";
import SectionShell from "@/components/layouts/SectionShell";

export default function LegalDocument({ pageKey }) {
  const page = LEGAL_PAGES[pageKey];
  if (!page) return null;

  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Legal"
        title={page.title}
        subtitle={`Last updated: ${page.updated}`}
        crumb={page.title}
        surface={pageSurface(0)}
        waveFill={pageSurfaceToken(1)}
      />
      <section className={`section ${pageSurface(1)}`}>
        <SectionShell className="grid gap-10 lg:grid-cols-[16rem_1fr]">
          <nav className="card h-fit p-5 lg:sticky lg:top-28" aria-label="Table of contents">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
              Table of Contents
            </p>
            <ol className="mt-4 space-y-2 text-sm font-semibold">
              {page.sections.map((section, index) => (
                <li key={section.heading}>
                  <a href={`#section-${index + 1}`} className="text-ink-700 hover:text-cyan-ink">
                    {index + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="space-y-10">
            {page.sections.map((section, index) => (
              <article key={section.heading} id={`section-${index + 1}`} className="scroll-mt-28">
                <h2 className="text-xl font-extrabold text-ink-900">
                  {index + 1}. {section.heading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink-500">{section.body}</p>
              </article>
            ))}
          </div>
        </SectionShell>
      </section>
    </main>
  );
}
