import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ReportScamModal({ open, onOpenChange }: Props) {
  const reduceMotion = useReducedMotion();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { tone: "ok" | "bad"; text: string }>(null);

  const canSubmit = useMemo(() => message.trim().length >= 5 && !submitting, [message, submitting]);

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setResult(null);

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

    setResult({ tone: "ok", text: "Report sent. Thank you!" });
    setSubmitting(false);
    setFirstName("");
    setLastName("");
    setPhone("");
    setMessage("");
  }

  function close() {
    onOpenChange(false);
    setResult(null);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Report scam"
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <div className="text-base font-semibold text-slate-900">Report scam</div>
                <div className="mt-0.5 text-xs text-slate-600">
                  Leave name/phone optional — message is required.
                </div>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-sm text-slate-700 hover:bg-slate-100"
                onClick={close}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-800">First name (optional)</span>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11 rounded-sm border border-slate-300 bg-white px-3 text-slate-900 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring-4"
                    autoComplete="given-name"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-800">Last name (optional)</span>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11 rounded-sm border border-slate-300 bg-white px-3 text-slate-900 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring-4"
                    autoComplete="family-name"
                  />
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-800">Phone (optional)</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 rounded-sm border border-slate-300 bg-white px-3 text-slate-900 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring-4"
                  autoComplete="tel"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-800">Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="resize-none rounded-sm border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring-4"
                  placeholder="Describe what happened, links/usernames, screenshots, etc."
                />
              </label>

              {result ? (
                <div
                  className={`rounded-sm border p-3 text-sm ${
                    result.tone === "ok"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                  }`}
                >
                  {result.text}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="h-11 rounded-sm border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  onClick={close}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!canSubmit}
                  className="h-11 rounded-sm bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm ring-1 ring-rose-700/30 enabled:hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={submit}
                >
                  {submitting ? "Sending..." : "Send report"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

