"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return null;
  return <ProductForm productId={id} />;
}
