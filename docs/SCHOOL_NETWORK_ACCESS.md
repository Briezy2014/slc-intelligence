# School network access (Fortinet / SSL inspection)

## Important boundary

SLC Intelligence cannot install Fortinet trust certificates on district Chromebooks and cannot create SSL-inspection exceptions on a district FortiGate. Those controls belong to **district IT**.

What we provide on our side:

- A public IT playbook page: `/school-network-access`
- Confirmed production domains with valid public certificates (Let’s Encrypt via Vercel)
- An allowlist districts can paste into Fortinet / web-filter SSL inspection exceptions

## Symptom

Chrome on a school Chromebook shows:

- `NET::ERR_CERT_AUTHORITY_INVALID`
- Message naming **Fortinet** (certificate not installed / not trusted)

The site usually loads on home Wi‑Fi or phone hotspot.

## Confirm our certificate is healthy (external check)

From a network outside the district:

```bash
curl -I https://www.slcintelligence.com
openssl s_client -connect www.slcintelligence.com:443 -servername www.slcintelligence.com </dev/null
```

Expected: HTTP 200 and issuer **Let’s Encrypt** (not Fortinet).

## District IT options (either one fixes Chromebook access)

### Option A — Preferred for managed Chromebooks: trust Fortinet CA

1. Export the FortiGate SSL deep-inspection CA (`Fortinet_CA_SSL` or the custom CA used for inspection).
2. In **Google Admin**, push that CA to managed Chromebooks as a trusted authority.
3. Have staff sign out/in (or reboot) so the profile picks up the cert.

### Option B — Inspection exception / allowlist

Exempt these hosts from HTTPS deep inspection / SSL inspection (exact FortiGate path varies by version; typically SSL/SSH Inspection profile or web filter HTTPS inspection exceptions):

| Host / pattern            | Purpose                                                     |
| ------------------------- | ----------------------------------------------------------- |
| `slcintelligence.com`     | Apex domain                                                 |
| `www.slcintelligence.com` | Canonical web app                                           |
| `*.vercel.app`            | Preview deployments (optional; not required for production) |
| `*.supabase.co`           | Auth / API for the production Supabase project              |

Also allow outbound HTTPS `443` to those hosts if a firewall deny rule exists.

## Staff workaround while IT works

Use a personal hotspot / home network temporarily. Do **not** ask staff to click through certificate warnings on managed devices.

## Support copy for districts

Share: `https://www.slcintelligence.com/school-network-access`
