// Prumo Feedback · voz natural (Gemini TTS) para o modo alternativo do Simulador e o botão "Ouvir"
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-region",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const VOZES = new Set(["Puck", "Aoede", "Charon", "Leda", "Fenrir", "Kore", "Zephyr", "Orus", "Callirrhoe", "Autonoe", "Enceladus", "Iapetus", "Umbriel", "Algieba", "Despina", "Erinome", "Algenib", "Rasalgethi", "Laomedeia", "Achernar", "Alnilam", "Schedar", "Gacrux", "Pulcherrima", "Achird", "Zubenelgenubi", "Vindemiatrix", "Sadachbia", "Sadaltager", "Sulafat"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { ...CORS, "Access-Control-Allow-Headers": req.headers.get("access-control-request-headers") ?? CORS["Access-Control-Allow-Headers"], "Access-Control-Max-Age": "86400" } });
  if (req.method !== "POST") return json({ error: "metodo" }, 405);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: u } = await admin.auth.getUser((req.headers.get("Authorization") ?? "").replace("Bearer ", ""));
  if (!u?.user) return json({ error: "nao_autenticado" }, 401);

  let b: { text?: string; voice?: string; style?: string } = {};
  try { b = await req.json(); } catch { return json({ error: "corpo_invalido" }, 400); }
  const text = String(b.text ?? "").slice(0, 1200).trim();
  if (!text) return json({ error: "texto_vazio" }, 400);
  const voice = VOZES.has(String(b.voice)) ? String(b.voice) : "Kore";
  const style = String(b.style ?? "").slice(0, 200);
  const chaves = [["gratis", Deno.env.get("GEMINI_API_KEY")], ["pago", Deno.env.get("GEMINI_API_KEY_PAGO")]].filter((c) => c[1]) as string[][];
  if (!chaves.length) return json({ error: "sem_chave_gemini" }, 500);

  const prompt = `Fale em português do Brasil, com naturalidade de uma conversa real ao telefone, sem soar como leitura${style ? `, ${style}` : ""}:\n${text}`;
  const models = [Deno.env.get("GEMINI_TTS_MODEL") ?? "gemini-3.5-flash-tts", "gemini-flash-tts-latest", "gemini-2.5-flash-preview-tts", "gemini-2.5-pro-preview-tts"].filter((m, i, a) => a.indexOf(m) === i);
  const erros: string[] = [];
  for (const [plano, key] of chaves) for (const model of models) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
      }),
    });
    if (res.ok) {
      const d = await res.json();
      const part = (d?.candidates?.[0]?.content?.parts ?? []).find((p: { inlineData?: { data?: string } }) => p.inlineData?.data);
      if (part) {
        if (plano === "pago") await admin.from("ai_usage").insert({ user_id: u.user.id, task: "tts", provider: "gemini_pago", model, ok: true });
        return json({ audio: part.inlineData.data, mime: part.inlineData.mimeType ?? "audio/L16;rate=24000", model, plano });
      }
      erros.push(`vazio:${plano}:${model}`);
    } else {
      erros.push(`${plano}_${res.status}:${model}:${(await res.text()).replace(/\s+/g, " ").slice(0, 80)}`);
    }
  }
  console.error("falha_tts", erros.join(" | "));
  await admin.from("ai_usage").insert({ user_id: u.user.id, task: "tts", provider: "nenhum", model: erros.join(" | ").slice(0, 900), ok: false });
  return json({ error: "falha_tts", detalhes: erros }, 502);
});
