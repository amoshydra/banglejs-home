# ⌚ BangleJS Home


> **⚠ Caution**
> - Please note the implementation is not official, please use at your own risk.
> - Avoid updating critical part of the watch with this app. Avoid updating firmware via this app.

https://amoshydra.github.io/banglejs-home/#/apps

An unofficial alternate home for your [BangleJS Smartwatch](https://banglejs.com/).

BangleJS Home uses some of the code from https://banglejs.com/apps for communicating with your BangleJS Smartwatch. 

## Features:
- An alternative UI for listing apps
- App view to provide screenshots and readme
- App view allow launching of installed watch app
- App view allow setting of clock watchface
- My device view to list installed app




| App list |  Filters |  App view |  My device |
| :-- |  :-- |  :-- |  :-- |
| ![banglejs-home-001](https://github.com/user-attachments/assets/b830d922-e888-4f6a-a37d-c050b39fb909) | ![banglejs-home-002](https://github.com/user-attachments/assets/8273da4d-64c2-494e-9902-1990d574088e) | ![banglejs-home-003](https://github.com/user-attachments/assets/7110a6f6-1266-4855-ac6e-760ef37bb3b1) | ![banglejs-home-004](https://github.com/user-attachments/assets/349af379-10de-4c94-8557-cf146b594650)


## Usage in Bangle.js Gadgetbridge

This can be used as the default app loader inside your Gadgetbridge.

1. ⚙️ Device Specific Settings → Developer options → 🔗 App loader URL
2. ```
    https://amoshydra.github.io/banglejs-home/
    ```
    <img alt="setting app loader url inside banglejs gadgetbridge" src="https://github.com/user-attachments/assets/1fdefd6f-3291-46ae-9eec-6b076bd4a07b" width="300">


## Development

Requires Node 20+ (see `.nvmrc`). This project uses the original
[espruino/BangleApps](https://github.com/espruino/BangleApps) repository as a
submodule; clone with `--recurse-submodules` (or run
`git submodule update --init --recursive`) so the loader code is present.

```bash
git clone --recurse-submodules git@github.com:amoshydra/banglejs-home.git
cd banglejs-home
yarn
yarn dev
```

`yarn dev` generates the app catalogue (`apps.json`) automatically from the
submodule's `apps/*/metadata.json` — upstream ships `apps.json` as a
placeholder, and the real file is otherwise only built at deploy time. Run
`yarn apps:json` to regenerate it by hand.

## BangleApps integration

This project does not reimplement the loader. It grafts a React UI onto the
official loader code vendored under `public/externals/espruino/BangleApps`
(an [espruino/BangleApps](https://github.com/espruino/BangleApps) submodule).

- `index.html` loads a **subset** of upstream's scripts as classic scripts
  (`core/js/{utils,comms,appinfo}.js`, `core/lib/espruinotools.js`,
  `webtools/{puck,heatshrink}.js`) and binds to their globals (`Comms`,
  `Utils`, `Const`, `AppInfo`, `Puck`, `Espruino`, `httpGet`).
- Upstream's own app layer (`core/js/index.js`, `core/js/ui.js`, `loader.js`,
  `backup.js`, …) is **not** loaded. This UI reimplements it and provides shims
  for `Progress`, `showToast`, `getInstalledApps` and `SETTINGS`
  (see `src/services/Espruino/`).
- `src/services/Espruino/patches/` adapts upstream code to run inside a SPA
  (URL rewriting, Gadgetbridge connectivity).
- The typed wrappers in `src/services/Espruino/*.ts` are **hand-written**
  (not generated from upstream), so they can drift.
- `src/services/Espruino/integration.contract.test.ts` pins the upstream API
  surface this app depends on and fails in CI if a submodule bump changes it.

Because this depends on upstream internals, the project is pinned to a specific
BangleApps commit, and **a bump must be tested before merging**.

## Updating the BangleApps submodule

The build uses the **pinned** submodule commit (not upstream `master`), so
production only changes when the pin changes. A scheduled workflow
(`.github/workflows/bump-submodule.yml`, Mondays 06:00 UTC) syncs the pin to
upstream `master` **only if the app still passes the integration contract
test, lint and build** against it; otherwise it leaves the pin untouched.
You can also bump by hand:

```bash
git submodule update --init --recursive
cd public/externals/espruino/BangleApps
git fetch origin master
git checkout origin/master
git submodule update --init --recursive   # update nested core/webtools
cd -
git add public/externals/espruino/BangleApps
git commit -m "chore: bump BangleApps submodule"
```

CI (`.github/workflows/ci.yml`) then runs `yarn lint`, `yarn test` — including
the integration contract test — and `yarn build`. Because a bump can change
behaviour that only shows on hardware, do a quick device test
(connect → install → activate → remove) before merging.
