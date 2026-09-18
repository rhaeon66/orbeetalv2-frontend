"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import StatusPage from "@/components/layouts/StatusPage";

export default function Error({ reset }) {
  return (
    <StatusPage
      eyebrow="Error"
      title="Something went"
      highlight="wrong"
      subtitle="This page hit an unexpected problem. You can try again or head back home."
      crumb="Error"
    >
      <button type="button" onClick={() => reset()} className="btn btn-primary">
        Try again
        <RotateCcw size={16} />
      </button>
      <Link href="/" className="btn btn-ghost">
        Back to home
        <ArrowRight size={16} className="btn-icon" />
      </Link>
    </StatusPage>
  );
}
