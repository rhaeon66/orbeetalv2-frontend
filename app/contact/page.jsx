import Header from "@/components/banner/Header";
import PageHero from "@/components/layouts/PageHero";
import ContactSection from "@/components/contact-section/ContactSection";
import { pageSurface, pageSurfaceToken } from "@/lib/surfaces";

export const metadata = {
  title: "Contact Orbeetal — Let's Build Something Exceptional",
};

export default function ContactPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Get In Touch"
        title="Ready to"
        highlight="Launch?"
        subtitle="Reach out and let's start building something exceptional together."
        crumb="Contact"
        surface={pageSurface(0)}
        waveFill={pageSurfaceToken(1)}
      />
      <ContactSection surface={pageSurface(1)} />
    </main>
  );
}
