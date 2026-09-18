import Header from "@/components/banner/Header";
import PageHero from "@/components/layouts/PageHero";
import PortfolioCatalog from "@/components/portfolio/PortfolioCatalog";
import { pageSurface, pageSurfaceToken } from "@/lib/surfaces";

export default function PortfolioPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Portfolio"
        title="Work we're"
        highlight="proud of"
        subtitle="A showcase of products and platforms we've designed, engineered and shipped for clients and partners worldwide."
        crumb="Portfolio"
        surface={pageSurface(0)}
        waveFill={pageSurfaceToken(1)}
      />
      <PortfolioCatalog />
    </main>
  );
}
