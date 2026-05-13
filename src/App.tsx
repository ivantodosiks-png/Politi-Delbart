import Header from "./components/Header";
import Hero from "./components/Hero";
import InfoSection from "./components/InfoSection";
import RiskCards from "./components/RiskCards";
import PhoneGame from "./components/PhoneGame";
import HelpSection from "./components/HelpSection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main>
        <Hero />
        <InfoSection />
        <RiskCards />
        <PhoneGame />
        <HelpSection />
      </main>
      <Footer />
    </div>
  );
}

