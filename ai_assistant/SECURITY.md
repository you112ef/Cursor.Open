# Security Policy

We take the security of this project seriously and appreciate coordinated disclosure.

## Supported Versions
- Production support: latest `main` branch and tagged releases built from it
- Older versions: best-effort only (please upgrade when possible)

## Reporting a Vulnerability
- Email: security@example.com
- Please include: affected version/commit, impact, reproduction steps/PoC, logs, and any mitigations
- Optional: request a PGP key if needed; we will provide one for encrypted reports

## Response Targets (SLA)
- Acknowledge receipt: within 72 hours
- Initial triage and severity assignment: within 5 business days
- Remediation target (guideline; may vary by complexity):
  - Critical (RCE/credential compromise): 7 days
  - High (privilege escalation/data exfiltration): 14 days
  - Medium: 30–60 days
  - Low/Informational: next planned release

## Coordinated Disclosure
- Please avoid public disclosure until a fix is available and users have a reasonable update window (typically up to 90 days)
- We will provide updates on progress and expected timelines

## Safe Harbor
- If you make a good-faith effort to comply with this policy while researching and reporting, we will consider your activities authorized and will not pursue legal action
- Do not exploit beyond what is necessary to demonstrate impact; avoid accessing, altering, or destroying data

## Scope
- In scope: code and configurations in this repository and deployed instances you explicitly own or are authorized to test
- Out of scope (non-exhaustive):
  - Denial of Service (volumetric), spam, or social engineering
  - Physical security issues
  - Vulnerabilities requiring privileged/local access without a demonstrable impact on this project
  - Rate-limit bypasses without data impact, clickjacking without sensitive action, or missing security headers with negligible risk

## Credit and Acknowledgements
- With your permission, we will credit reporters in release notes once a fix is shipped

Thank you for helping keep the community safe. Reports: security@example.com