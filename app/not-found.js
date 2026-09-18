import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StatusPage from "@/components/layouts/StatusPage";

export const metadata = {
  title: "Page not found — Orbeetal",
};

export default function NotFound() {
  return (
    <StatusPage
      eyebrow="404"
      title="This page is"
      highlight="missing"
      subtitle="The link may be outdated, or the page may have moved. Try the homepage or get in touch."
      crumb="Not found"
    >
      <Link href="/" className="btn btn-primary">
        Back to home
        <ArrowRight size={16} className="btn-icon" />
      </Link>
      <Link href="/contact" className="btn btn-ghost">
        Get a Quote
      </Link>
    </StatusPage>
  );
}
