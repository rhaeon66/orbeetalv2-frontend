"use client";

import { useParams } from "next/navigation";
import SlideForm from "@/components/admin/slides/SlideForm";

export default function EditSlidePage() {
  const params = useParams();
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return null;
  return <SlideForm slideId={id} />;
}
