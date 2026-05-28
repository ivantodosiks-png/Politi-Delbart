import Container from "./Container";
import { useMemo, useState } from "react";
import { getSupabase, hasSupabaseConfig } from "../lib/supabaseClient";
import { CheckCircle2, ChevronLeft, TriangleAlert } from "lucide-react";
import { useI18n } from "../i18n/i18n";

export default function ReportPage() {
  const { t } = useI18n();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { tone: "ok" | "bad"; text: string }>(null);

  const canSubmit = useMemo(
    () => hasSupabaseConfig && message.trim().length >= 5 && !submitting,
    [message, submitting]
  );

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setResult(null);

    const supabase = getSupabase();
    if (!supabase) {
      setResult({
        tone: "bad",
        text: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and redeploy."
      });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("scam_reports").insert({
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      phone: phone.trim() || null,
      message: message.trim()
    });

    if (error) {
      setResult({ tone: "bad", text: error.message });
      setSubmitting(false);
      return;
    }

    setResult({ tone: "ok", text: t("report.sent") });
    setSubmitting(false);
    setFirstName("");
    setLastName("");
    setPhone("");
    setMessage("");
  }

  return (
    <main className="border-t border-slate-200 bg-slate-50">
      <Container>
        <div className="py-10 sm:py-14">
          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-sm px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("report.back")}
          </a>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">{t("report.title")}</div>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">{t("report.h1")}</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{t("report.lead")}</p>

              {!hasSupabaseConfig ? (
                <div className="mt-4 flex items-start gap-3 rounded-sm border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    Supabase env vars missing on this deployment. Add <code>VITE_SUPABASE_URL</code> and{" "}
                    <code>VITE_SUPABASE_ANON_KEY</code> in Vercel → Environment Variables and redeploy.
                  </div>
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-800">{t("report.first_name")}</span>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11 rounded-sm border border-slate-300 bg-white px-3 text-slate-900 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring-4"
                    autoComplete="given-name"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-800">{t("report.last_name")}</span>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11 rounded-sm border border-slate-300 bg-white px-3 text-slate-900 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring-4"
                    autoComplete="family-name"
                  />
                </label>
              </div>

              <label className="mt-3 grid gap-1 text-sm">
                <span className="font-semibold text-slate-800">{t("report.phone")}</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 rounded-sm border border-slate-300 bg-white px-3 text-slate-900 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring-4"
                  autoComplete="tel"
                />
              </label>

              <label className="mt-3 grid gap-1 text-sm">
                <span className="font-semibold text-slate-800">{t("report.message")}</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={7}
                  className="resize-none rounded-sm border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring-4"
                  placeholder={t("report.placeholder")}
                />
                <div className="text-xs text-slate-500">{t("report.min_chars")}</div>
              </label>

              {result ? (
                <div
                  className={`mt-4 rounded-sm border p-3 text-sm ${
                    result.tone === "ok"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                  }`}
                >
                  {result.text}
                </div>
              ) : null}

              <div className="mt-5 flex items-center justify-end gap-2">
                <a
                  href="#top"
                  className="inline-flex h-11 items-center justify-center rounded-sm border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  {t("report.cancel")}
                </a>
                <button
                  type="button"
                  disabled={!canSubmit}
                  className="inline-flex h-11 items-center gap-2 rounded-sm bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm ring-1 ring-rose-700/30 enabled:hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={submit}
                >
                  {submitting ? t("report.sending") : t("report.send")}
                  {!submitting ? <CheckCircle2 className="h-4 w-4" /> : null}
                </button>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{t("report.sidebar.title")}</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>{t("report.sidebar.li1")}</li>
                <li>{t("report.sidebar.li2")}</li>
                <li>{t("report.sidebar.li3")}</li>
                <li>{t("report.sidebar.li4")}</li>
              </ul>

              <div className="mt-6 rounded-sm border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">{t("report.sidebar.tip_title")}</div>
                <p className="mt-1 leading-relaxed">{t("report.sidebar.tip_text")}</p>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-600">
                {t("report.sidebar.legal")}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center text-xs text-slate-500">{t("report.footer_note")}</div>
        </div>
      </Container>
    </main>
  );
}

