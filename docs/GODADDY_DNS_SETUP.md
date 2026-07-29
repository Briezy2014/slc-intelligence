# GoDaddy DNS Setup

Production domain: `SLCintelligence.com`  
Canonical URL: `https://slcintelligence.com`

## Process

1. In Vercel, add `slcintelligence.com` and `www.slcintelligence.com`.
2. Copy the exact DNS records Vercel displays (A/ALIAS/CNAME/TXT as shown).
3. In GoDaddy DNS for the domain:
   - Add or update only the web records Vercel requires.
   - Remove conflicting web-hosting A/CNAME records after documenting them.
   - Preserve MX, SPF, DKIM, and DMARC email records.
4. Do not replace nameservers unless necessary and explicitly approved.
5. Wait for DNS propagation.
6. Verify:
   - `https://slcintelligence.com` loads
   - `https://www.slcintelligence.com` redirects to apex
   - No redirect loop
   - Certificate is valid
   - Auth callback and password-reset URLs work

## Record table

Fill with the exact values from Vercel at cutover time:

| Host | Type | Value | TTL | Source |
| --- | --- | --- | --- | --- |
| `@` | A / ALIAS | _from Vercel_ | default | Vercel domains UI |
| `www` | CNAME | _from Vercel_ | default | Vercel domains UI |
| optional verification | TXT | _from Vercel_ | default | Vercel domains UI |
