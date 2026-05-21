import Container from "./Container";
import logoPolice from "../assets/logo-police.webp";

export default function Header({ onStartExperience }: { onStartExperience: () => void }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container>
        <div className="flex h-24 items-center justify-between gap-6">
          <a href="#top" className="flex items-center">
            <img
              src={logoPolice}
              alt="Politiet"
              className="h-14 w-auto sm:h-16"
              loading="eager"
            />
          </a>

          <button
            type="button"
            onClick={onStartExperience}
            className="rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Prøv scenarioet
          </button>
        </div>
      </Container>
    </header>
  );
}

