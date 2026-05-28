import type { VercelRequest, VercelResponse } from "@vercel/node";
import { cleanClientMessages, runLiveSupportChat } from "./chatCore";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

  let body: unknown = req.body as unknown;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  const cleaned = cleanClientMessages((body as any)?.messages);
  if (cleaned.length === 0) return res.status(400).json({ error: "Empty messages" });

  try {
    const lang = typeof (body as any)?.lang === "string" ? ((body as any).lang as string) : undefined;
    const { text } = await runLiveSupportChat({ apiKey, messages: cleaned, lang });
    return res.status(200).json({ text });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "OpenAI error" });
  }
}
