import Header from "@/components/banner/Header";
import PageHero from "@/components/layouts/PageHero";
import TeamSection from "@/components/homepage/TeamSection";
import Stats from "@/components/banner/Stats";
import FinalCta from "@/components/homepage/FinalCta";
import { pageSurface, pageSurfaceToken } from "@/lib/surfaces";

export const metadata = {
  title: "Our Team — Orbeetal",
};

export default function TeamPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Leadership"
        title="Meet the"
        highlight="Directors"
        subtitle="Visionary leaders driving Orbeetal's mission to engineer competitive advantages for businesses worldwide."
        crumb="Team"
        surface={pageSurface(0)}
        waveFill={pageSurfaceToken(1)}
      />
      <TeamSection showHeading={false} surface={pageSurface(1)} />
      <Stats surface={pageSurface(2)} />
      <FinalCta surface={pageSurface(3)} />
    </main>
  );
}
