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
import ReportScamModal from "./components/ReportScamModal";

export default function App() {
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="relative min-h-dvh bg-slate-50">
      <div id="top" />
      {/* Subtle side lines / paper background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.22), rgba(148,163,184,0.22)), linear-gradient(to left, rgba(148,163,184,0.22), rgba(148,163,184,0.22))",
          backgroundSize: "1px 100%, 1px 100%",
          backgroundPosition: "48px 0, calc(100% - 48px) 0",
          backgroundRepeat: "no-repeat"
        }}
      />
      <Header onReportClick={() => setReportOpen(true)} />
      <ReportScamModal open={reportOpen} onOpenChange={setReportOpen} />
      <main>
        <Hero />
        <VideoSection />
        <ProcessSection />
        <InfoSection />
        <BenefitsSection />
        <RiskCards />
        <CasesSection />
        <section id="experience">
          <PhoneGame open={experienceOpen} onOpenChange={setExperienceOpen} />
        </section>
        <FaqSection />
        <HelpSection />
      </main>
      <Footer />
    </div>
  );
}
