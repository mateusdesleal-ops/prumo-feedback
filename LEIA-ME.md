# Prumo Feedback

Prepare, pratique e conduza conversas que desenvolvem pessoas.
Roteiros com IA, simulador por voz, devolutivas técnicas, 1:1, PDI e mentor, para líderes e RH.

## Endereços

- App (computador e celular): https://mateusdesleal-ops.github.io/prumo-feedback/
- Visão do líder: https://mateusdesleal-ops.github.io/prumo-feedback/#lider
- Visão do RH: https://mateusdesleal-ops.github.io/prumo-feedback/#rh

## Como funciona a publicação

Cada atualização enviada para a branch `main` é publicada sozinha pelo GitHub Pages (aba **Actions**, fluxo "Publicar app"), em cerca de 2 minutos.

## Pastas

| Pasta | O que tem |
|---|---|
| `web/` | O app publicado (gerado a partir de `src/`). |
| `src/` | Código-fonte do app. `python3 src/build_web.py` gera `web/index.html`. |
| `supabase/migrations/` | Tabelas e regras de segurança (cada usuário só vê os próprios dados). |
| `supabase/functions/ai` | IA dos textos (Gemini, com Groq de reserva). |
| `supabase/functions/live-token` | Token temporário da chamada de voz em tempo real. |

## Configuração no Supabase (projeto `prumo-lider`)

- **Segredos (Edge Functions → Secrets):** `GEMINI_API_KEY` (obrigatório), `GROQ_API_KEY` (opcional, reserva).
- **Authentication → URL Configuration:** Site URL `https://mateusdesleal-ops.github.io/prumo-feedback/` e Redirect URL `https://mateusdesleal-ops.github.io/prumo-feedback/**`.

Configurações opcionais: `AI_PROVIDER` (`gemini` ou `groq`), `GEMINI_MODEL`, `GEMINI_LIVE_MODEL`, `GROQ_MODEL`, `AI_DAILY_LIMIT`, `LIVE_DAILY_SESSIONS`.

## Segurança

Nenhuma chave secreta fica neste repositório. A chave pública do Supabase em `web/config.js` pode ser pública: a proteção vem das regras do banco. As chaves de IA ficam só nos segredos do Supabase.

Durante os testes no plano gratuito do Gemini, use apenas casos fictícios.
