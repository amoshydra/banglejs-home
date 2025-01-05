# ⌚ BangleJS Home


> **⚠ Caution**
> - Please note the implementation is not official, please use at your own risk.
> - Avoid updating critical part of the watch with this app. Avoid updating firmware via this app.

https://amoshydra.github.io/banglejs-home/#/apps

An unofficial alternate home for your BangleJS Smartwatch.

This uses some the code from https://banglejs.com/apps/ for communicating with your BangleJS Smartwatch. 

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

```bash
yarn
yarn dev
```

