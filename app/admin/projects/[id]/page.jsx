"use client";

import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export default function EditProjectPage() {
  const params = useParams();
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return null;
  return <ProjectForm projectId={id} />;
}
