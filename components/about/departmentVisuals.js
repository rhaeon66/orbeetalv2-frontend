import {
  BarChart3,
  Building2,
  Layers,
  Lightbulb,
  Megaphone,
  Server,
  Settings,
  Shield,
} from "lucide-react";

const BY_NAME = {
  planning: { Icon: Lightbulb, tone: "sky" },
  finance: { Icon: BarChart3, tone: "cyan" },
  operation: { Icon: Settings, tone: "navy" },
  operations: { Icon: Settings, tone: "navy" },
  cyber: { Icon: Shield, tone: "cyan" },
  cybersecurity: { Icon: Shield, tone: "cyan" },
  marketing: { Icon: Megaphone, tone: "navy" },
  "information technology": { Icon: Server, tone: "cyan" },
  it: { Icon: Server, tone: "cyan" },
  product: { Icon: Layers, tone: "lime" },
};

const TONE_CYCLE = ["sky", "cyan", "navy"];

export function isFeaturedDepartment(dept) {
  return /\bproduct\b/i.test(dept?.name || "");
}

export function departmentVisual(dept, index = 0) {
  const key = (dept?.name || "").trim().toLowerCase();
  const mapped = BY_NAME[key];
  return {
    Icon: mapped?.Icon || Building2,
    tone: mapped?.tone || TONE_CYCLE[index % TONE_CYCLE.length],
    featured: isFeaturedDepartment(dept),
  };
}

export function splitDepartments(departments = []) {
  const items = departments.map((dept, index) => ({ dept, index }));
  const featuredIndex = items.findIndex(({ dept }) => isFeaturedDepartment(dept));
  if (featuredIndex < 0) {
    return { grid: items, featured: null };
  }
  return {
    grid: items.filter((_, i) => i !== featuredIndex),
    featured: items[featuredIndex],
  };
}
