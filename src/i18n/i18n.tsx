import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "no" | "en" | "uk";

export const LANGS: Array<{ lang: Lang; label: string; flag: string }> = [
  { lang: "no", label: "Norsk", flag: "🇳🇴" },
  { lang: "en", label: "English", flag: "🇬🇧" },
  { lang: "uk", label: "Українська", flag: "🇺🇦" }
];

type Dict = Record<string, string>;

const DICTS: Record<Lang, Dict> = {
  no: {
    "nav.experience": "Opplevelse",
    "nav.cases": "Saker",
    "nav.threats": "Trusler",
    "nav.about": "Om",
    "nav.report": "Meld svindel",
    "nav.language": "Språk",

    "report.title": "Meld svindel",
    "report.h1": "Send oss det du mottok",
    "report.lead": "Du kan være anonym. Navn og telefon er valgfritt — meldingen holder.",
    "report.back": "Tilbake til siden",
    "report.first_name": "Fornavn (valgfritt)",
    "report.last_name": "Etternavn (valgfritt)",
    "report.phone": "Telefon (valgfritt)",
    "report.message": "Melding",
    "report.placeholder":
      "Beskriv hva som skjedde. Ta med brukernavn, lenker, hva de ba deg gjøre, osv.",
    "report.min_chars": "Minst 5 tegn.",
    "report.cancel": "Avbryt",
    "report.send": "Send melding",
    "report.sending": "Sender...",
    "report.sent": "Melding sendt. Takk!",

    "report.sidebar.title": "Hva du bør ta med",
    "report.sidebar.li1": "Hvor du fikk den (Snap, Instagram, SMS, e-post).",
    "report.sidebar.li2": "Brukernavn / telefonnummer / e-post de brukte.",
    "report.sidebar.li3": "Lenken de sendte (kopiér den helt nøyaktig).",
    "report.sidebar.li4": "Hva de ba deg gjøre (logge inn, sende bilder, betale).",
    "report.sidebar.tip_title": "Tips",
    "report.sidebar.tip_text":
      "Ikke slett chatten med én gang — ta skjermbilder først. Hvis du føler deg presset, ta en pause på 30 sekunder og spør noen du stoler på.",
    "report.sidebar.legal":
      "Ved å sende inn bekrefter du at informasjonen er riktig så langt du vet. Skjemaet brukes til læring og tidlig varsling — ved akutt fare, ring nødnummer.",
    "report.footer_note": "Hvis du delte noe ved et uhell: be om hjelp tidlig — det er aldri «for sent» å spørre."
  },
  en: {
    "nav.experience": "Experience",
    "nav.cases": "Cases",
    "nav.threats": "Threats",
    "nav.about": "About",
    "nav.report": "Report scam",
    "nav.language": "Language",

    "report.title": "Report scam",
    "report.h1": "Send us what you received",
    "report.lead": "You can stay anonymous. Name and phone are optional — the message is enough.",
    "report.back": "Back to site",
    "report.first_name": "First name (optional)",
    "report.last_name": "Last name (optional)",
    "report.phone": "Phone (optional)",
    "report.message": "Message",
    "report.placeholder": "Describe what happened. Add usernames, links, what they asked for, etc.",
    "report.min_chars": "Minimum 5 characters.",
    "report.cancel": "Cancel",
    "report.send": "Send report",
    "report.sending": "Sending...",
    "report.sent": "Report sent. Thank you!",

    "report.sidebar.title": "What to include",
    "report.sidebar.li1": "Where you got it (Snap, Instagram, SMS, email).",
    "report.sidebar.li2": "The username / phone number / email they used.",
    "report.sidebar.li3": "The link they sent (copy it exactly).",
    "report.sidebar.li4": "What they asked you to do (login, send images, pay money).",
    "report.sidebar.tip_title": "Tip",
    "report.sidebar.tip_text":
      "Don’t delete the chat right away — take screenshots first. If you feel pressured, pause for 30 seconds and ask someone you trust.",
    "report.sidebar.legal":
      "By submitting you confirm the information is true to the best of your knowledge. This form is for educational reporting and triage — if someone is in immediate danger, call emergency services.",
    "report.footer_note": "If you accidentally shared something: get help early — it’s never “too late” to ask."
  },
  uk: {
    "nav.experience": "Сценарій",
    "nav.cases": "Випадки",
    "nav.threats": "Загрози",
    "nav.about": "Про",
    "nav.report": "Повідомити про шахрайство",
    "nav.language": "Мова",

    "report.title": "Повідомити про шахрайство",
    "report.h1": "Надішліть нам те, що ви отримали",
    "report.lead": "Ви можете залишатися анонімними. Ім’я та телефон — необов’язково, достатньо повідомлення.",
    "report.back": "Повернутися на сайт",
    "report.first_name": "Ім’я (необов’язково)",
    "report.last_name": "Прізвище (необов’язково)",
    "report.phone": "Телефон (необов’язково)",
    "report.message": "Повідомлення",
    "report.placeholder":
      "Опишіть, що сталося. Додайте ніки, посилання, що вони просили зробити тощо.",
    "report.min_chars": "Мінімум 5 символів.",
    "report.cancel": "Скасувати",
    "report.send": "Надіслати",
    "report.sending": "Надсилаємо...",
    "report.sent": "Повідомлення надіслано. Дякуємо!",

    "report.sidebar.title": "Що варто додати",
    "report.sidebar.li1": "Де ви це отримали (Snap, Instagram, SMS, email).",
    "report.sidebar.li2": "Нік / номер телефону / email, який вони використали.",
    "report.sidebar.li3": "Посилання, яке надіслали (скопіюйте точно).",
    "report.sidebar.li4": "Що вони просили зробити (увійти, надіслати фото, заплатити).",
    "report.sidebar.tip_title": "Порада",
    "report.sidebar.tip_text":
      "Не видаляйте чат одразу — спочатку зробіть скріншоти. Якщо вас підганяють, зупиніться на 30 секунд і зверніться до людини, якій довіряєте.",
    "report.sidebar.legal":
      "Надсилаючи форму, ви підтверджуєте, що інформація правдива наскільки вам відомо. Це для навчального збору та первинної оцінки — у разі негайної небезпеки телефонуйте до служб екстреної допомоги.",
    "report.footer_note": "Якщо ви випадково щось надіслали: зверніться по допомогу якомога раніше — ніколи не буває «запізно»."
  }
};

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    return stored && (stored === "no" || stored === "en" || stored === "uk") ? stored : "no";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "no" ? "no" : lang === "uk" ? "uk" : "en";
  }, [lang]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTS[lang];
    return {
      lang,
      setLang: setLangState,
      t: (key: string) => dict[key] ?? DICTS.no[key] ?? key
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
