"use client";

const ART = {
  web: ["/images/hero/web.svg", "/images/hero/web-dark.svg"],
  mobile: ["/images/hero/mobile.svg", "/images/hero/mobile-dark.svg"],
  ai: ["/images/hero/ai.svg", "/images/hero/ai-dark.svg"],
  cyber: ["/images/hero/cyber.svg", "/images/hero/cyber-dark.svg"],
  growth: ["/images/hero/growth.svg", "/images/hero/growth-dark.svg"],
  cloud: ["/images/hero/cloud.svg", "/images/hero/cloud-dark.svg"],
};

export function HeroScene({
  theme,
  className = "relative mx-auto h-[374px] w-full sm:h-[462px] lg:h-[550px]",
}) {
  const [light, dark] = ART[theme?.id] || ART.web;

  return (
    <div className={className}>
      <img
        src={light}
        alt=""
        width={550}
        height={550}
        draggable={false}
        className="hero-scene-light absolute inset-0 h-full w-full object-contain"
      />
      <img
        src={dark}
        alt=""
        width={550}
        height={550}
        draggable={false}
        className="hero-scene-dark absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}
