"use client";

import { useParams } from "next/navigation";
import ServiceForm from "@/components/admin/services/ServiceForm";

export default function EditServicePage() {
  const params = useParams();
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return null;
  return <ServiceForm serviceId={id} />;
}
