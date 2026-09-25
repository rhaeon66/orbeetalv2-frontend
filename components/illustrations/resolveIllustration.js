import { MOTIFS } from "./motifs";

const RULES = [
  { motif: "mobile", tests: [/\bmobile\b/, /\bapp development\b/, /\bios\b/, /\bandroid\b/] },
  { motif: "shield", tests: [/\bcyber\b/, /security/, /protect/, /threat/, /secure architecture/] },
  { motif: "ai", tests: [/\bai\b/, /artificial/, /machine learning/, /neural/, /intelligent/] },
  { motif: "cloud", tests: [/\bcloud\b/, /infrastructure/, /academy/] },
  { motif: "education", tests: [/educat/, /\blearn/, /school/, /course/, /\bbook/, /note sharing/, /munabook/] },
  { motif: "finance", tests: [/finance/, /budget/, /expense/, /audit/, /money/] },
  { motif: "design", tests: [/ui\/?ux/, /\bdesign\b/, /prototyp/, /wireframe/, /convert visitors/] },
  { motif: "analytics", tests: [/analytic/, /\bseo\b/, /campaign/, /growth strategy/, /digital marketing/, /digital growth/] },
  { motif: "marketing", tests: [/\bmarketing\b/, /\bbrand/, /audience/, /visibility/, /reporter/] },
  { motif: "web", tests: [/web development/, /website/, /\bcms\b/] },
  { motif: "code", tests: [/software/, /develop/, /fullstack/, /full-stack/, /engineer/, /\bcode\b/] },
  { motif: "server", tests: [/information technology/, /\bit\b/, /server/, /devops/] },
  { motif: "operations", tests: [/operation/, /cleanroom/, /filtration/, /resource allocation/, /policy/] },
  { motif: "planning", tests: [/\bplan(ning|s)?\b/, /roadmap/, /\bresearch\b/, /\bmission\b/] },
  { motif: "product", tests: [/\bproduct/, /ownership/] },
  { motif: "workflow", tests: [/workflow/, /\btask\b/, /end-to-end/, /pipeline/, /unified delivery/, /burial/, /process/, /\bproject/] },
  { motif: "collaboration", tests: [/collaborat/, /\bteam\b/, /partner/, /\bclient/, /together/, /cross-functional/, /facebook/, /linkedin/] },
  { motif: "support", tests: [/\bsupport\b/, /24\/7/, /helpdesk/, /reply/] },
  { motif: "growth", tests: [/\bgrowth\b/, /\bplant\b/, /\bscale\b/, /\bvision\b/, /\bimpact\b/] },
  { motif: "discover", tests: [/discover/, /problem definition/] },
  { motif: "deploy", tests: [/deploy/, /\btest\b/, /ci\/cd/, /launch/, /\bship/] },
  { motif: "certificate", tests: [/basis/, /certified/, /accredit/, /member/] },
  { motif: "contact", tests: [/contact/, /email/, /quote/, /message/, /whatsapp/, /phone/] },
];

function normalize(input) {
  if (!input) return "";
  if (Array.isArray(input)) return input.map(normalize).join(" ");
  if (typeof input === "object") {
    return [
      input.title,
      input.name,
      input.label,
      input.subtitle,
      input.description,
      input.category,
      input.question,
      ...(input.features || []),
      ...(input.content || []),
    ]
      .filter(Boolean)
      .join(" ");
  }
  return String(input);
}

export function resolveMotifName(input) {
  const primary = normalize(
    input && typeof input === "object" && !Array.isArray(input)
      ? input.title || input.name || input.label || input.question || ""
      : input
  ).toLowerCase();
  const full = normalize(input).toLowerCase();

  const pick = (text) => {
    if (!text) return null;
    return RULES.find((rule) => rule.tests.some((re) => re.test(text)))?.motif || null;
  };

  return pick(primary) || pick(full) || "orbit";
}

export function resolveMotif(input) {
  return MOTIFS[resolveMotifName(input)] || MOTIFS.orbit;
}
