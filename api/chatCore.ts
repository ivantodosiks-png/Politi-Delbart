import OpenAI from "openai";

export type ClientMessage = { role: "user" | "assistant"; content: string };

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function cleanClientMessages(input: unknown): ClientMessage[] {
  if (!Array.isArray(input)) return [];

  return input
    .slice(-20)
    .map((m) => ({
      role: (m as any)?.role,
      content: (m as any)?.content
    }))
    .filter((m) => (m.role === "user" || m.role === "assistant") && isNonEmptyString(m.content))
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }));
}

export async function runLiveSupportChat(params: {
  apiKey: string;
  messages: ClientMessage[];
  lang?: string;
}): Promise<{ text: string }> {
  const { apiKey, messages, lang } = params;
  const client = new OpenAI({ apiKey });

  const system =
    lang === "no"
      ? "Du er en vennlig live support-assistent for et politinært nettsted om digital sikkerhet. Svar kort, konkret og trygt. Ved akutt fare: ring 112. Ved råd/veiledning og anmeldelse i Norge: 02800. Ved sextortion: ikke betal, ta skjermbilder/sikre bevis, blokkér/rapporter, og kontakt politiet."
      : lang === "uk"
        ? "Ти — дружній асистент лайв‑підтримки для освітнього сайту про цифрову безпеку. Відповідай коротко й практично. Якщо є негайна небезпека — телефонуй на екстрені служби. Якщо згадується sextortion: не плати, збережи докази (скріни, ніки, посилання, час), заблокуй/поскаржся та звернись до поліції."
        : "You are a friendly live support assistant for a police digital-safety educational website. Keep answers short, practical, and safe. If the user is in immediate danger, tell them to call local emergency services. If they mention sextortion: do not pay, save evidence, block/report, and contact the police.";

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [{ role: "system", content: system }, ...messages]
  });

  const text =
    response.output_text && response.output_text.trim().length > 0
      ? response.output_text.trim()
      : "Sorry — I couldn't generate a response right now.";

  return { text };
}

