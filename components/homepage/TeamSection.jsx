"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseCarousel from "@/components/ui/ShowcaseCarousel";
import { useGetPublishedTeamQuery } from "@/redux/features/cms/teamApi";
import { teamPath } from "@/lib/slug";
import SectionShell from "@/components/layouts/SectionShell";

export default function TeamSection({ showHeading = true, surface = "bg-cream" }) {
  const { data: teamMembers = [], isLoading, isError, refetch } =
    useGetPublishedTeamQuery();

  return (
    <section className={`section showcase-section ${surface}`}>
      <SectionShell>
        {showHeading ? (
          <SectionHeading
            eyebrow="Leadership"
            title={
              <>
                Meet the <span className="text-gradient">Directors</span>
              </>
            }
            subtitle="The people behind Orbeetal — a multidisciplinary leadership team driving every project with expertise and care."
          />
        ) : null}

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading team…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load team members.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && teamMembers.length === 0 && (
          <p className="section-stack text-center text-sm font-semibold text-ink-500">
            Team profiles will appear here once they are published.
          </p>
        )}

        {teamMembers.length > 0 && (
          <ShowcaseCarousel
            className={showHeading ? "section-stack" : ""}
            items={teamMembers}
            getKey={(item) => item.id}
            label="directors"
            size="compact"
            renderItem={(member) => (
              <article className="showcase-carousel-card items-center px-4 pb-6 pt-2 text-center">
                <div className="showcase-media showcase-media--avatar">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover object-top"
                      quality={90}
                    />
                  ) : null}
                </div>
                <h3 className="mt-1 w-full truncate text-sm font-semibold">
                  {member.name}
                </h3>
                <p className="mt-0.5 line-clamp-2 min-h-[2rem] text-xs">
                  {member.role}
                </p>
                <Link
                  href={teamPath(member)}
                  className="btn btn-ghost btn-sm mt-3 !min-h-8 !px-2.5 !py-1.5 !text-[11px]"
                >
                  View Profile
                </Link>
              </article>
            )}
          />
        )}
      </SectionShell>
    </section>
  );
}
