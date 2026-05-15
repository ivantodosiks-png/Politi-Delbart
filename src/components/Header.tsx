import Container from "./Container";
import logoPolice from "../assets/logo-police.webp";
import { Menu, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="border-b border-slate-200">
        <Container>
          <div className="flex h-10 items-center justify-end gap-3 text-xs text-slate-700">
            <a className="hover:underline" href="#help">
              Nødnummer 112
            </a>
            <span className="text-slate-400">/ /</span>
            <a className="hover:underline" href="#help">
              Kontakt politiet
            </a>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3">
            <img src={logoPolice} alt="Politiet" className="h-11 w-auto" loading="eager" />
          </a>

          <nav className="hidden items-center gap-8 text-sm text-slate-800 md:flex">
            <a className="hover:underline" href="#campaign">
              Råd og forebygging
            </a>
            <a className="hover:underline" href="#experience">
              Scenario
            </a>
            <a className="hover:underline" href="#help">
              Hjelp og kontakt
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-800 hover:bg-slate-100"
              aria-label="Søk"
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Søk</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-800 hover:bg-slate-100"
              aria-label="Meny"
            >
              <Menu className="h-5 w-5" />
              <span className="hidden sm:inline">Meny</span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}

