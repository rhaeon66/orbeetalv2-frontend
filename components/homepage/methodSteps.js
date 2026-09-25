import {
  BarChart3,
  ClipboardList,
  CodeXml,
  PenLine,
  Search,
  Shield,
} from "lucide-react";

export const METHOD_STEPS = [
  {
    title: "Discover",
    Icon: Search,
    points: ["Business & user research", "Requirements discovery", "Problem definition"],
  },
  {
    title: "Plan",
    Icon: ClipboardList,
    points: ["Project roadmap", "Technical planning", "Architecture & scope"],
  },
  {
    title: "Design",
    Icon: PenLine,
    points: ["UX research", "UI design", "Design system", "Prototyping"],
  },
  {
    title: "Develop",
    Icon: CodeXml,
    points: ["Frontend & backend", "API development", "Database integration", "Code reviews"],
  },
  {
    title: "Test & Deploy",
    Icon: Shield,
    points: ["QA & testing", "Security validation", "CI/CD", "Production deployment"],
  },
  {
    title: "Maintain & Scale",
    Icon: BarChart3,
    points: [
      "Monitoring",
      "Bug fixes",
      "Performance optimization",
      "Technical support",
      "Scaling",
    ],
  },
];

function stepKey(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function resolveMethodSteps(cmsSteps = []) {
  const incoming = Array.isArray(cmsSteps) ? cmsSteps.filter((step) => step?.title) : [];
  const hasPoints = incoming.some((step) => Array.isArray(step.points) && step.points.length);
  const source = hasPoints ? incoming : METHOD_STEPS;

  return source.map((step, index) => {
    const mapped =
      METHOD_STEPS.find((item) => stepKey(item.title) === stepKey(step.title)) ||
      METHOD_STEPS[index] ||
      METHOD_STEPS[0];
    const points = Array.isArray(step.points) && step.points.length ? step.points : mapped.points;
    return {
      title: step.title || mapped.title,
      points,
      Icon: mapped.Icon,
    };
  });
}
