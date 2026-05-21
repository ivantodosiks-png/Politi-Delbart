import Header from "./components/Header";
import Hero from "./components/Hero";
import ProcessSection from "./components/ProcessSection";
import InfoSection from "./components/InfoSection";
import BenefitsSection from "./components/BenefitsSection";
import RiskCards from "./components/RiskCards";
import CasesSection from "./components/CasesSection";
import PhoneGame from "./components/PhoneGame";
import FaqSection from "./components/FaqSection";
import HelpSection from "./components/HelpSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import { useState } from "react";

export default function App() {
  const [experienceOpen, setExperienceOpen] = useState(false);

  function startExperience() {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setExperienceOpen(true), 150);
  }

  return (
    <div className="min-h-dvh">
      <Header onStartExperience={startExperience} />
      <main>
        <Hero />
        <ProcessSection />
        <InfoSection />
        <BenefitsSection />
        <RiskCards />
        <CasesSection />
        <PhoneGame open={experienceOpen} onOpenChange={setExperienceOpen} />
        <FaqSection />
        <HelpSection />
        <CtaSection onStartExperience={startExperience} />
      </main>
      <Footer />
    </div>
  );
}
