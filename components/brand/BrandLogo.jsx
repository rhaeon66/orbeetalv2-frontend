import Image from "next/image";

export default function BrandLogo({
  className = "",
  width = 150,
  height = 42,
  onDark = false,
  priority = false,
  alt = "Orbeetal",
}) {
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
