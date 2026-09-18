/**
 * Consistent section heading: eyebrow, title, divider, optional subtitle.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  inverted = false,
  className = "",
}) {
  const isCenter = align === "center";

  return (
    <div
      className={`${isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left"} ${className}`}
    >
      {eyebrow && (
        <span className={`eyebrow hero-enter ${inverted ? "eyebrow-light" : ""}`}>
          {eyebrow}
        </span>
      )}

      <h2
        className={`section-title mt-4 hero-enter ${inverted ? "section-title-light" : ""}`}
        style={{ animationDelay: "50ms" }}
      >
        {title}
      </h2>

      <div
        className={`hero-enter ${isCenter ? "flex justify-center" : ""}`}
        style={{ animationDelay: "120ms" }}
      >
        <span className={`brand-divider ${inverted ? "brand-divider-light" : ""}`} />
      </div>

      {subtitle && (
        <p
          className={`section-subtitle hero-enter ${isCenter ? "mx-auto" : ""} ${
            inverted ? "section-subtitle-light" : ""
          }`}
          style={{ animationDelay: "180ms" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
