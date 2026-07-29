# Incident Response Guide

1. Contain: revoke compromised sessions/keys; take broken deployment offline if needed.
2. Preserve evidence with sanitized logs (no student narrative).
3. Assess tenant/student exposure scope.
4. Notify the product owner immediately for suspected data exposure.
5. Remediate with least-destructive fix; prefer forward fix + redeploy.
6. Verify isolation with targeted authz checks after remediation.
7. Document timeline, impact, and follow-up actions in the post-launch backlog.

Support triage should classify reports using the issue template and severity definitions in `POST_LAUNCH_BACKLOG.md`.
