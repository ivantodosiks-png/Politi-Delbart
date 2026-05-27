import Header from "./components/Header";
import Hero from "./components/Hero";
import VideoSection from "./components/VideoSection";
import ProcessSection from "./components/ProcessSection";
import InfoSection from "./components/InfoSection";
import BenefitsSection from "./components/BenefitsSection";
import RiskCards from "./components/RiskCards";
import CasesSection from "./components/CasesSection";
import PhoneGame from "./components/PhoneGame";
import FaqSection from "./components/FaqSection";
import HelpSection from "./components/HelpSection";
import Footer from "./components/Footer";
import { useState } from "react";

export default function App() {
  const [experienceOpen, setExperienceOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <Header />
      <main>
        <Hero />
        <VideoSection />
        <ProcessSection />
        <InfoSection />
        <BenefitsSection />
        <RiskCards />
        <CasesSection />
        <PhoneGame open={experienceOpen} onOpenChange={setExperienceOpen} />
        <FaqSection />
        <HelpSection />
      </main>
      <Footer />
    </div>
  );
}
