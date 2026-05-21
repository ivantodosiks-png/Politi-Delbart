import Container from "./Container";

export default function CtaSection({ onStartExperience }: { onStartExperience: () => void }) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <div className="max-w-2xl rounded-sm border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-slate-700">
              Klar til å teste reaksjonen din? Start øvelsen – det tar omtrent tre minutter, og ingen
              ekte data samles inn.
            </p>
            <button
              type="button"
              onClick={onStartExperience}
              className="mt-5 inline-flex rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Start øvelsen
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
