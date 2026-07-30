# Known Limitations

1. Legal privacy/terms pages remain interim until counsel approves the package in `docs/legal/` (privacy notice, DPA, FERPA coded-ID opinion).
1b. Communication receipt e-sign is implemented; counsel should still confirm legal effect. Requires SQL `202607300014_communication_esign.sql`.
2. No paid error-monitoring SaaS is configured (awaiting approval).
3. Administrative Intelligence is documentation-oriented and does not assert legal sufficiency.
4. Small-group suppression reduces but does not eliminate all inference risk.
5. Dependency advisories in Next.js transitive packages await upstream fixes.
6. Live domain cutover requires product-owner Vercel, Supabase, and GoDaddy access if not present in the agent environment.
7. Comprehensive product-owner UAT occurs after deployment by design.
