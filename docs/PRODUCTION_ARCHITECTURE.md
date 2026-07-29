# Production Architecture

## Stack

1. GitHub source control
2. Vercel Next.js hosting
3. Supabase PostgreSQL, Auth, Storage
4. GoDaddy DNS for SLCintelligence.com

## Environments

| Environment | App URL | Database |
| --- | --- | --- |
| Local | `http://localhost:3000` | Local Postgres / local Supabase |
| Vercel Preview | Preview URL | Non-production Supabase project |
| Production | `https://slcintelligence.com` | Dedicated production Supabase project |

Do not point local or preview at production data unless the product owner explicitly approves and documents the exception.

## Canonical domain

- Production domain: `SLCintelligence.com`
- Canonical URL: `https://slcintelligence.com`
- `www.slcintelligence.com` should redirect to the apex domain
