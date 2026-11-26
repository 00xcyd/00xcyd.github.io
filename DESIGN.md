# Art direction

Source: the taste-skill house rules (`design-taste-frontend`, tasteskill 2.5.1) applied to this site.

## Decisions

- **Kind: `software`.** Developer tools, security research and the lab. Freelance services are secondary. Effects (the flight canvas and the fleet) stay on tech pages.
- **Identity stays.** Manual-stock paper, ink, NASA red `#fc3d21`, NASA blue `#0b3d91`, IBM Plex Mono and Plex Sans. No violet.
- **Logo stays.** The orbit-d mark and its artwork files are not restyled.
- **Square panels.** Radius 0 on every panel and tag.
- **One section per screen** on the home deck. Equal left and right edges on the 680px column.
- **Motion.** Linked cards lift 2px on hover. Nothing tilts; nothing moves on scroll except the flight and fleet layers.
- **Icons.** Real brand marks for languages (`components/LanguageIcon.tsx`).
- **Contact.** One address: `00xcyd@proton.me`. The site's origin is `00xcyd.github.io`; no other domain is used.
- **Copy.** Plain sentences. Em dashes at most two per page. No virtue words unless a fact backs them. Numbers only for ordered steps or ranks. A stat strip only for figures the page sources.
- **Diagrams.** documd-visuals rules: one diagram per figure, colours from one palette (checked against the documd contrast thresholds: text 4.5, lines 3.0), right-angle connectors, arrows only where a relationship exists, numbers only for ordered steps, and every fact also in the prose. Drawn by `scripts/figures/render.mjs` from `scripts/figures/specs.mjs`.

## Applied

- Ten figures redrawn as SVG at column width (encryption post, AgentLens, compose and desktop tiers). Screenshots are kept as they are.
- Stat strips removed from the hero and the identity card.
- Home copy: one "actually" removed, em dashes in the intro and metadata removed.
- Language dots replaced by brand icons on the home and projects pages.
- `cyberdach.dev` and the old addresses removed everywhere; the OG card now prints `00xcyd.github.io`.

## Open

| # | gap | evidence |
|---|---|---|
| 1 | Projects page copy | copy-lint: 11 em dashes (budget 2), a stat strip, 9 numbered rows |
| 2 | Virtue word in a post title | "what four rows of an agent audit actually proved" (authored title, left as written) |
| 3 | Six ranked numbers on the home telemetry | accepted: these rank repos by recency, they are not steps |
| 4 | Stale GitHub metadata | the portfolio repo description says "three.js orbit-d hero" and the topic `threejs` remains; the site no longer uses three.js |
| 5 | AgentLens post says phase 2 is future work | the code shipped Nov 22 |
| 6 | Profile header GIF | GitHub caps the README column (about 846px desktop, 450px tablet, 308px phone); full-bleed needs the portfolio |
