import Header from "@/components/banner/Header";
import PageHero from "@/components/layouts/PageHero";
import DepartmentSection from "@/components/about/Departments";
import CollaborationSection from "@/components/about/CollaborationSection";
import FinalCta from "@/components/homepage/FinalCta";
import { pageSurface, pageSurfaceToken } from "@/lib/surfaces";

export const metadata = {
  title: "Our Departments — Orbeetal",
};

export default function DepartmentsPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Our Structure"
        title="Our"
        highlight="Departments"
        subtitle="Seven specialized departments working in unison to deliver excellence across every dimension of your project."
        crumb="Departments"
        surface={pageSurface(0)}
        waveFill={pageSurfaceToken(1)}
      />
      <DepartmentSection showHeading={false} surface={pageSurface(1)} />
      <CollaborationSection surface={pageSurface(2)} />
      <FinalCta surface={pageSurface(3)} />
    </main>
  );
}
