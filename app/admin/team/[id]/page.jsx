"use client";

import { useParams } from "next/navigation";
import TeamForm from "@/components/admin/team/TeamForm";

export default function EditTeamMemberPage() {
  const params = useParams();
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return null;
  return <TeamForm memberId={id} />;
}
