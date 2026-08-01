# Add AI_API_KEY (optional model drafts)

AI Assist already works without a key (local catalogs). Add `AI_API_KEY` only if you want stronger model-enriched drafts.

## Vercel (production — slcintelligence.com)

1. Open [Vercel Dashboard](https://vercel.com) → project **slc-intelligence**.
2. Go to **Settings** → **Environment Variables**.
3. Add:

| Name                | Value                                 | Environments                         |
| ------------------- | ------------------------------------- | ------------------------------------ |
| `AI_API_KEY`        | your OpenAI API key (`sk-...`)        | Production (and Preview if you want) |
| `AI_API_BASE_URL`   | `https://api.openai.com/v1`           | same                                 |
| `AI_MODEL`          | `gpt-4o-mini` (or another chat model) | same                                 |
| `AI_ASSIST_ENABLED` | `true`                                | same                                 |

4. Click **Save**.
5. Go to **Deployments** → open the latest Production deployment → **Redeploy** (required so the new env vars load).

Get an OpenAI key at: https://platform.openai.com/api-keys

## Local development

In `.env.local` (never commit real keys):

```bash
AI_ASSIST_ENABLED=true
AI_API_KEY=sk-your-key-here
AI_API_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

Restart `npm run dev`.

## Check it worked

1. Open **AI Assist**.
2. Generate a draft.
3. With a key + redeploy, drafts can use model assist. Without a key, local drafts still work — no warning banner.
