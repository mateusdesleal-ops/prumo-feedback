// Prumo Feedback · token temporário para a chamada de voz em tempo real (Gemini Live)
// A chave real fica no servidor; o app recebe um token de uso único, válido por poucos minutos.
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const SESSOES_DIA = Number(Deno.env.get("LIVE_DAILY_SESSIONS") ?? "40");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "metodo" }, 405);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
  const { data: u } = await admin.auth.getUser(jwt);
  const user = u?.user;
  if (!user) return json({ error: "nao_autenticado" }, 401);

  let body: { action?: string; session_id?: number; seconds?: number; scenario?: string } = {};
  try { body = await req.json(); } catch { /* corpo opcional */ }

  // encerrar sessão: registra a duração (para controle de minutos)
  if (body.action === "end" && body.session_id) {
    const s = Math.max(0, Math.min(3600, Math.round(Number(body.seconds) || 0)));
    await admin.from("sim_sessions").update({ seconds: s }).eq("id", body.session_id).eq("user_id", user.id);
    return json({ ok: true });
  }

  const desde = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin.from("sim_sessions").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("started_at", desde);
  if ((count ?? 0) >= SESSOES_DIA) return json({ error: "limite_diario" }, 429);

  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return json({ error: "sem_chave_gemini" }, 500);
  const model = Deno.env.get("GEMINI_LIVE_MODEL") ?? "gemini-3.8-live";

  const agora = Date.now();
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/auth_tokens", {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      uses: 1,
      expireTime: new Date(agora + 30 * 60 * 1000).toISOString(),
      newSessionExpireTime: new Date(agora + 2 * 60 * 1000).toISOString(),
    }),
  });
  if (!res.ok) return json({ error: `gemini_${res.status}`, detalhe: (await res.text()).slice(0, 300) }, 502);
  const tok = await res.json();

  const { data: sess } = await admin.from("sim_sessions").insert({ user_id: user.id, scenario: String(body.scenario ?? "").slice(0, 80) }).select("id").single();
  return json({ token: tok.name, model, session_id: sess?.id ?? null });
});
