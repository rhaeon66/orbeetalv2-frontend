"use client";

import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseCarousel from "@/components/ui/ShowcaseCarousel";
import { useGetPublishedProductsQuery } from "@/redux/features/cms/productsApi";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";

export default function ProductShowcase({ surface = "bg-pale" }) {
  const { data: products = [], isLoading, isError, refetch } =
    useGetPublishedProductsQuery();

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
              <article className="showcase-carousel-card">
                <div className="showcase-media showcase-media--cover">
                  {product.imageScreen || product.image ? (
                    <Image
                      src={product.imageScreen || product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 80vw, 24rem"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="relative flex flex-1 flex-col overflow-hidden px-5 pb-5">
                  <CardWatermark topic={product} tone="navy" size="md" />
                  <h3 className="relative text-lg font-bold sm:text-xl">{product.title}</h3>
                  {product.description ? (
                    <p className="relative mt-2 line-clamp-3 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  ) : null}
                  {(product.features || []).length > 0 && (
                    <ul className="mt-4 grid gap-2">
                      {(product.features || []).slice(0, 3).map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={16} />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href={product.url || "/contact"} className="btn btn-primary mt-5 w-full">
                    Get In Touch
                    <ArrowRight size={16} className="btn-icon" />
                  </Link>
                </div>
              </article>
            )}
          />
        )}
      </SectionShell>
    </section>
  );
}
