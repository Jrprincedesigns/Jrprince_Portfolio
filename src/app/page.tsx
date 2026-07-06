import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import Approach from "@/components/sections/Approach";
import Clients from "@/components/sections/Clients";
import Testimonials from "@/components/sections/Testimonials";
import ContactChat from "@/components/sections/ContactChat";

/**
 * Single-page home, structured to mirror the reference site:
 * hero → work → about → capabilities → approach → clients → testimonials → contact.
 *
 * Each section is its own component under components/sections. Content lives in
 * src/data/home.ts. Case-study detail pages (/work/[slug]) and the Gemini chat
 * still exist in the repo; we'll reconnect them in a later pass.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <About />
      <Capabilities />
      <Approach />
      <Clients />
      <Testimonials />
      <ContactChat />
    </>
  );
}
