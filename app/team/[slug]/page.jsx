"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Header from "@/components/banner/Header";
import { useGetPublishedTeamQuery } from "@/redux/features/cms/teamApi";
import { slugify } from "@/lib/slug";
import { pageSurface } from "@/lib/surfaces";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";

export default function TeamProfilePage() {
  const { slug } = useParams();
  const { data: members = [], isLoading, isError, refetch } = useGetPublishedTeamQuery();
  const member = members.find((item) => slugify(item.name) === slug);

  return (
    <main>
      <Header />
      <section className={`section ${pageSurface(0)} pt-28 sm:pt-32`}>
        <SectionShell>
          <Link href="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-ink hover:text-accent">
            <ArrowLeft size={16} />
            Back to team
          </Link>

          {isLoading && (
            <p className="mt-16 flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
              <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
              Loading profile…
            </p>
          )}

          {isError && (
            <div className="card mx-auto mt-16 max-w-lg p-8 text-center">
              <p className="font-semibold text-ink-900">Could not load this profile.</p>
              <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && !member && (
            <div className="card mx-auto mt-16 max-w-lg p-8 text-center">
              <p className="font-semibold text-ink-900">This profile is not available.</p>
              <Link href="/team" className="btn btn-ghost btn-sm mt-4">
                View the team
              </Link>
            </div>
          )}

          {member && (
            <article className="mx-auto mt-10 max-w-3xl">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-36 w-36 overflow-hidden rounded-full bg-pale ring-2 ring-cyan/30">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      quality={95}
                    />
                  ) : null}
                </div>
                {member.department?.name ? (
                  <p className="eyebrow mt-6">{member.department.name}</p>
                ) : null}
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                  {member.name}
                </h1>
                <p className="mt-2 text-lg font-semibold text-cyan-ink">{member.role}</p>
              </div>

              {member.bio ? (
                <p className="mt-8 text-center text-base leading-relaxed text-ink-500">
                  {member.bio}
                </p>
              ) : null}

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="card p-4 text-center">
                  <CardWatermark topic="experience growth" tone="navy" size="sm" />
                  <p className="text-2xl font-extrabold text-ink-900">{member.experience}+</p>
                  <p className="mt-1 text-xs font-semibold text-ink-500">Years Exp.</p>
                </div>
                <div className="card p-4 text-center">
                  <CardWatermark topic="projects workflow" tone="cyan" size="sm" />
                  <p className="text-2xl font-extrabold text-ink-900">{member.projects}+</p>
                  <p className="mt-1 text-xs font-semibold text-ink-500">Projects</p>
                </div>
                <div className="card p-4 text-center">
                  <CardWatermark topic={member.expertise?.join(" ") || "expertise"} tone="navy" size="sm" />
                  <p className="text-2xl font-extrabold text-ink-900">
                    {member.expertise?.length || 0}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-ink-500">Expertise</p>
                </div>
              </div>

              {member.expertise?.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-ink-900">Expertise</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="chip"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.department && (
                <div className="card mt-8 p-6">
                  <CardWatermark topic={member.department} tone="cyan" size="md" />
                  <h2 className="relative text-lg font-bold text-ink-900">Department Role</h2>
                  {member.department.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">
                      {member.department.description}
                    </p>
                  ) : null}
                  {member.department.roles?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
                        Key Responsibilities
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {member.department.roles.map((role) => (
                          <li
                            key={role}
                            className="rounded-lg bg-pale px-2.5 py-1 text-xs font-medium text-ink-700"
                          >
                            {role}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {member.department.productions?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
                        Notable Contributions
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {member.department.productions.map((item) => (
                          <li
                            key={item}
                            className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-cyan-ink"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {member.email ? (
                <div className="mt-8 flex justify-center">
                  <a href={`mailto:${member.email}`} className="btn btn-primary">
                    <Mail size={16} />
                    Get in Touch
                  </a>
                </div>
              ) : null}
            </article>
          )}
        </SectionShell>
      </section>
    </main>
  );
}
