# Add AI_API_KEY (OpenAI API — not ChatGPT Plus)

## Important: ChatGPT subscription cannot sync

A **ChatGPT Plus / ChatGPT app login cannot power SLC Intelligence**.

| What you have                         | Works with SLC? | Why                                     |
| ------------------------------------- | --------------- | --------------------------------------- |
| ChatGPT Plus / Team (chat.openai.com) | **No**          | Consumer login, not an API key          |
| OpenAI **API key** (`sk-...`)         | **Yes**         | Platform billing key for model requests |

Get an API key here: https://platform.openai.com/api-keys  
(You may need a separate OpenAI Platform account / billing, even if you already pay for ChatGPT Plus.)

## What the key improves

| Tool                    | Without key                       | With `AI_API_KEY`                       |
| ----------------------- | --------------------------------- | --------------------------------------- |
| Instructional Packets   | Local student pages + SVG visuals | Same local generator (visual PDF print) |
| Worksheet Generator     | Local packet drafts               | Stronger model-written worksheet text   |
| AI Assist / translation | Local catalogs / drafts           | Model-enriched drafts when available    |

**Best packet printing today:** Instructional Packets → **Download as PDF** (print dialog → Save as PDF). Visuals (coins, space theme, etc.) are included.

**Best AI-written worksheet pages:** Worksheet Generator + `AI_API_KEY` + Print / Save as PDF.

## Exact Vercel steps (production — slcintelligence.com)

1. Open [Vercel Dashboard](https://vercel.com) → project **slc-intelligence**.
2. Go to **Settings** → **Environment Variables**.
3. Add these four variables:

| Name                | Value                                         | Environments                         |
| ------------------- | --------------------------------------------- | ------------------------------------ |
| `AI_API_KEY`        | your key from platform.openai.com (`sk-...`)  | Production (and Preview if you want) |
| `AI_API_BASE_URL`   | `https://api.openai.com/v1`                   | same                                 |
| `AI_MODEL`          | `gpt-4o-mini` (or `gpt-4o` for richer drafts) | same                                 |
| `AI_ASSIST_ENABLED` | `true`                                        | same                                 |

4. Click **Save**.
5. Go to **Deployments** → open the latest **Production** deployment → **Redeploy**  
   (Required — env vars do not apply until redeploy.)

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

1. Open **Worksheet Generator** → generate a packet → use **Download as PDF**.
2. Open **Instructional Packets** → generate → **Download as PDF** (visuals print even without a key).
3. Open **AI Assist** → generate a draft (model assist only when the key is present after redeploy).

## Optional stronger model

For richer worksheet drafts, set:

```bash
AI_MODEL=gpt-4o
```

Then redeploy again. This uses more OpenAI Platform credits than `gpt-4o-mini`.
