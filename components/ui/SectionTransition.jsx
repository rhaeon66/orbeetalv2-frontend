/**
 * Single Orbeetal wave used as a section signature — not a repeating divider.
 */
export default function SectionTransition({
  position = "bottom",
  fill = "var(--sage)",
  className = "",
}) {
  const isTop = position === "top";

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 leading-[0] ${
        isTop ? "top-0" : "bottom-0"
      } ${className}`}
      aria-hidden
    >
      <svg
        className={`block h-[52px] w-full sm:h-[72px] lg:h-[88px] ${
          isTop ? "rotate-180" : ""
        }`}
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
      >
        <path
          fill={fill}
          d="M0,55 C240,115 480,115 720,75 C960,35 1200,35 1440,82 L1440,110 L0,110 Z"
        />
      </svg>
    </div>
  );
}
