import Header from "@/components/banner/Header";
import PageHero from "@/components/layouts/PageHero";
import OurServices from "@/components/services/Services";
import ServicesEdge from "@/components/services/ServicesEdge";
import WhatWeDo from "@/components/homepage/WhatWeDo";
import FinalCta from "@/components/homepage/FinalCta";
import { pageSurface, pageSurfaceToken } from "@/lib/surfaces";

export default function ServicesPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="What We Offer"
        title="Strategic"
        highlight="Capabilities"
        subtitle="A full-spectrum armory of digital services. We don't just build software — we engineer competitive advantages that move the needle for your business."
        crumb="Services"
        surface={pageSurface(0)}
        waveFill={pageSurfaceToken(1)}
      />
      <OurServices surface={pageSurface(1)} />
      <ServicesEdge surface={pageSurface(2)} />
      <WhatWeDo surface={pageSurface(3)} />
      <FinalCta surface={pageSurface(4)} />
    </main>
  );
}
