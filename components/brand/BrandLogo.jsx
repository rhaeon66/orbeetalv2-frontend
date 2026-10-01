"use client";

import Image from "next/image";
import { useSiteBrand } from "@/lib/useSiteBrand";

export default function BrandLogo({
  className = "",
  width = 150,
  height = 60,
  onDark = false,
  priority = false,
  alt = "Orbeetal",
}) {
  const { logo } = useSiteBrand();

  if (logo) {
    return (
      <Image
        src={logo}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`object-contain ${className}`}
      />
    );
  }

  return (
    <Image
      src="/images/logo-white.svg"
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`${onDark ? "logo-on-dark" : "logo-on-light"} ${className}`}
    />
  );
}
