import Header from "./components/Header";
import Hero from "./components/Hero";
import InfoSection from "./components/InfoSection";
import RiskCards from "./components/RiskCards";
import PhoneGame from "./components/PhoneGame";
import HelpSection from "./components/HelpSection";
import Footer from "./components/Footer";
import { useState } from "react";

export default function App() {
  const [experienceOpen, setExperienceOpen] = useState(false);

  function startExperience() {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "start" });
    // let the scroll start before opening overlay
    window.setTimeout(() => setExperienceOpen(true), 150);
  }

  return (
    <div className="min-h-dvh">
      <Header onStartExperience={startExperience} />
      <main>
        <Hero />
        <InfoSection />
        <RiskCards />
        <PhoneGame open={experienceOpen} onOpenChange={setExperienceOpen} />
        <HelpSection />
      </main>
      <Footer />
    </div>
  );
}
