# DIGIUM Store — Deployment Recovery Report

**Input reviewed:** `digiumstore-main(1).zip` (152 archive entries) and the Railway Railpack build log supplied in this conversation.  
**Recovery status:** Source tree reconstructed; production readiness NOT verified.

## Confirmed original failure

Railpack's log explicitly says it could not determine how to build the app. Its root inventory consisted of timestamped exported fragments (`.sh`, `.ts`, `.tsx`, `.txt`, `.yaml`, `.dockerfile`) rather than a conventional Node application root. It also reported `start.sh` missing. The archive contained no root `package.json`, no package lockfile, and no conventional app directory tree.

## Work completed in this recovery package

- Rebuilt a conventional Next.js 14 / React 18 / TypeScript project tree from the source fragments whose embedded comments identified intended paths.
- Added root `package.json`, `tsconfig.json`, Next.js, Tailwind and PostCSS configuration.
- Added App Router root layout and global CSS.
- Added root `src/lib/prisma.ts` singleton and changed source modules to reuse it instead of creating many Prisma clients.
- Combined the available Prisma model fragments into one consolidated `prisma/schema.prisma`, including the models referenced by the supplied code and NextAuth adapter tables.
- Reconstructed available storefront, checkout, product, stylist, try-on, 3D studio, admin, ads, authentication, webhook and utility modules.
- Added a `/api/health` endpoint and Railway health-check configuration.
- Removed the incorrect Dockerfile builder selection from `railway.json`; Railway can now detect Node via root `package.json` using Railpack.
- Added a login page required by the supplied middleware redirect.
- Changed checkout to derive item prices and totals from database product variants rather than trusting the browser-submitted total.
- Changed Midtrans production/sandbox selection to use `MIDTRANS_IS_PRODUCTION`.
- Reworked the separate Midtrans adapter to call the Snap API rather than returning a fabricated token; the Biteship adapter now fails closed instead of returning a fabricated shipping quote.
- Disabled automatic demo-provider fallback for virtual try-on. A missing FASHN key now makes the feature unavailable rather than returning a fake demo result.
- Preserved the exact original ZIP as `recovery-original-source.zip` for traceability.

## Validation performed

- Verified the reconstructed `@/` source aliases resolve to files in this project.
- Inspected the consolidated Prisma schema and source references manually.
- Attempted `npm install --no-audit --no-fund`; it did not complete within the available execution window. A global TypeScript syntax pass was run: no parser/syntax diagnostics remained after corrections, but full type-check could not pass because project dependencies and generated Prisma types were not installed. No Prisma validation, test run, Next.js production build, or Railway deployment is claimed as passed.
- No production database was connected or modified.

## Important limitation

The supplied archive is not a complete application checkout. It contains exported code fragments and conflicting versions, not the original Git working tree. This package is a best-effort reconstruction, not a verified byte-for-byte recovery of the GitHub application. See `REMAINING_BLOCKERS.md` before production use.
