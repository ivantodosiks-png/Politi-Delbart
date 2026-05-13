import Container from "./Container";
import logoMain from "../assets/logo-main.png";
import { motion } from "framer-motion";
import { Gamepad2, Info, Shield } from "lucide-react";

const nav = [
  { href: "#info", label: "О проекте", icon: Info },
  { href: "#risks", label: "Риски", icon: Shield },
  { href: "#game", label: "Mini‑spill", icon: Gamepad2 }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3">
            <img
              src={logoMain}
              alt="Logo"
              className="h-9 w-9 rounded-xl bg-white/5 p-1 ring-1 ring-white/10"
              loading="eager"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Безопасность в сети</div>
              <div className="text-xs text-slate-400">Профилактика • Обучение • Игра</div>
            </div>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <n.icon className="h-4 w-4 text-slate-400 transition group-hover:text-sky-300" />
                {n.label}
              </a>
            ))}
          </nav>

          <motion.a
            href="#game"
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-glow hover:bg-sky-400"
          >
            Играть
          </motion.a>
        </div>
      </Container>
    </header>
  );
}

