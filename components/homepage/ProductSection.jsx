"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseCarousel from "@/components/ui/ShowcaseCarousel";
import ShowcaseWorkCard, { WorkDialog } from "@/components/ui/ShowcaseWorkCard";
import { useGetPublishedProductsQuery } from "@/redux/features/cms/productsApi";
import SectionShell from "@/components/layouts/SectionShell";

export default function ProductShowcase({ surface = "bg-pale" }) {
  const { data: products = [], isLoading, isError, refetch } =
    useGetPublishedProductsQuery();
  const [open, setOpen] = useState(null);

  return (
    <section className={`section showcase-section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="Orbeetal Originals"
          title={
            <>
              Our Company <span className="text-gradient">Products</span>
            </>
          }
          subtitle="Battle-tested products we designed, built, and shipped — proof of what we can deliver for you."
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading products…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load products.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <p className="section-stack text-center text-sm font-semibold text-ink-500">
            Products will appear here once they are published.
          </p>
        )}

        {products.length > 0 && (
          <ShowcaseCarousel
            className="section-stack"
            items={products}
            getKey={(item) => item.id}
            label="company products"
            renderItem={(product) => (
              <ShowcaseWorkCard
                title={product.title}
                description={product.description}
                tags={(product.features || []).slice(0, 3)}
                href={product.url || "/portfolio"}
                external={Boolean(product.url)}
                linkLabel={product.url ? "Open project" : "View portfolio"}
                topic={product}
                onMore={() => setOpen({ title: product.title, description: product.description })}
                image={
                  product.imageScreen || product.image ? (
                    <Image
                      src={product.imageScreen || product.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 80vw, 24rem"
                      className="object-cover"
                    />
                  ) : null
                }
              />
            )}
          />
        )}
        {open ? (
          <WorkDialog title={open.title} description={open.description} onClose={() => setOpen(null)} />
        ) : null}
      </SectionShell>
    </section>
  );
}
