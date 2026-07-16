# Notes for coding agents

Expo SDK 57 — check https://docs.expo.dev/versions/v57.0.0/ before touching config.

## Build

- `npm install`, then `npx expo run:ios` for the dev build (needs Metro), or
  `npx expo run:ios --configuration Release` for a standalone build.
- Test accounts are seeded in `src/services/data/users.ts` (also in the README).

## Conventions

- New code is TypeScript. `src/cart/` is still JavaScript — we're migrating it
  to TS, don't add new JS files.
- Data access goes through `src/services/`. (The seller screens have their own
  `api.ts` for now.)
- Money is displayed as `R$ x.xx` via `formatPrice` in `src/utils/format.ts`.
