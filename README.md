# SUGRA.WORLD

SUGRA.WORLD is an interactive, responsive 3D world with a functional desktop-style SUGRA OS. The project is intentionally honest about deployment state: the token is not deployed, no contract address or market/on-chain values are present, and no social links are configured.

## Run locally

```sh
npm install
npm run dev
```

Build and verify TypeScript, unit behavior, and real Chromium interactions (the browser runtime is included as a development dependency):

```sh
npm run build
npm test
npm run test:browser
```

## Project map

- `src/components/WorldScene.tsx` — real React Three Fiber scene and interactive world objects.
- `src/components/OSShell.tsx` — SUGRA OS shell, launcher, dock, notifications and shared windows.
- `src/hooks/useWindowManager.ts` — reusable open/focus/minimize/maximize/drag window state.
- `src/apps/` — the twelve actual application views and interactive terminal/gallery.
- `src/config/sugra.ts` — the single source of truth for token, Arc, explorer and community configuration.
- `src/services/arc/` — isolated injected-wallet adapter; no fabricated balances or activity.
- `src/assets/sugra/` — drop-in location for supplied SUGRA source artwork.
- `docs/ASSET-MAP.md` — inventory of assets found in the initial checkout.

## Deployment configuration

Edit `src/config/sugra.ts` when verified deployment details are available. Keep the contract address, token state, Arc network metadata, explorer, optional USDC contract and official social links in that configuration; UI components consume it rather than hardcoding deployment data.

## Asset note

The initial repository checkout contained only a README and no image, model, texture, video or animation files. The 3D scene and archive therefore use authored procedural geometry, not stock imagery. The gallery automatically discovers supported files added under `src/assets/sugra/`; supplied artwork can replace or augment the procedural studies without changing the app architecture.
