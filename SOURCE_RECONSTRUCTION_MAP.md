# Source Reconstruction Map

## Restored paths

| Recovered project path | Source basis |
|---|---|
| `src/app/page.tsx` | Complete homepage fragment `tsx_20261111_dd4e9f.tsx` |
| `src/app/shop/page.tsx` | `tsx_20261111_35a326.tsx` |
| `src/app/product/[slug]/page.tsx` | `tsx_20261111_13cd12.tsx` |
| `src/app/checkout/page.tsx` | `tsx_20261111_106990.tsx` |
| `src/app/try-on/page.tsx` | `tsx_20261111_b058c6.tsx` |
| `src/app/stylist/page.tsx` | `tsx_20261111_859db0.tsx` |
| `src/app/3d-studio/page.tsx` | `tsx_20261111_f0bf95.tsx` |
| `src/app/pricing/page.tsx` | `tsx_20261111_24fd37.tsx` |
| `src/app/(admin)/layout.tsx` | `tsx_20261111_981fa4.tsx` |
| `src/app/(admin)/admin/page.tsx` | `tsx_20261111_e530b5.tsx` |
| `src/app/(admin)/admin/products/page.tsx` | `tsx_20261111_2bd3d1.tsx` |
| `src/app/(admin)/admin/ai-management/page.tsx` | `tsx_20261111_388f91.tsx` |
| `src/app/(admin)/admin/marketing/page.tsx` | `tsx_20261111_cf1c7f.tsx` |
| `src/components/3d/Avatar.tsx` | `tsx_20261111_bf5c02.tsx` |
| `src/components/storefront/AdBannerSlot.tsx` | `tsx_20261111_852d3b.tsx` |
| `src/components/storefront/HeroVideo.tsx` | `tsx_20261111_93dfb0.tsx` |
| `src/app/actions/product.actions.ts` | `typescript_20261111_109f2c.ts` |
| `src/app/actions/admin.actions.ts` | `typescript_20261111_2a674f.ts` |
| `src/app/api/checkout/route.ts` | `typescript_20261111_8a254c.ts`, hardened to calculate server-side totals |
| `src/app/api/stylist/route.ts` | `typescript_20261111_533dce.ts` |
| `src/app/api/try-on/route.ts` | `typescript_20261111_baa972.ts` |
| `src/app/api/webhook/midtrans/route.ts` | `typescript_20261111_5fc25e.ts` |
| `src/app/api/auth/[...nextauth]/route.ts` | `typescript_20261111_557ccc.ts` |
| `src/app/api/ads/serve/route.ts` | `typescript_20261111_c8ca90.ts` |
| `src/app/api/ads/click/[id]/route.ts` | `typescript_20261111_869b0a.ts` |
| `src/store/useCartStore.ts` | `typescript_20261111_b76693.ts` |
| `src/lib/ai/provider.ts` | `typescript_20261111_c39cb5.ts` |
| `src/lib/ai/router.ts` | `typescript_20261111_5e8139.ts` |
| `src/lib/ai/virtual-tryon-provider.ts` | `typescript_20261111_6526cd.ts` |
| `src/lib/storage.ts` | `typescript_20261111_ac3063.ts` |
| `src/lib/storage/r2.ts` | `typescript_20261111_89c690.ts` |
| `src/lib/rate-limit.ts` | `typescript_20261111_3c2de8.ts` |
| `src/lib/integrations/payment.ts` and `shipping.ts` | `typescript_20261111_46c3d4.ts` (original adapter stubs retained) |
| `src/tests/cart.test.ts` | `typescript_20261111_d6888b.ts` |
| `prisma/seed.ts` | `typescript_20261111_1255c5.ts` |

## Deliberately not promoted to active source

- `typescript_20261111_692a31.ts`: incomplete stylist route fragment (references undeclared variables and is not a complete module).
- `typescript_20261111_dd5d68.ts`: obsolete/incomplete try-on fragment containing `DUMMY_USER_ID`.
- `typescript_20261111_52023f.ts`: partial webhook update fragment; the complete webhook fragment was used instead.
- `typescript_20261111_f31065.ts`: partial rate-limit patch with omitted code.
- `tsx_20261111_f5a5d0.tsx`: incomplete homepage replacement containing placeholder comments; complete homepage retained.
- Duplicate `deepseek_*` exports were not separately used as active files. The original archive is preserved for audit.

## Notes

The Prisma schema is a consolidated compatibility schema assembled from overlapping schema fragments. It has not yet been validated by Prisma CLI or reconciled against an existing production database migration history.
