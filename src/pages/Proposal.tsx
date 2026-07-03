import { Nav } from "../components/proposal/Nav";
import { Hero } from "../components/proposal/Hero";
import { Problem } from "../components/proposal/Problem";
import { Phase1 } from "../components/proposal/Phase1";
import { Solution } from "../components/proposal/Solution";
import { Personalities } from "../components/proposal/Personalities";
import { HowItWorks } from "../components/proposal/HowItWorks";
import { Numbers } from "../components/proposal/Numbers";
import { Cost } from "../components/proposal/Cost";
import { Ask } from "../components/proposal/Ask";
import { Footer } from "../components/proposal/Footer";
import { useEffect } from "react";

export default function Proposal() {
  useEffect(() => {
    // Set page title for SEO/investor impression
    document.title = "Youth Educated — Phase 2: On-Device AI Proposal";
    
    // Ensure we start at the top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream text-ink font-inter selection:bg-gold/30 selection:text-navy-deep">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Phase1 />
        <Solution />
        <Personalities />
        <HowItWorks />
        <Numbers />
        <Cost />
        <Ask />
      </main>
      <Footer />
    </div>
  );
}
