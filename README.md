# Mercado

Grocery marketplace app (React Native / Expo). Buyers browse and search products,
keep favourites, build a cart, and check out; sellers manage their listings from
a dashboard.

## Requirements

- Node 20+
- Xcode with an iOS Simulator

## Build & run (iOS Simulator)

```sh
npm install
npx expo run:ios --configuration Release
```

`--configuration Release` bundles the JS into the binary — no Metro server needed.
The command builds, installs, and launches the app (bundle id `com.mercado.app`)
on the default booted simulator. To target a specific simulator:

```sh
xcrun simctl boot "iPhone 15"
npx expo run:ios --configuration Release --device <SIMULATOR_UDID>
```

## Test accounts

There is no backend; accounts are seeded in `src/services/data/users.ts`:

| Role | Email | Password |
|---|---|---|
| Buyer | `buyer@demo.test` | `grocery123` |
| Seller | `seller@demo.test` | `banana456` |

The app requires login — everything lives behind the login screen. Use one
of the accounts above. The seller dashboard is available under Profile for
the seller account.

## Configuration

Copy `.env.example` to `.env` if you need to point at a backend
(`EXPO_PUBLIC_API_URL`). Leave it unset to use the bundled sample catalog —
the normal setup for local development.

CI (`.github/workflows/ci.yml`) typechecks every push and builds the iOS
Simulator binary on main via `scripts/build-ios-simulator.sh` (output:
`build-artifacts/Mercado-simulator.zip`).

## Notes

- All data is mock data. The product catalog lives in `src/services/data/catalog.ts`
  and is in-memory (seller delist/relist resets on app restart). Cart, favourites,
  orders, and session persist locally via AsyncStorage.
- The mock data path simulates backend latency (see `simulateNetwork` in
  `src/services/client.ts`), so screens show real loading states.
