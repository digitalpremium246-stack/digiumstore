# Railway Environment Variables Checklist

Set these in Railway service Variables. Never commit actual values.

## Required for application startup / core features

- [ ] `DATABASE_URL` — Railway PostgreSQL connection string.
- [ ] `NEXTAUTH_SECRET` — long random secret.
- [ ] `NEXTAUTH_URL` — canonical public HTTPS URL.

## Payments

- [ ] `MIDTRANS_SERVER_KEY`
- [ ] `MIDTRANS_CLIENT_KEY`
- [ ] `MIDTRANS_IS_PRODUCTION` — `false` for sandbox; `true` only after production merchant verification.

## AI

- [ ] `OPENAI_API_KEY` — required for AI Stylist requests.
- [ ] `FASHN_AI_API_KEY` — try-on provider key; the supplied Fashn implementation is still incomplete, see blockers.

## Cloudflare R2

- [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] `R2_ACCESS_KEY_ID`
- [ ] `R2_SECRET_ACCESS_KEY`
- [ ] `R2_BUCKET_NAME`
- [ ] `R2_PUBLIC_URL` — if public asset delivery is configured.

## Rate limiting / shipping

- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `BITESHIP_API_KEY` — Biteship adapter is currently a stub.

Do not paste secret values into chat or commit them to GitHub.
