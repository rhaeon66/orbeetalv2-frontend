"use client";

import { useParams } from "next/navigation";
import ClientForm from "@/components/admin/clients/ClientForm";

export default function EditClientPage() {
  const params = useParams();
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return null;
  return <ClientForm clientId={id} />;
}
