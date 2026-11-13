# Database Migration Audit

The input archive contains multiple overlapping Prisma schema fragments, but no canonical `prisma/migrations/` directory or migration SQL history.

A consolidated schema was created at `prisma/schema.prisma` based on fields and relations referenced by the supplied source fragments. It is not safe to run a destructive reset against any existing database.

Before production:
1. Connect to a staging PostgreSQL database.
2. Run `npx prisma validate`.
3. Run `npx prisma generate`.
4. Compare the current production database schema with this consolidated schema.
5. Generate a migration from a known baseline in staging, review the SQL, and test upgrade/rollback behavior.
6. Back up production before applying any reviewed migration with `npx prisma migrate deploy`.

Do not run `prisma migrate reset` or blindly run `prisma db push` against production.
