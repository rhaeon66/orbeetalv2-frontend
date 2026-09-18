"use client";

import { useParams } from "next/navigation";
import DepartmentForm from "@/components/admin/departments/DepartmentForm";

export default function EditDepartmentPage() {
  const params = useParams();
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return null;
  return <DepartmentForm departmentId={id} />;
}
