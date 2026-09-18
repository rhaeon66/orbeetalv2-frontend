"use client";

import { useState } from "react";
import Image from "next/image";

export default function SlideMedia({ src, alt, className = "", sizes }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className={`bg-pale ${className}`} aria-hidden />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
