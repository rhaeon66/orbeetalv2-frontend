import Header from "@/components/banner/Header";
import PageHero from "@/components/layouts/PageHero";
import AboutStory from "@/components/about/AboutStory";
import TeamSection from "@/components/homepage/TeamSection";
import { pageSurface, pageSurfaceToken } from "@/lib/surfaces";

export default function AboutPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="About Us"
        title="One of the Fastest Ways to"
        highlight="Business Growth"
        subtitle="We combine strategy, design, and engineering to deliver solutions that move the needle for ambitious businesses."
        crumb="About"
        surface={pageSurface(0)}
        waveFill={pageSurfaceToken(1)}
      />
      <AboutStory surface={pageSurface(1)} />
      <TeamSection surface={pageSurface(2)} />
    </main>
  );
}
