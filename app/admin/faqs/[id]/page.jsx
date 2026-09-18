"use client";

import { useParams } from "next/navigation";
import FaqForm from "@/components/admin/faqs/FaqForm";

export default function EditFaqPage() {
  const params = useParams();
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return null;
  return <FaqForm faqId={id} />;
}
