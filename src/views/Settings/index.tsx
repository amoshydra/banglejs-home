import { css } from "@emotion/react";

/**
 * Placeholder for loader preferences (auto-reload, usage stats, language,
 * favourites...). The upstream loader keeps these in a global SETTINGS object
 * defined in index.html; exposing them is a follow-up, so for now this tab
 * carries the About content that used to have nowhere to live.
 */
export const SettingsScreen = () => {
  return (
    <div
      css={css`
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        padding: 1rem;
      `}
    >
      <h2 css={css`margin-top: 0;`}>Settings</h2>
      <p css={css`opacity: 0.6; font-size: 0.85rem;`}>
        Loader preferences (auto-reload after install, usage stats, language,
        favourites) will live here.
      </p>

      <h3>About</h3>
      <p css={css`opacity: 0.6; font-size: 0.85rem;`}>
        BangleJS Home is a mobile-friendly app manager for Bangle.js watches,
        built to run inside Gadgetbridge's WebView.
      </p>
      <ul
        css={css`
          padding-left: 1.1rem;
          font-size: 0.85rem;
          line-height: 1.7;
        `}
      >
        <li><a href="https://banglejs.com" target="_blank" rel="noreferrer">banglejs.com</a></li>
        <li><a href="https://github.com/espruino/BangleApps" target="_blank" rel="noreferrer">espruino/BangleApps</a></li>
        <li><a href="https://github.com/amoshydra/banglejs-home" target="_blank" rel="noreferrer">amoshydra/banglejs-home</a></li>
      </ul>
    </div>
  );
};
