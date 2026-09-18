import Link from "next/link";
import { SITE } from "@/lib/site";

export default function BasisBadge({ className = "" }) {
  return (
    <Link
      href={SITE.basis}
      target="_blank"
      rel="noreferrer"
      className={`basis-badge ${className}`.trim()}
    >
      <span className="basis-badge-orb basis-badge-orb--lg" aria-hidden />
      <span className="basis-badge-orb basis-badge-orb--sm" aria-hidden />
      <span className="basis-badge-dot" aria-hidden />

      <span className="basis-badge-mark">BASIS</span>
      <span className="basis-badge-rule" aria-hidden />
      <span className="basis-badge-copy">
        <span className="basis-badge-title">Proud Member of BASIS</span>
        <span className="basis-badge-sub">
          Bangladesh Association of Software &amp; Information Services
        </span>
      </span>
    </Link>
  );
}
