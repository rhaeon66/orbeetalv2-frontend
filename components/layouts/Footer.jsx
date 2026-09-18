"use client";

import Link from "next/link";
import { FaLinkedin, FaFacebook } from "react-icons/fa";
import { FiPhone, FiMail, FiArrowUpRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import BasisBadge from "./BasisBadge";
import BrandLogo from "@/components/brand/BrandLogo";
import { FOOTER_NAV, LEGAL_NAV, SITE } from "@/lib/site";
import SectionShell from "@/components/layouts/SectionShell";

const socialLinks = [
  { icon: <FaLinkedin size={20} />, href: SITE.linkedin, label: "Orbeetal on LinkedIn" },
  { icon: <FaFacebook size={20} />, href: SITE.facebook, label: "Orbeetal on Facebook" },
];

export default function Footer() {
  return (
    <footer className="charcoal-surface relative overflow-hidden text-white/70">
      <div className="dot-grid-light pointer-events-none absolute inset-0 opacity-20" />

      <SectionShell className="relative z-10 pt-16 md:pt-20">
        <div className="grid grid-cols-1 items-start gap-10 py-10 500:grid-cols-2 lg:grid-cols-4">
          <div className="text-left">
            <BrandLogo
              onDark
              width={160}
              height={60}
              className="mb-6"
            />
            <p className="text-base leading-relaxed text-white/55">
              Bold, forward-thinking digital transformation. We engineer precision
              software and design immersive experiences that elevate businesses
              above the competition.
            </p>

            <div className="mt-6 flex space-x-3">
              {socialLinks.map(({ icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/15 transition-all duration-300 hover:bg-accent hover:text-[var(--on-cta)] hover:ring-accent"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-left">
            <h5 className="mb-5 text-lg font-bold text-white">Navigation</h5>
            <ul className="space-y-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-left">
            <h5 className="mb-5 text-lg font-bold text-white">Legal</h5>
            <ul className="space-y-3">
              {LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/faq" className="transition hover:text-accent">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h5 className="mb-5 text-lg font-bold text-white">Contact</h5>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-accent" />
                <a href={`tel:${SITE.phoneTel}`} className="transition hover:text-accent">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FaWhatsapp className="text-accent" />
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-accent"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-accent" />
                <a href={`mailto:${SITE.email}`} className="transition hover:text-accent">
                  {SITE.email}
                </a>
              </li>
            </ul>
            <Link href="/contact" className="btn btn-primary btn-sm mt-6">
              Start a Project
              <FiArrowUpRight size={16} className="btn-icon" />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 py-8">
          <BasisBadge />
        </div>
      </SectionShell>

      <div className="relative z-10 border-t border-white/10">
        <SectionShell className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-6 text-center text-sm text-white/50">
          <span>© {new Date().getFullYear()} Orbeetal. All rights reserved.</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            All systems nominal
          </span>
        </SectionShell>
      </div>
    </footer>
  );
}
