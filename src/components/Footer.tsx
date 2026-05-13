import Container from "./Container";
import logoFooter from "../assets/logo-footer.png";
import { Github, Mail, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <Container>
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoFooter}
              alt="Logo footer"
              className="h-10 w-10 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10"
              loading="lazy"
            />
            <div className="text-sm">
              <div className="font-semibold text-white">Безопасность в сети</div>
              <div className="text-xs text-slate-400">Frontend-only • React + Vite</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <a
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              href="#top"
            >
              <Shield className="h-4 w-4 text-sky-300" />
              Наверх
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              href="mailto:example@example.com"
            >
              <Mail className="h-4 w-4 text-slate-300" />
              Контакт
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4 text-slate-300" />
              Репозиторий
            </a>
          </div>
        </div>

        <div className="pb-10 text-xs text-slate-500">
          © {new Date().getFullYear()} • Сделано для учебного проекта. Замените тексты/контакты под ваш кейс.
        </div>
      </Container>
    </footer>
  );
}

