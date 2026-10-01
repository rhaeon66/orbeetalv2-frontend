"use client";

import { useState } from "react";

export function techInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2);
  const letters = parts.map((part) => part[0]?.toUpperCase() || "").join("");
  return letters || "?";
}

export default function TechLogo({ name, logo, className = "h-5 w-5" }) {
  const [failed, setFailed] = useState(false);

  if (logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt=""
        className={`${className} object-contain`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className={`${className} inline-flex items-center justify-center rounded bg-primary-light text-[9px] font-bold text-primary`}
      aria-hidden
    >
      {techInitials(name)}
    </span>
  );
}
