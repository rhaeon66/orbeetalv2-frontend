import {
  BarChart3,
  BrainCircuit,
  Briefcase,
  CodeXml,
  Shield,
  Smartphone,
  Spline,
} from "lucide-react";

const BY_TITLE = {
  "app development": Smartphone,
  "ui/ux design": Spline,
  "ui ux design": Spline,
  "web development": CodeXml,
  "cyber security": Shield,
  cybersecurity: Shield,
  "digital marketing": BarChart3,
  "ai powered solutions": BrainCircuit,
  "ai-powered solutions": BrainCircuit,
};

export function expertiseVisual(service) {
  const key = (service?.title || "").trim().toLowerCase();
  return BY_TITLE[key] || Briefcase;
}
