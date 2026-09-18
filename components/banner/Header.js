"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV } from "@/lib/site";
import BrandLogo from "@/components/brand/BrandLogo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import SectionShell from "@/components/layouts/SectionShell";

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const DESKTOP_NAV = "(min-width: 1024px)";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_NAV);
    const closeOnDesktop = () => {
      if (media.matches) setIsOpen(false);
    };
    closeOnDesktop();
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const desktopLinkClass = (active) =>
    active ? "text-cyan-ink" : "text-ink-900/75 hover:text-cyan-ink";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-sage/95 backdrop-blur-md">
      <SectionShell>
        <div className="flex h-[72px] items-center justify-between gap-4 lg:h-[76px] lg:gap-6">
          <Link
            href="/"
            className="relative z-10 flex min-h-11 shrink-0 items-center"
            onClick={() => setIsOpen(false)}
          >
            <BrandLogo
              priority
              className="h-8 w-auto object-contain sm:h-9"
            />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Primary">
            {PRIMARY_NAV.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3 py-2 text-[13.5px] font-semibold tracking-tight transition-colors duration-200 xl:px-3.5 xl:text-sm ${desktopLinkClass(active)}`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent transition-all duration-200 ${
                      active ? "w-5 opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <ThemeToggle />
            <Link href="/contact" className="btn btn-primary btn-sm">
              Get Started
              <ArrowRight size={15} className="btn-icon" />
            </Link>
          </div>

          <div className="relative z-10 lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="icon-btn"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </SectionShell>

      {isOpen && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 top-[72px] z-40 bg-sage/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav"
            className="relative z-50 max-h-[calc(100vh-72px)] overflow-y-auto border-t border-line bg-sage pb-8 pt-3 shadow-lg lg:hidden animate-slideDown"
          >
            <SectionShell>
            <nav className="flex flex-col" aria-label="Mobile">
              {PRIMARY_NAV.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-12 items-center rounded-xl px-4 text-base font-semibold transition-colors ${
                      active
                        ? "bg-cyan/10 text-cyan-ink"
                        : "text-ink-500 hover:bg-surface-muted hover:text-ink-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          active ? "bg-accent" : "bg-transparent"
                        }`}
                      />
                      {link.label}
                    </span>
                  </Link>
                );
              })}
              <div className="mt-4 flex items-center gap-3">
                <ThemeToggle />
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary flex-1"
                >
                  Get Started
                  <ArrowRight size={18} className="btn-icon" />
                </Link>
              </div>
            </nav>
            </SectionShell>
          </div>
        </>
      )}
    </header>
  );
}
