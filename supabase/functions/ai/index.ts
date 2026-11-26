// Prumo Feedback · função de IA para textos (feedback, mentor, avaliação, personagem em modo texto etc.)
// Motor principal: Gemini. Reserva automática: Groq. Trocar motor: segredo AI_PROVIDER = "gemini" | "groq".
import { createClient } from "npm:@supabase/supabase-js@2";

const ETICA = `Você é a inteligência do app Prumo Feedback, voltado a gestores e profissionais de RH brasileiros. Regras: escreva em português do Brasil; não invente fatos além dos fornecidos; trate hipóteses como hipóteses; foque em comportamentos observáveis; não diagnostique pessoas, não infira personalidade, emoções reais ou condições de saúde; não recomende demissões, promoções ou punições automáticas; não incentive assédio ou constrangimento; lembre que decisões de RH e jurídicas são humanas. Formato: texto simples, sem markdown com asteriscos ou #; use títulos curtos em linhas próprias terminados em dois-pontos e listas com "- ".`;

const LIMITE_DIA = Number(Deno.env.get("AI_DAILY_LIMIT") ?? "400");
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...CORS, "Content-Type": "application/json" } });

type Req = { task?: string; prompt?: string; json?: boolean; tier?: "quick" | "default" | "complex"; persona?: boolean };

async function gemini(r: Req): Promise<{ text: string; model: string }> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) throw new Error("sem_chave_gemini");
  const models = [...new Set([Deno.env.get("GEMINI_MODEL") ?? "gemini-4-hydrogen", "gemini-4-hydrogen", "gemini-3.6-flash", "gemini-flash-latest"])];
  let last = "";
  for (const model of models) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: r.persona ? "Responda apenas como o personagem descrito, em português do Brasil." : ETICA }] },
        contents: [{ role: "user", parts: [{ text: r.prompt }] }],
        generationConfig: {
          temperature: r.persona ? 0.9 : 0.6,
          maxOutputTokens: r.tier === "quick" ? 1500 : 8000,
          ...(r.json ? { responseMimeType: "application/json" } : {}),
        },
      }),
    });
    if (res.ok) {
      const d = await res.json();
      const text = (d?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
      if (text) return { text, model };
      last = "resposta_vazia";
    } else {
      last = `gemini_${res.status}`;
      if (res.status !== 404 && res.status !== 400) break; // tenta o próximo modelo se o nome não existir
    }
  }
  throw new Error(last);
}

async function groq(r: Req): Promise<{ text: string; model: string }> {
  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) throw new Error("sem_chave_groq");
  const model = Deno.env.get("GROQ_MODEL") ?? "openai/gpt-oss-120b";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: r.persona ? "Responda apenas como o personagem descrito, em português do Brasil." : ETICA },
        { role: "user", content: r.prompt },
      ],
      temperature: r.persona ? 0.9 : 0.6,
      max_tokens: r.tier === "quick" ? 400 : 2500,
      ...(r.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`groq_${res.status}`);
  const d = await res.json();
  return { text: d?.choices?.[0]?.message?.content ?? "", model };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "metodo" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
  const { data: u } = await admin.auth.getUser(jwt);
  const user = u?.user;
  if (!user) return json({ error: "nao_autenticado" }, 401);

  let body: Req;
  try { body = await req.json(); } catch { return json({ error: "corpo_invalido" }, 400); }
  if (!body.prompt || typeof body.prompt !== "string" || body.prompt.length > 60000) return json({ error: "prompt_invalido" }, 400);

  const desde = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin.from("ai_usage").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", desde);
  if ((count ?? 0) >= LIMITE_DIA) return json({ error: "limite_diario" }, 429);

  const ordem = (Deno.env.get("AI_PROVIDER") ?? "gemini") === "groq" ? [groq, gemini] : [gemini, groq];
  const erros: string[] = [];
  for (const motor of ordem) {
    try {
      const out = await motor(body);
      await admin.from("ai_usage").insert({ user_id: user.id, task: body.task ?? "geral", provider: motor.name, model: out.model, ok: true });
      return json({ text: out.text, provider: motor.name, model: out.model });
    } catch (e) {
      erros.push(String((e as Error).message));
    }
  }
  await admin.from("ai_usage").insert({ user_id: user.id, task: body.task ?? "geral", provider: "nenhum", ok: false });
  const limite = erros.some((e) => e.endsWith("_429"));
  return json({ error: limite ? "limite_fornecedor" : "falha_ia", detalhes: erros }, limite ? 429 : 502);
});
