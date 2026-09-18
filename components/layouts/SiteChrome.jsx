"use client";

import { usePathname } from "next/navigation";
import SkipLink from "./SkipLink";
import BackToTop from "./BackToTop";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return children;

  return (
    <>
      <SkipLink />
      <div id="main-content">{children}</div>
      <BackToTop />
    </>
  );
}
