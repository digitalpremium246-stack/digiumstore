# Remaining Blockers — Do Not Treat as Production Ready

## P0 — Must resolve before live production

1. **Dependency installation and build not verified.** `npm install` timed out in the available execution environment. There is no generated `package-lock.json`. Run install in the developer environment, commit the lockfile, then run typecheck and production build.
2. **Prisma schema/migrations unverified.** The schema was merged from conflicting fragments. No migration history was supplied. Validate and create reviewed migrations in staging.
3. **Virtual try-on is not production-integrated.** Fashn API request implementation in the supplied source is commented/incomplete. Demo fallback was disabled; requests will fail until a real provider integration is completed and tested.
4. **User uploads use local disk.** `src/lib/storage.ts` writes under `public/uploads`, which is ephemeral and not durable on Railway. The supplied R2 helper is not wired into the try-on upload flow; signed/public URL strategy and access controls are needed.
5. **AI routing is incomplete.** The router lists model names from different providers but uses the OpenAI SDK for all of them. Provider-specific routing, fallback, usage accounting and error handling need implementation.
6. **Payment lifecycle needs staging tests.** Midtrans checkout and webhook need signature, duplicate-notification, failure/cancel/expire, amount reconciliation and production sandbox tests. Inventory reservation/decrement/restock is not implemented.
7. **Stock check race.** Checkout now validates variant and calculates price server-side, but does not atomically reserve/decrement inventory. Concurrent purchases can oversell.
8. **Authentication / account lifecycle incomplete.** Credentials login exists, but registration, password reset, email verification, rate limiting and role administration are not supplied.
9. **Authorization is incomplete.** Middleware is only a basic route gate. Admin server actions/pages must enforce role checks server-side; do not rely only on middleware.

## P1 — Resolve before public launch

- Shipping adapter in `src/lib/integrations/shipping.ts` deliberately fails closed until the Biteship API integration is implemented.
- R2 helper currently assumes all environment variables are present and has no signed URL/download policy.
- AI stylist API needs robust input validation, authentication/rate limiting, provider failure handling and safe tool-call parsing.
- Ads APIs need validation, access controls for admin writes, pagination and date-window query correctness.
- `prisma/seed.ts` is a one-time sample seed and is not idempotent; do not run repeatedly against production.
- Admin data pages depend on database records and need error/empty states.
- 3D assets such as `public/models/avatar.glb` are not included in the archive.
- No end-to-end tests, payment tests, auth tests or deployment smoke tests were supplied.
- Review privacy/consent, data retention and deletion for uploaded user photos before enabling virtual try-on.

## Railway configuration prepared

- Repository Root Directory: `/` (repository root; do not point at a nonexistent nested app folder).
- Builder: Railpack auto-detection from root `package.json`.
- Health check path: `/api/health`.
- Start command: package script `npm start`.
- Add required variables from `ENVIRONMENT_VARIABLES_CHECKLIST.md`.

A green Railway build alone does not clear these blockers.
