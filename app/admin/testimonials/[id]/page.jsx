"use client";

import { useParams } from "next/navigation";
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";

export default function EditTestimonialPage() {
  const params = useParams();
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return null;
  return <TestimonialForm testimonialId={id} />;
}
