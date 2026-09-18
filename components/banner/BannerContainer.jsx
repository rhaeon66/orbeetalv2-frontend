import Header from "./Header";
import Stats from "./Stats";
import BannerSlider from "./Slider";

export default function BannerContainer({
  heroSurface = "bg-sage",
  statsSurface = "bg-pale",
}) {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <BannerSlider surface={heroSurface} />
      <Stats surface={statsSurface} />
    </div>
  );
}
