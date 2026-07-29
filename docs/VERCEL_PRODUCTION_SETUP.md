# Vercel Production Setup

1. Connect the GitHub repository to a Vercel project.
2. Framework preset: Next.js.
3. Production branch: the approved release branch (commonly `main` after merge).
4. Build command: `npm run build`
5. Install command: `npm ci` or `npm install`
6. Node.js: 22.x recommended to match local CI.
7. Configure production and preview environment variables separately.
8. Deploy and review build logs for secret leakage.
9. Confirm automatic HTTPS.
10. Add domains:
    - `slcintelligence.com`
    - `www.slcintelligence.com`
11. Use Vercel-provided DNS records exactly — do not guess values.
12. Keep rollback available by retaining prior deployments.
