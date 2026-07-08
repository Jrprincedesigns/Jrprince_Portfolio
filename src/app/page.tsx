import HeroSequence from "@/components/sections/HeroSequence";
import IntroFill from "@/components/sections/IntroFill";
import CaseStudies from "@/components/sections/CaseStudies";
import Approach from "@/components/sections/Approach";
import Clients from "@/components/sections/Clients";
import Contact from "@/components/sections/Contact";

/**
 * LENXPRINCE DESIGN — single-page home as one scroll-choreographed sequence:
 * white splash → titles land → curtains open → portrait scrubs (head turn) →
 * snap into Introduction (text fills to ink on scroll) → Case Studies →
 * (approach · clients · contact).
 *
 * Snap points sit at each section boundary (proximity, key moments only).
 */
export default function HomePage() {
  return (
    <>
      <HeroSequence />
      <IntroFill />
      <CaseStudies />
      <div className="closing">
        <Approach />
        <Clients />
        <Contact />
      </div>
    </>
  );
}
