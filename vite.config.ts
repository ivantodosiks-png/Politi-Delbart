import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { cleanClientMessages, runLiveSupportChat } from "./api/chatCore";

function apiChatDevPlugin(): Plugin {
  return {
    name: "api-chat-dev",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Allow", "POST");
          res.end(JSON.stringify({ error: "Method Not Allowed" }));
          return;
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Missing OPENAI_API_KEY" }));
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          const raw = Buffer.concat(chunks).toString("utf8");
          let body: unknown = {};
          if (raw.length) {
            try {
              body = JSON.parse(raw);
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Invalid JSON body" }));
              return;
            }
          }

          const messages = cleanClientMessages((body as any)?.messages);
          if (messages.length === 0) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Empty messages" }));
            return;
          }

          const lang = typeof (body as any)?.lang === "string" ? ((body as any).lang as string) : undefined;
          const { text } = await runLiveSupportChat({ apiKey, messages, lang });

          res.statusCode = 200;
          res.end(JSON.stringify({ text }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err?.message ?? "Server error" }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (!process.env.OPENAI_API_KEY && env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;

  return {
    plugins: [react(), apiChatDevPlugin()]
  };
});

