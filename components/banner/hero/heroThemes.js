const base = {
  primary: "var(--brand-primary)",
  secondary: "var(--cyan)",
  accent: "var(--brand-accent)",
  glowA: "color-mix(in srgb, var(--cyan) 22%, transparent)",
  glowB: "color-mix(in srgb, var(--brand-primary) 16%, transparent)",
  pillBg: "color-mix(in srgb, var(--cyan) 12%, transparent)",
  pillBorder: "color-mix(in srgb, var(--cyan) 32%, transparent)",
  badgeStyle: "pill",
};

const WEB = {
  ...base,
  id: "web",
  badges: [
    { title: "Fast Performance", icon: "bolt", slot: "top-left" },
    { title: "SEO Ready", subtitle: "For Growth", icon: "seo", slot: "top-right" },
    { title: "Secure & Reliable", icon: "shield", slot: "bottom-left" },
  ],
};

const MOBILE = {
  ...base,
  id: "mobile",
  badges: [
    { title: "Cross Platform", icon: "mobile", slot: "top-left" },
    { title: "High Performance", icon: "rocket", slot: "mid-left" },
    { title: "Secure & Compliant", icon: "shield", slot: "top-right" },
    { title: "Seamless UX", icon: "chart", slot: "bottom-right" },
  ],
};

const AI = {
  ...base,
  id: "ai",
  badgeStyle: "card",
  glowB: "color-mix(in srgb, var(--brand-accent) 14%, transparent)",
  badges: [
    { title: "Analyze", subtitle: "Turn data into meaningful insights", icon: "chart", slot: "top-left" },
    { title: "Automate", subtitle: "Streamline workflows with AI", icon: "settings", slot: "top-right" },
    { title: "Generate", subtitle: "Create content, ideas and solutions", icon: "code", slot: "bottom-left" },
    { title: "Optimize", subtitle: "Improve performance continuously", icon: "target", slot: "bottom-right" },
  ],
};

const GROWTH = {
  ...base,
  id: "growth",
  secondary: "var(--brand-accent)",
  accent: "var(--cyan)",
  glowA: "color-mix(in srgb, var(--brand-accent) 18%, transparent)",
  glowB: "color-mix(in srgb, var(--cyan) 16%, transparent)",
  pillBg: "color-mix(in srgb, var(--brand-accent) 12%, transparent)",
  pillBorder: "color-mix(in srgb, var(--brand-accent) 32%, transparent)",
  badges: [
    { title: "Data Driven", subtitle: "Strategic Insights", icon: "chart", slot: "top-left" },
    { title: "Higher Conversion", subtitle: "Turn Visitors into Customers", icon: "target", slot: "mid-left" },
    { title: "Better Reach", subtitle: "Across All Channels", icon: "rocket", slot: "top-right" },
    { title: "Measurable Growth", subtitle: "Track Real Results", icon: "chart", slot: "bottom-right" },
  ],
};

const CYBER = {
  ...base,
  id: "cyber",
  glowA: "color-mix(in srgb, var(--cyan) 24%, transparent)",
  glowB: "color-mix(in srgb, var(--brand-primary) 18%, transparent)",
  badges: [
    { title: "Threat Detection", icon: "shield", slot: "top-left" },
    { title: "Guided Defense", subtitle: "Always On", icon: "shield", slot: "top-right" },
    { title: "Compliant", subtitle: "Built For Your Stack", icon: "bolt", slot: "bottom-left" },
  ],
};

const CLOUD = {
  ...base,
  id: "cloud",
  pillBg: "color-mix(in srgb, var(--brand-primary) 12%, transparent)",
  pillBorder: "color-mix(in srgb, var(--brand-primary) 32%, transparent)",
  badges: [
    { title: "High Availability", subtitle: "99.9% Uptime", icon: "server", slot: "top-left" },
    { title: "Auto Scaling", subtitle: "Grow on Demand", icon: "up", slot: "top-right" },
    { title: "Secure Architecture", subtitle: "End-to-End Protection", icon: "shield", slot: "bottom-left" },
  ],
};

const THEMES = {
  web: WEB,
  "web development": WEB,
  mobile: MOBILE,
  "mobile engineering": MOBILE,
  ai: AI,
  "artificial intelligence": AI,
  cyber: CYBER,
  "cyber security": CYBER,
  cybersecurity: CYBER,
  growth: GROWTH,
  "digital growth": GROWTH,
  "digital marketing": GROWTH,
  cloud: CLOUD,
  "cloud infrastructure": CLOUD,
};

export function getHeroTheme(tag = "") {
  const key = String(tag).trim().toLowerCase();
  return THEMES[key] || WEB;
}
