import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "no" | "en" | "uk";

export const LANGS: Array<{ lang: Lang; label: string; flag: string }> = [
  { lang: "no", label: "NO", flag: "🇳🇴" },
  { lang: "en", label: "EN", flag: "🇬🇧" },
  { lang: "uk", label: "UA", flag: "🇺🇦" }
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

    "common.more": "Vis mer",
    "common.less": "Skjul",

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
    "report.footer_note": "Hvis du delte noe ved et uhell: be om hjelp tidlig — det er aldri «for sent» å spørre.",

    "hero.h1": "Delbart: Ett klikk kan endre alt",
    "hero.lead":
      "Ett klikk på feil lenke, eller én deling uten samtykke, kan påvirke deg, andre og straffbarheten. Her får du konkrete råd om phishing, falske lenker og sextortion – og et kort scenario som viser hvordan det kan skje.",
    "hero.motto": "Stopp. Tenk. Spør.",
    "hero.cta": "Se hvordan ett klikk kan lure deg",
    "hero.card1.title": "Stopp spredning med én gang",
    "hero.card1.text":
      "Ikke videresend, ikke lagre «for sikkerhet» og ikke kommenter i grupper. Be personen som delte om å slette, og be mottakere om det samme.",
    "hero.card2.title": "Dokumenter det som skjedde",
    "hero.card2.text":
      "Ta skjermbilder av meldinger, lenker, profiler og tidspunkt. Ikke endre eller slett noe før du har snakket med en voksen eller politiet.",
    "hero.card3.title": "Du trenger ikke å klare det alene",
    "hero.card3.text": "Akutt fare eller trusler om vold: 112. Råd, veiledning og anmeldelse: 02800 (døgnåpent).",
    "hero.short_title": "Kort forklart",
    "hero.short1.label": "Phishing",
    "hero.short1.text": "falske meldinger eller lenker som lurer deg til å klikke, logge inn eller gi tillatelser.",
    "hero.short2.label": "Sextortion",
    "hero.short2.text": "noen truer med å dele bilder eller videoer for å få penger, flere bilder eller mer kontroll over deg.",
    "hero.short3.label": "Tillatelser",
    "hero.short3.text": "ukjente apper og nettsider skal ikke få tilgang til bilder, kamera eller kontakter uten at du er helt sikker.",

    "video.eyebrow": "Video",
    "video.title": "Se et kort eksempel",
    "video.desc":
      "Vil du se en video om temaet? Trykk for å åpne avspilleren. Tekst på siden er holdt kort – du kan også utvide for å lese mer.",
    "video.box_p1":
      "Ønsker du å holde foredrag for barn og unge om deling av seksualiserte bilder? Undervisningsopplegget «Delbart?» er tilrettelagt slik at lærere, helsesykepleiere, miljøarbeidere, utekontakter og andre voksne som jobber med barn og unge kan holde foredrag.",
    "video.made_by": "Laget av",

    "process.eyebrow": "Slik bruker du siden",
    "process.title": "Tre steg – fra forståelse til handling",
    "process.desc":
      "Siden er bygget for å gi deg oversikt før du tar valg på ekte. Bruk den i den rekkefølgen som passer deg.",
    "process.step_label": "Steg",
    "process.step1.title": "Les grunnleggende",
    "process.step1.text": "Konsekvenser, røde flagg og sjekkliste – slik at du kjenner mønstrene før noe skjer.",
    "process.step2.title": "Prøv scenarioet",
    "process.step2.text": "Et kort, fiktivt forløp i en chat-app. Du velger selv: ignorere, åpne eller gi tillatelse.",
    "process.step3.title": "Velg neste steg",
    "process.step3.text":
      "Hjelp, 02800 eller en voksen du stoler på. Du har ikke gjort noe galt ved å be om støtte.",
    "process.for_who": "For hvem er dette?",
    "process.aud1.label": "Ungdom",
    "process.aud1.text": "før du sender, klikker eller svarer på press.",
    "process.aud2.label": "Foreldre",
    "process.aud2.text": "samtale hjemme om samtykke og hva barnet skal gjøre.",
    "process.aud3.label": "Skole",
    "process.aud3.text": "undervisning, klassemøte og digital kompetanse.",

    "experience.eyebrow": "Interaktiv øvelse",
    "experience.title": "Opplev phishing og sextortion – trygt",
    "experience.desc":
      "Et kort, fiktivt scenario i en chat-app. Du velger selv: ignorere, åpne eller gi tillatelse. Ingen ekte data samles inn – målet er å lære mønstrene før det skjer på ekte.",
    "experience.start": "Start øvelsen",
    "experience.close": "Lukk",

    "info.eyebrow": "Digital trygghet",
    "info.title": "Slik beskytter du deg – og andre",
    "info.desc":
      "Kampanjen Delbart handler om samtykke, falske lenker og digital utpressing. Her får du fem konkrete prinsipper du kan bruke i hverdagen – før noe skjer.",
    "info.1.title": "Del aldri uten samtykke",
    "info.1.text":
      "Å sende intime bilder videre – også til én «venn» – kan være straffbart og ødelegge tillit. Spør alltid: Har personen sagt ja til at dette deles?",
    "info.2.title": "Sjekk lenken – ikke bare avsenderen",
    "info.2.text":
      "Kjente navn og logoer kan kopieres. Hold musepekeren over lenken, se hele domenet, og vær ekstra skeptisk i DM og gruppechatter.",
    "info.3.title": "Gi minst mulig tilgang",
    "info.3.text":
      "En popup om «bilder» eller «kamera» fra ukjent side er ofte første steg i et angrep. Si nei, lukk fanen, og spør en voksen du stoler på.",
    "info.4.title": "Gjør kontoene dine vanskeligere å ta",
    "info.4.text":
      "Sterke passord, unike passord per tjeneste og totrinnsbekreftelse (2FA) på e-post og sosiale medier reduserer risiko for innbrudd og utpressing.",
    "info.5.title": "Ikke betal – dokumenter – få hjelp",
    "info.5.text":
      "Betaling stopper sjelden truslene. Ta bevis, blokker, rapporter i appen, og kontakt politiet (02800) eller en trygg voksen.",
    "info.red_title": "Røde flagg – stopp før du klikker",
    "info.red_more": "Vis alle røde flagg",
    "info.red1": "Meldinger med panikk: «HASTER!!!», «ER DETTE DEG!?», «slett innen 10 min».",
    "info.red2": "Domener som ligner kjente tjenester, men med ekstra ord eller rare tegn (f.eks. snap-profile-story.net).",
    "info.red3": "Forespørsler om bilder, kamera, mikrofon eller «bekreft konto» uten tydelig grunn.",
    "info.red4": "Trusler, skam, krav om penger, Vipps eller «flere bilder hvis ikke…».",

    "benefits.eyebrow": "Hvorfor handle tidlig",
    "benefits.title": "Fordeler med å ta grep med én gang",
    "benefits.desc": "Små handlinger tidlig kan begrense skade – for deg og for andre.",
    "benefits.1.title": "Mindre spredning",
    "benefits.1.text": "Jo raskere du stopper, jo færre kopier og skjermbilder finnes ute.",
    "benefits.2.title": "Bedre bevis",
    "benefits.2.text": "Tidlig dokumentasjon gjør det enklere for politiet og skolen å følge opp.",
    "benefits.3.title": "Mindre stress",
    "benefits.3.text": "Du slipper å bære hemmeligheten alene når du snakker med noen du stoler på.",
    "benefits.4.title": "Tydeligere valg",
    "benefits.4.text": "02800 og trygge voksne kan veilede uten at du må gjette hva som er riktig.",

    "risks.eyebrow": "Konsekvenser og valg",
    "risks.title": "Hva kan skje – og hva du kan gjøre med én gang",
    "risks.desc": "Hvert punkt er et stopp‑punkt: les det, ta ett trygt valg, og gå videre.",
    "risks.1.title": "Lenker kan se helt riktige ut",
    "risks.1.text":
      "Angripere kopierer design, logo og språk. Det som avslører dem, er ofte domenet, hastverket og at de ber om mer enn de trenger.",
    "risks.2.title": "Én «Allow» kan gi full tilgang",
    "risks.2.text":
      "Tillatelse til bilder eller kamera på en ukjent side kan brukes til utpressing senere – også uten at du merker det med én gang.",
    "risks.3.title": "Panikk er et verktøy",
    "risks.3.text":
      "Når noen vil at du skal handle raskt, tenker du mindre. Ta en pause på 30 sekunder: «Hvem sendte dette, og hvorfor nå?»",
    "risks.4.title": "Det du deler, kan ikke «tas tilbake»",
    "risks.4.text":
      "Sletting hos deg stopper ikke kopier, skjermbilder eller videre deling. Derfor gjelder samtykke og tenking før sending.",
    "risks.5.title": "Utpressing bygger på skam",
    "risks.5.text":
      "Mange ofre betaler eller sender mer fordi de er redde. Politiet anbefaler: ikke betal, ta bevis, blokker, meld fra.",
    "risks.6.title": "Konsekvenser er reelle",
    "risks.6.text":
      "Rykter, mobbing, stress, skolearbeid og i alvorlige tilfeller politietterforskning. Tidlig hjelp begrenser skaden.",
    "risks.checklist_title": "Sjekklista før du klikker",
    "risks.check1": "Kjenner jeg avsenderen – og passer meldingen til dem?",
    "risks.check2": "Er domenet helt riktig (ingen ekstra ord, bindestrek, .net i stedet for .com)?",
    "risks.check_more": "Vis hele sjekklista",
    "risks.check3": "Ber siden om bilder, kamera eller innlogging jeg ikke trenger?",
    "risks.check4": "Føler jeg meg presset? → Stopp, vis meldingen til en voksen.",
    "risks.check5": "Hva er verste utfall – og er det verdt risikoen?",

    "cases.eyebrow": "Eksempler",
    "cases.title": "Slik starter mange saker",
    "cases.desc": "Navn og detaljer er endret. Poenget er å vise mønstre – ikke skremme.",
    "cases.1.title": "Falsk lenke i chat",
    "cases.1.text":
      "En elev fikk snap: «Er dette deg?». Lenken gikk til en falsk «story»-side som ba om bilder. Ved å si nei unngikk hen panikk og mulig utpressing.",
    "cases.2.title": "Sextortion etter «allow»",
    "cases.2.text":
      "Etter at noen ga tilgang til bilder, kom trusler om penger. Ved å ikke betale, dokumentere og ringe 02800, stoppet situasjonen før innholdet ble delt videre.",
    "cases.quote":
      "«Mange saker starter med ett klikk og skam. Jo tidligere vi får melding, jo bedre kan vi begrense skaden.»",
    "cases.quote_by": "Etterforsker, nettkriminalitet",

    "faq.eyebrow": "Ofte stilte spørsmål",
    "faq.title": "Svar på det mange lurer på",
    "faq.desc": "Korte svar – ring 02800 hvis du er usikker på din situasjon.",
    "faq.q1": "Er det straffbart å dele intime bilder videre?",
    "faq.a1":
      "Ja. Deling uten samtykke kan være straffbart i Norge – også blant ungdom, og også når du «bare sender til en venn».",
    "faq.q2": "Hva om jeg allerede har klikket på en mistenkelig lenke?",
    "faq.a2":
      "Ikke panikk. Gi ikke mer tilgang, lukk siden, dokumenter (skjermbilder, URL), og snakk med en voksen eller ring 02800.",
    "faq.q3": "Skal jeg betale ved sextortion?",
    "faq.a3":
      "Nei. Betaling stopper sjelden truslene og kan øke presset. Ta bevis, blokker, rapporter i appen, og kontakt politiet.",
    "faq.q4": "Kan politiet hjelpe uten at foreldre får vite?",
    "faq.a4":
      "Ring 02800 og spør. De forklarer hva som er mulig ut fra din alder og situasjon – du bestemmer ikke alene.",
    "faq.q5": "Hva er forskjellen på 112 og 02800?",
    "faq.a5":
      "112 brukes ved akutt fare eller trusler om vold. 02800 er for råd, veiledning og anmeldelse av nettkriminalitet.",

    "help.eyebrow": "Hjelp og neste steg",
    "help.title": "Hva gjør du hvis du er lurt, utpresset eller har delt noe du angrer på?",
    "help.desc":
      "Følg stegene under i rekkefølge. Du har ikke gjort noe galt ved å be om hjelp. Ved akutt fare: ring 112.",
    "help.contact": "Kontakt",
    "help.emergency": "Nød",
    "help.police": "Politiet",
    "help.contact_text":
      "02800 – veiledning, anmeldelse og spørsmål om nettkriminalitet. 112 – når du er i fare eller noen truer deg fysisk. Vil du ikke ringe: vis denne siden til en lærer, helsesykepleier, forelder eller annen voksen du stoler på.",
    "help.step1.title": "1. Stopp spredning",
    "help.step1.text": "Be alle som har mottatt innhold om å slette. Ikke del videre, ikke lagre kopier «til senere».",
    "help.step2.title": "2. Sikre bevis",
    "help.step2.text": "Skjermbilder, URL, brukernavn, dato og tid. Lag en kort tidslinje med det du husker.",
    "help.step3.title": "3. Snakk med noen du stoler på",
    "help.step3.text":
      "Du trenger støtte før du tar neste steg. Mange skoler og kommuner har rutiner for digital vold og deling.",
    "help.step4.title": "4. Vurder å melde fra til politiet",
    "help.step4.text": "På 02800 får du vite hva som er mulig, uten at du må anmelde med én gang.",
    "help.sext_title": "Hvis noen prøver sextortion",
    "help.sext1": "Ikke betal. Ikke send flere bilder.",
    "help.sext2": "Ta skjermbilder og lagre bevis (brukernavn, lenker, tidspunkt).",
    "help.sext3": "Blokker kontoen og rapporter i appen.",
    "help.sext4": "Snakk med en trygg voksen eller kontakt politiet på 02800.",
    "help.sext5": "Politiet ser ofte at betaling ikke stopper truslene – kontakt heller 02800 tidlig.",
    "help.protect_title": "Slik beskytter du deg",
    "help.prot1": "Bruk 2FA på e‑post og sosiale medier.",
    "help.prot2": "Oppdater telefon og apper.",
    "help.prot3": "Vær skeptisk til lenker fra meldinger.",
    "help.prot4": "Gi færrest mulig tillatelser.",
    "help.prot5": "Slå av «ukjente kan sende meldinger» der det er mulig.",
    "help.prot6": "Rapporter og blokker kontoer som presser deg.",
    "help.prot7": "Snakk med venner om å ikke dele andres bilder – det er også ditt ansvar.",

    "footer.tagline": "Kampanje for digital trygghet og samtykke",
    "footer.help_link": "Hjelp og neste steg",
    "footer.disclaimer": "Informasjon og forebygging. Innholdet erstatter ikke juridisk rådgivning."
  },
  en: {
    "nav.experience": "Experience",
    "nav.cases": "Cases",
    "nav.threats": "Threats",
    "nav.about": "About",
    "nav.report": "Report scam",
    "nav.language": "Language",

    "common.more": "Show more",
    "common.less": "Hide",

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
    "report.footer_note": "If you accidentally shared something: get help early — it’s never “too late” to ask.",

    "hero.h1": "Shareable: One click can change everything",
    "hero.lead":
      "One click on the wrong link, or sharing without consent, can affect you and others. Here you’ll get concrete advice about phishing, fake links and sextortion — plus a short scenario that shows how it can happen.",
    "hero.motto": "Stop. Think. Ask.",
    "hero.cta": "See how one click can trick you",
    "hero.card1.title": "Stop the spread immediately",
    "hero.card1.text":
      "Don’t forward, don’t save “just in case”, and don’t comment in group chats. Ask the person who shared to delete it, and ask recipients to do the same.",
    "hero.card2.title": "Document what happened",
    "hero.card2.text":
      "Take screenshots of messages, links, profiles and timestamps. Don’t change or delete anything before you’ve talked to a trusted adult or the police.",
    "hero.card3.title": "You don’t have to handle it alone",
    "hero.card3.text": "Immediate danger or threats of violence: 112. Advice and reporting: 02800 (24/7).",
    "hero.short_title": "In short",
    "hero.short1.label": "Phishing",
    "hero.short1.text": "fake messages or links that trick you into clicking, logging in, or granting permissions.",
    "hero.short2.label": "Sextortion",
    "hero.short2.text": "someone threatens to share images or video to get money, more images, or control over you.",
    "hero.short3.label": "Permissions",
    "hero.short3.text": "unknown apps and websites shouldn’t get access to photos, camera, or contacts unless you’re sure.",

    "video.eyebrow": "Video",
    "video.title": "Watch a short example",
    "video.desc":
      "Want to watch a video about the topic? Tap to open the player. The page text is short — you can expand to read more.",
    "video.box_p1":
      "Do you want to give a talk for children and young people about sharing sexualized images? The teaching package “Delbart?” is adapted so teachers, school nurses and other adults working with youth can hold a session.",
    "video.made_by": "Made by",

    "process.eyebrow": "How to use the site",
    "process.title": "Three steps — from understanding to action",
    "process.desc":
      "This site is built to give you an overview before you make real choices. Use it in the order that fits you.",
    "process.step_label": "Step",
    "process.step1.title": "Learn the basics",
    "process.step1.text": "Consequences, red flags and a checklist — so you recognize patterns before anything happens.",
    "process.step2.title": "Try the scenario",
    "process.step2.text": "A short fictional flow in a chat app. You choose: ignore, open, or grant permission.",
    "process.step3.title": "Choose next steps",
    "process.step3.text": "Help, 02800, or a trusted adult. You haven’t done anything wrong by asking for support.",
    "process.for_who": "Who is this for?",
    "process.aud1.label": "Teens",
    "process.aud1.text": "before you send, click, or respond to pressure.",
    "process.aud2.label": "Parents",
    "process.aud2.text": "a conversation at home about consent and what to do.",
    "process.aud3.label": "Schools",
    "process.aud3.text": "teaching, class meetings and digital competence.",

    "experience.eyebrow": "Interactive exercise",
    "experience.title": "Experience phishing and sextortion — safely",
    "experience.desc":
      "A short fictional scenario in a chat app. You choose: ignore, open, or grant permission. No real data is collected — the goal is to learn patterns before it happens for real.",
    "experience.start": "Start exercise",
    "experience.close": "Close",

    "info.eyebrow": "Digital safety",
    "info.title": "How to protect yourself — and others",
    "info.desc":
      "The Delbart campaign is about consent, fake links and digital extortion. Here are five principles you can use in everyday life — before anything happens.",
    "info.1.title": "Never share without consent",
    "info.1.text":
      "Forwarding intimate images — even to one “friend” — can be illegal and break trust. Always ask: did the person say yes to sharing?",
    "info.2.title": "Check the link — not just the sender",
    "info.2.text":
      "Known names and logos can be copied. Hover the link, read the full domain, and be extra skeptical in DMs and group chats.",
    "info.3.title": "Grant the minimum access",
    "info.3.text":
      "A popup asking for “photos” or “camera” on an unknown site is often step one. Say no, close the tab, and ask a trusted adult.",
    "info.4.title": "Make accounts harder to take over",
    "info.4.text":
      "Strong unique passwords and two‑factor authentication (2FA) on email and social media reduce the risk of hijacking and extortion.",
    "info.5.title": "Don’t pay — document — get help",
    "info.5.text":
      "Paying rarely stops threats. Save evidence, block, report in the app, and contact the police (02800) or a trusted adult.",
    "info.red_title": "Red flags — stop before you click",
    "info.red_more": "Show all red flags",
    "info.red1": "Panic messages: “URGENT!!!”, “IS THIS YOU!?”, “delete within 10 min”.",
    "info.red2": "Domains that look real but include extra words or odd characters (e.g. snap-profile-story.net).",
    "info.red3": "Requests for photos, camera, microphone, or “verify account” without a clear reason.",
    "info.red4": "Threats, shame, demands for money, or “more images if not…”.",

    "benefits.eyebrow": "Why act early",
    "benefits.title": "Benefits of acting right away",
    "benefits.desc": "Small actions early can limit damage — for you and others.",
    "benefits.1.title": "Less spreading",
    "benefits.1.text": "The sooner you stop it, the fewer copies and screenshots exist.",
    "benefits.2.title": "Better evidence",
    "benefits.2.text": "Early documentation makes it easier for police and school to follow up.",
    "benefits.3.title": "Less stress",
    "benefits.3.text": "You don’t have to carry it alone when you talk to someone you trust.",
    "benefits.4.title": "Clearer choices",
    "benefits.4.text": "02800 and trusted adults can guide you without guessing what’s right.",

    "risks.eyebrow": "Consequences and choices",
    "risks.title": "What can happen — and what to do immediately",
    "risks.desc": "Each point is a stop‑point: read it, make one safe choice, move on.",
    "risks.1.title": "Links can look completely real",
    "risks.1.text":
      "Attackers copy design, logos and language. What reveals them is often the domain, urgency, and asking for more than needed.",
    "risks.2.title": "One “Allow” can give full access",
    "risks.2.text":
      "Permission to photos or camera on an unknown site can be used for extortion later — sometimes without you noticing right away.",
    "risks.3.title": "Panic is a tool",
    "risks.3.text":
      "When someone wants you to act fast, you think less. Pause for 30 seconds: “Who sent this, and why now?”",
    "risks.4.title": "What you share can’t be “taken back”",
    "risks.4.text":
      "Deleting on your phone doesn’t stop copies, screenshots or reshares. That’s why consent and thinking before sending matters.",
    "risks.5.title": "Extortion feeds on shame",
    "risks.5.text":
      "Many victims pay or send more out of fear. Police advice: don’t pay, save evidence, block, report.",
    "risks.6.title": "Consequences are real",
    "risks.6.text":
      "Rumors, bullying, stress, school impact — and in serious cases investigations. Early help limits the damage.",
    "risks.checklist_title": "Checklist before you click",
    "risks.check1": "Do I know the sender — and does the message fit them?",
    "risks.check2": "Is the domain exactly correct (no extra words, dashes, .net instead of .com)?",
    "risks.check_more": "Show the full checklist",
    "risks.check3": "Is the site asking for photos, camera or login I don’t need?",
    "risks.check4": "Do I feel pressured? → Stop and show it to a trusted adult.",
    "risks.check5": "What’s the worst outcome — and is it worth the risk?",

    "cases.eyebrow": "Examples",
    "cases.title": "How many cases start",
    "cases.desc": "Names and details are changed. The point is to show patterns — not scare.",
    "cases.1.title": "Fake link in chat",
    "cases.1.text":
      "A student got a snap: “Is this you?”. The link led to a fake “story” page asking for images. Saying no avoided panic and possible extortion.",
    "cases.2.title": "Sextortion after “allow”",
    "cases.2.text":
      "After someone granted access to photos, threats for money followed. By not paying, documenting and calling 02800, it stopped before further sharing.",
    "cases.quote":
      "“Many cases start with one click and shame. The earlier we get a report, the better we can limit the damage.”",
    "cases.quote_by": "Investigator, cybercrime",

    "faq.eyebrow": "FAQ",
    "faq.title": "Answers to common questions",
    "faq.desc": "Short answers — call 02800 if you’re unsure about your situation.",
    "faq.q1": "Is it illegal to share intimate images further?",
    "faq.a1":
      "Yes. Sharing without consent can be illegal in Norway — also among teens, even if you “only send it to a friend”.",
    "faq.q2": "What if I already clicked a suspicious link?",
    "faq.a2":
      "Don’t panic. Don’t grant more access, close the page, document (screenshots, URL), and talk to a trusted adult or call 02800.",
    "faq.q3": "Should I pay in sextortion?",
    "faq.a3":
      "No. Paying rarely stops threats and can increase pressure. Save evidence, block, report in the app, and contact the police.",
    "faq.q4": "Can police help without parents knowing?",
    "faq.a4":
      "Call 02800 and ask. They’ll explain what’s possible based on age and situation — you don’t decide alone.",
    "faq.q5": "What’s the difference between 112 and 02800?",
    "faq.a5": "112 is for immediate danger or threats. 02800 is for advice, guidance and reporting cybercrime.",

    "help.eyebrow": "Help and next steps",
    "help.title": "What to do if you were tricked, extorted, or shared something you regret",
    "help.desc":
      "Follow the steps below in order. You haven’t done anything wrong by asking for help. Immediate danger: call 112.",
    "help.contact": "Contact",
    "help.emergency": "Emergency",
    "help.police": "Police",
    "help.contact_text":
      "02800 — guidance, reporting and questions about cybercrime. 112 — when you’re in danger or someone threatens you physically. If you don’t want to call: show this page to a teacher, school nurse, parent or another trusted adult.",
    "help.step1.title": "1. Stop the spread",
    "help.step1.text": "Ask everyone who received it to delete. Don’t reshare or save copies “for later”.",
    "help.step2.title": "2. Save evidence",
    "help.step2.text": "Screenshots, URL, usernames, date and time. Write a short timeline of what you remember.",
    "help.step3.title": "3. Talk to someone you trust",
    "help.step3.text": "You need support before next steps. Many schools have routines for digital violence and sharing.",
    "help.step4.title": "4. Consider reporting to the police",
    "help.step4.text": "Call 02800 to learn what’s possible, without having to file a report immediately.",
    "help.sext_title": "If someone attempts sextortion",
    "help.sext1": "Don’t pay. Don’t send more images.",
    "help.sext2": "Take screenshots and save evidence (usernames, links, timestamps).",
    "help.sext3": "Block the account and report in the app.",
    "help.sext4": "Talk to a trusted adult or contact the police at 02800.",
    "help.sext5": "Police often see that paying doesn’t stop threats — contact 02800 early instead.",
    "help.protect_title": "How to protect yourself",
    "help.prot1": "Use 2FA on email and social media.",
    "help.prot2": "Keep your phone and apps updated.",
    "help.prot3": "Be skeptical of links in messages.",
    "help.prot4": "Grant as few permissions as possible.",
    "help.prot5": "Disable “unknowns can message you” where possible.",
    "help.prot6": "Report and block accounts that pressure you.",
    "help.prot7": "Talk with friends about not sharing others’ images — it’s also your responsibility.",

    "footer.tagline": "Campaign for digital safety and consent",
    "footer.help_link": "Help and next steps",
    "footer.disclaimer": "Information and prevention. Content does not replace legal advice."
  },
  uk: {
    "nav.experience": "Сценарій",
    "nav.cases": "Випадки",
    "nav.threats": "Загрози",
    "nav.about": "Про",
    "nav.report": "Повідомити про шахрайство",
    "nav.language": "Мова",

    "common.more": "Показати більше",
    "common.less": "Приховати",

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
    "report.footer_note": "Якщо ви випадково щось надіслали: зверніться по допомогу якомога раніше — ніколи не буває «запізно».",

    "hero.h1": "Delbart: один клік може змінити все",
    "hero.lead":
      "Один клік по неправильному посиланню або поширення без згоди може вплинути на вас і інших. Тут ви знайдете конкретні поради про фішинг, фейкові посилання та сексторшен — і короткий сценарій, який показує, як це може статися.",
    "hero.motto": "Зупинись. Подумай. Запитай.",
    "hero.cta": "Подивись, як один клік може обманути",
    "hero.card1.title": "Зупини поширення одразу",
    "hero.card1.text":
      "Не пересилай, не зберігай «про всяк випадок» і не коментуй у групах. Попроси того, хто поширив, видалити, і попроси отримувачів зробити так само.",
    "hero.card2.title": "Задокументуй, що сталося",
    "hero.card2.text":
      "Зроби скріншоти повідомлень, посилань, профілів і часу. Не змінюй і не видаляй нічого, доки не поговориш із дорослим, якому довіряєш, або з поліцією.",
    "hero.card3.title": "Ти не мусиш справлятися сам(а)",
    "hero.card3.text": "Негайна небезпека або погрози насильством: 112. Поради та звернення: 02800 (цілодобово).",
    "hero.short_title": "Коротко",
    "hero.short1.label": "Фішинг",
    "hero.short1.text": "фейкові повідомлення або посилання, які змушують клікнути, увійти або надати доступ.",
    "hero.short2.label": "Sextortion",
    "hero.short2.text": "коли погрожують оприлюднити фото/відео, щоб отримати гроші, більше матеріалів або контроль.",
    "hero.short3.label": "Доступи",
    "hero.short3.text": "невідомі сайти й застосунки не повинні мати доступ до фото, камери чи контактів без повної впевненості.",

    "video.eyebrow": "Відео",
    "video.title": "Подивись короткий приклад",
    "video.desc":
      "Хочеш подивитися відео на тему? Натисни, щоб відкрити плеєр. Текст на сторінці короткий — його можна розгорнути, щоб прочитати більше.",
    "video.box_p1":
      "Хочеш провести заняття для дітей та молоді про поширення сексуалізованих зображень? Матеріал «Delbart?» адаптований так, щоб учителі, шкільні медпрацівники та інші дорослі могли провести лекцію.",
    "video.made_by": "Створено",

    "process.eyebrow": "Як користуватися сайтом",
    "process.title": "Три кроки — від розуміння до дії",
    "process.desc":
      "Сайт допомагає розібратися ще до того, як доведеться робити реальний вибір. Використовуй у зручному для тебе порядку.",
    "process.step_label": "Крок",
    "process.step1.title": "Вивчи базу",
    "process.step1.text": "Наслідки, червоні прапорці й чеклист — щоб розпізнавати схеми завчасно.",
    "process.step2.title": "Спробуй сценарій",
    "process.step2.text": "Короткий вигаданий сюжет у чаті. Ти обираєш: ігнорувати, відкрити або надати доступ.",
    "process.step3.title": "Обери наступні дії",
    "process.step3.text": "Допомога, 02800 або дорослий, якому довіряєш. Просити підтримку — це не помилка.",
    "process.for_who": "Для кого це?",
    "process.aud1.label": "Підлітки",
    "process.aud1.text": "перед тим як надсилати, клікати або відповідати на тиск.",
    "process.aud2.label": "Батьки",
    "process.aud2.text": "розмова вдома про згоду і що робити дитині.",
    "process.aud3.label": "Школа",
    "process.aud3.text": "уроки, класні години та цифрова грамотність.",

    "experience.eyebrow": "Інтерактивна вправа",
    "experience.title": "Спробуй фішинг і sextortion — безпечно",
    "experience.desc":
      "Короткий вигаданий сценарій у чаті. Ти обираєш: ігнорувати, відкрити або надати доступ. Жодні реальні дані не збираються — мета навчитися розпізнавати схеми до того, як це станеться насправді.",
    "experience.start": "Почати вправу",
    "experience.close": "Закрити",

    "info.eyebrow": "Цифрова безпека",
    "info.title": "Як захистити себе — і інших",
    "info.desc":
      "Кампанія Delbart про згоду, фейкові посилання та цифровий шантаж. Ось п’ять принципів, які можна застосовувати щодня — до того, як щось станеться.",
    "info.1.title": "Ніколи не поширюй без згоди",
    "info.1.text":
      "Перекидання інтимних фото — навіть одному «другу» — може бути незаконним і руйнує довіру. Завжди запитай: людина дала згоду на поширення?",
    "info.2.title": "Перевір посилання — не лише відправника",
    "info.2.text":
      "Імена та логотипи легко копіюються. Перевір повний домен і будь особливо уважним(ою) у DM та групах.",
    "info.3.title": "Надавай мінімум доступів",
    "info.3.text":
      "Попап із проханням доступу до «фото» чи «камери» на невідомому сайті часто є першим кроком атаки. Відмовся, закрий вкладку і звернися до дорослого.",
    "info.4.title": "Ускладни злам акаунтів",
    "info.4.text":
      "Сильні унікальні паролі та двофакторна автентифікація (2FA) для пошти й соцмереж зменшують ризик зламу та шантажу.",
    "info.5.title": "Не плати — збережи докази — отримай допомогу",
    "info.5.text":
      "Оплата рідко зупиняє погрози. Збережи докази, заблокуй, поскаржся в застосунку та звернись до поліції (02800) або до дорослого, якому довіряєш.",
    "info.red_title": "Червоні прапорці — зупинись перед кліком",
    "info.red_more": "Показати всі прапорці",
    "info.red1": "Повідомлення з панікою: «ТЕРМІНОВО!!!», «ЦЕ ТИ!?», «видали за 10 хв».",
    "info.red2": "Домени, схожі на справжні, але з зайвими словами/символами (наприклад snap-profile-story.net).",
    "info.red3": "Запити на фото, камеру, мікрофон або «підтвердження акаунта» без зрозумілої причини.",
    "info.red4": "Погрози, сором, вимоги грошей або «ще фото, інакше…».",

    "benefits.eyebrow": "Чому важливо діяти рано",
    "benefits.title": "Переваги швидких дій",
    "benefits.desc": "Невеликі дії на початку можуть зменшити шкоду — для тебе й інших.",
    "benefits.1.title": "Менше поширення",
    "benefits.1.text": "Чим раніше зупиниш, тим менше копій і скріншотів залишиться.",
    "benefits.2.title": "Кращі докази",
    "benefits.2.text": "Раннє документування допомагає поліції та школі реагувати.",
    "benefits.3.title": "Менше стресу",
    "benefits.3.text": "Тобі не доведеться нести це самому(самій), якщо поговориш із тим, кому довіряєш.",
    "benefits.4.title": "Зрозуміліші рішення",
    "benefits.4.text": "02800 і довірені дорослі допоможуть без «вгадувань», що правильно.",

    "risks.eyebrow": "Наслідки та вибір",
    "risks.title": "Що може статися — і що робити одразу",
    "risks.desc": "Кожен пункт — це стоп‑сигнал: прочитай, зроби безпечний вибір і рухайся далі.",
    "risks.1.title": "Посилання можуть виглядати справжніми",
    "risks.1.text":
      "Зловмисники копіюють дизайн, логотипи та мову. Викриває їх домен, поспіх і вимоги зайвого.",
    "risks.2.title": "Одне «Allow» може дати повний доступ",
    "risks.2.text":
      "Доступ до фото або камери на невідомому сайті може потім використовуватися для шантажу — іноді непомітно одразу.",
    "risks.3.title": "Паніка — це інструмент",
    "risks.3.text":
      "Коли тебе кваплять, ти думаєш гірше. Пауза 30 секунд: «Хто це надіслав і чому саме зараз?»",
    "risks.4.title": "Те, що надіслав(ла), не можна «повернути»",
    "risks.4.text":
      "Видалення у тебе не зупиняє копії, скріншоти чи подальше поширення. Тому важливі згода та обережність.",
    "risks.5.title": "Шантаж тримається на соромі",
    "risks.5.text":
      "Багато жертв платять або надсилають більше через страх. Порада поліції: не плати, збережи докази, блокуй, скаржся.",
    "risks.6.title": "Наслідки реальні",
    "risks.6.text":
      "Плітки, булінг, стрес, проблеми в школі — а інколи й розслідування. Рання допомога зменшує шкоду.",
    "risks.checklist_title": "Чеклист перед кліком",
    "risks.check1": "Чи знаю я відправника — і чи схоже це на нього/неї?",
    "risks.check2": "Чи домен точно правильний (без зайвих слів, дефісів, .net замість .com)?",
    "risks.check_more": "Показати весь чеклист",
    "risks.check3": "Чи сайт просить фото/камеру/логін, які не потрібні?",
    "risks.check4": "Чи я відчуваю тиск? → Зупинись і покажи дорослому.",
    "risks.check5": "Який найгірший результат — і чи варто ризикувати?",

    "cases.eyebrow": "Приклади",
    "cases.title": "Як починаються багато випадків",
    "cases.desc": "Імена та деталі змінені. Мета — показати схеми, а не налякати.",
    "cases.1.title": "Фейкове посилання в чаті",
    "cases.1.text":
      "Учень(учениця) отримав(ла) snap: «Це ти?». Посилання вело на фейкову сторінку «story», яка просила фото. Відмова допомогла уникнути паніки й можливого шантажу.",
    "cases.2.title": "Sextortion після «allow»",
    "cases.2.text":
      "Після надання доступу до фото з’явилися погрози грошей. Не платити, зберегти докази та подзвонити 02800 допомогло зупинити ситуацію.",
    "cases.quote":
      "«Багато справ починаються з одного кліку і сорому. Чим раніше ми отримуємо повідомлення, тим краще можемо обмежити шкоду.»",
    "cases.quote_by": "Слідчий, кіберзлочинність",

    "faq.eyebrow": "Питання та відповіді",
    "faq.title": "Відповіді на популярні питання",
    "faq.desc": "Короткі відповіді — телефонуйте 02800, якщо не впевнені щодо своєї ситуації.",
    "faq.q1": "Чи незаконно поширювати інтимні фото далі?",
    "faq.a1":
      "Так. Поширення без згоди може бути незаконним у Норвегії — також серед підлітків, навіть якщо «лише другу».",
    "faq.q2": "Що робити, якщо я вже натиснув(ла) підозріле посилання?",
    "faq.a2":
      "Не панікуй. Не давай більше доступів, закрий сторінку, задокументуй (скріншоти, URL) і поговори з дорослим або подзвони 02800.",
    "faq.q3": "Чи треба платити при sextortion?",
    "faq.a3":
      "Ні. Оплата рідко зупиняє погрози і може посилити тиск. Збережи докази, блокуй, скаржся та звернись до поліції.",
    "faq.q4": "Чи може поліція допомогти, щоб батьки не дізналися?",
    "faq.a4":
      "Подзвони 02800 і запитай. Вони пояснять, що можливо з огляду на вік та ситуацію — ти не вирішуєш це сам(а).",
    "faq.q5": "Чим відрізняється 112 від 02800?",
    "faq.a5": "112 — для негайної небезпеки або погроз. 02800 — для порад, консультацій і повідомлень про кіберзлочини.",

    "help.eyebrow": "Допомога та наступні кроки",
    "help.title": "Що робити, якщо тебе обманули, шантажують або ти надіслав(ла) те, про що шкодуєш",
    "help.desc":
      "Виконуй кроки нижче по порядку. Просити допомогу — це нормально. Негайна небезпека: телефонуй 112.",
    "help.contact": "Контакти",
    "help.emergency": "Екстрено",
    "help.police": "Поліція",
    "help.contact_text":
      "02800 — поради, звернення та питання про кіберзлочини. 112 — коли ти в небезпеці або є фізичні погрози. Якщо не хочеш дзвонити: покажи цю сторінку вчителю, шкільному медпрацівнику, батькам або іншому довіреному дорослому.",
    "help.step1.title": "1. Зупини поширення",
    "help.step1.text": "Попроси всіх, хто отримав, видалити. Не поширюй далі і не зберігай копії «на потім».",
    "help.step2.title": "2. Збережи докази",
    "help.step2.text": "Скріншоти, URL, нікнейми, дата і час. Зроби коротку хронологію того, що пам’ятаєш.",
    "help.step3.title": "3. Поговори з тим, кому довіряєш",
    "help.step3.text": "Підтримка важлива перед наступними кроками. У багатьох школах є процедури щодо цифрового насильства та поширення.",
    "help.step4.title": "4. Розглянь звернення до поліції",
    "help.step4.text": "Подзвони 02800, щоб дізнатися, що можливо, не подаючи заяву одразу.",
    "help.sext_title": "Якщо хтось намагається sextortion",
    "help.sext1": "Не плати. Не надсилай більше фото.",
    "help.sext2": "Зроби скріншоти та збережи докази (ніки, посилання, час).",
    "help.sext3": "Заблокуй акаунт і поскаржся в застосунку.",
    "help.sext4": "Поговори з дорослим або звернися до поліції за номером 02800.",
    "help.sext5": "Поліція часто бачить, що оплата не зупиняє погрози — краще звертайся до 02800 рано.",
    "help.protect_title": "Як захистити себе",
    "help.prot1": "Увімкни 2FA для пошти та соцмереж.",
    "help.prot2": "Оновлюй телефон і застосунки.",
    "help.prot3": "Будь обережним(ою) з посиланнями в повідомленнях.",
    "help.prot4": "Надавай мінімум дозволів.",
    "help.prot5": "Вимкни «незнайомі можуть писати», якщо можливо.",
    "help.prot6": "Скаржся і блокуй акаунти, які тиснуть на тебе.",
    "help.prot7": "Поговори з друзями про те, що не можна поширювати чужі фото — це теж відповідальність.",

    "footer.tagline": "Кампанія про цифрову безпеку та згоду",
    "footer.help_link": "Допомога та наступні кроки",
    "footer.disclaimer": "Інформація та профілактика. Матеріали не замінюють юридичну консультацію."
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
