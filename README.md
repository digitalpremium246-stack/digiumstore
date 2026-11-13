# DIGIUM Store — recovered source tree

This package is a best-effort reconstruction of the supplied source-fragment archive.

## Local setup

1. Install Node.js 20 LTS.
2. Copy `.env.example` to `.env` and configure `DATABASE_URL` and `NEXTAUTH_SECRET`.
3. Run `npm install`.
4. Run `npx prisma validate`.
5. Run `npx prisma generate`.
6. Create and review database migrations in a development database before production.
7. Run `npm run dev`.

## Railway

Railway should deploy from the repository root using Railpack's Node.js detection. `package.json` is now at the repository root. Do not set a nested Root Directory. The health check is `/api/health`.

This archive intentionally does not include a generated lockfile: run `npm install` in a controlled environment, review the resulting `package-lock.json`, and commit it before production deployment.

## Important

A successful build is not equivalent to production readiness. Review `REMAINING_BLOCKERS.md` before enabling payments, authentication, AI try-on, or customer uploads.
