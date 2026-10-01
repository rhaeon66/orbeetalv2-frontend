"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, Mail, ArrowLeft, Phone, MapPin, Globe, Linkedin, Github, Facebook, Instagram, Twitter, Youtube, Dribbble, PenTool, ExternalLink } from "lucide-react";
import Header from "@/components/banner/Header";
import { useGetPublishedTeamQuery } from "@/redux/features/cms/teamApi";
import { slugify } from "@/lib/slug";
import { pageSurface } from "@/lib/surfaces";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";

const SOCIALS = [
  ["website", "Website", Globe],
  ["linkedin", "LinkedIn", Linkedin],
  ["github", "GitHub", Github],
  ["facebook", "Facebook", Facebook],
  ["instagram", "Instagram", Instagram],
  ["x_url", "X", Twitter],
  ["youtube", "YouTube", Youtube],
  ["behance", "Behance", PenTool],
  ["dribbble", "Dribbble", Dribbble],
];

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
            <article className="mx-auto mt-10 max-w-4xl">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-36 w-36 overflow-hidden rounded-full bg-pale ring-2 ring-cyan/30">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="144px"
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

              {(member.phone || member.location || SOCIALS.some(([key]) => member[key])) && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  {(member.phone || member.location) && (
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-ink-700">
                      {member.phone ? (
                        <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 hover:text-cyan-ink">
                          <Phone size={16} aria-hidden />
                          {member.phone}
                        </a>
                      ) : null}
                      {member.location ? (
                        <span className="inline-flex items-center gap-2">
                          <MapPin size={16} aria-hidden />
                          {member.location}
                        </span>
                      ) : null}
                    </div>
                  )}
                  {SOCIALS.some(([key]) => member[key]) && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {SOCIALS.filter(([key]) => member[key]).map(([key, label, Icon]) => (
                        <a
                          key={key}
                          href={member[key]}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={label}
                          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-ink-800 transition-colors hover:border-cyan/50 hover:text-cyan-ink"
                        >
                          <Icon size={15} aria-hidden />
                          {label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

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

              {member.portfolio?.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-lg font-bold text-ink-900">Portfolio</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {member.portfolio.map((item) => (
                      <li key={`${item.title}-${item.year}`} className="card p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-ink-900">{item.title}</h3>
                          {item.year ? (
                            <span className="shrink-0 text-xs font-semibold text-ink-500">{item.year}</span>
                          ) : null}
                        </div>
                        {item.description ? (
                          <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.description}</p>
                        ) : null}
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-ink hover:text-accent"
                          >
                            View project
                            <ExternalLink size={14} aria-hidden />
                          </a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {member.details?.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-lg font-bold text-ink-900">More information</h2>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                    {member.details.map((item) => (
                      <div key={item.label} className="card px-4 py-3">
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">
                          {item.label}
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-ink-900">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
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
