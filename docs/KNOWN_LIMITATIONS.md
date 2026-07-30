# Known Limitations

1. Legal privacy/terms pages remain interim until counsel approves the package in `docs/legal/` (privacy notice, DPA, FERPA coded-ID opinion, e-sign communications spec).
   1b. Communication receipt e-sign / parent “I have read this” acknowledgment is implemented; counsel should still confirm legal effect. Requires SQL `202607300014_communication_esign.sql` and `202607300015_staff_notifications_parent_read.sql`. Staff notification is in-app (not automatic staff email).
   1c. Communication translation, parent acknowledgements, 504/Gifted/EL drafts, and district blank templates require SQL migration `202607300013_comms_translation_plans_district_forms.sql`. Translation needs AI Assist model config for automatic translate.
2. No paid error-monitoring SaaS is configured (awaiting approval).
3. Administrative Intelligence is documentation-oriented and does not assert legal sufficiency.
4. Small-group suppression reduces but does not eliminate all inference risk.
5. Dependency advisories in Next.js transitive packages await upstream fixes.
6. Live domain cutover requires product-owner Vercel, Supabase, and GoDaddy access if not present in the agent environment.
7. Comprehensive product-owner UAT occurs after deployment by design.
