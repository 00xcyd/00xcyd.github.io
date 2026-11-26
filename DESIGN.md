# Art direction

Source: the taste-skill house rules (`design-taste-frontend`, tasteskill 2.5.1) applied to this site.

## Decisions

- **Kind: `software`.** Developer tools, security research and the lab. Freelance services are the secondary page. Effects (the flight canvas and the fleet) are allowed on tech pages only.
- **Identity stays.** Manual-stock paper, ink, NASA red `#fc3d21`, NASA blue `#0b3d91`, IBM Plex Mono and Plex Sans. No violet anywhere.
- **Logo stays.** The orbit-d mark and its artwork files are not restyled.
- **Square panels.** `sharp` radius, as the taste skill prescribes for developer tools.
- **One section per screen** on the home deck. Equal left and right edges on the 680px column.
- **Motion.** Linked cards lift 2px, buttons step on hover and press on click, underlines draw. Nothing tilts, and nothing moves on scroll except the flight and fleet layers.
- **Icons.** Real brand marks for the stack (the profile already uses them). The projects page still uses colour dots, which is a gap.
- **Copy.** Plain sentences. Em dashes at most two per page. No virtue words ("actually", "honest", "quiet") unless a fact backs them. Numbered steps only for ordered steps. A stat strip only for figures the page can source.
- **Diagrams.** documd-visuals rules: one diagram per figure, colours from one theme, the reading stated in the prose, right-angle connectors only, arrows only where a relationship exists (never on containment), and every fact also in the text.

## Gaps against these rules

| # | gap | evidence |
|---|---|---|
| 1 | Custom domain does not resolve | `cyberdach.dev` has no A record; `metadataBase`, OG URLs and `hello@cyberdach.dev` depend on it |
| 2 | Three contact addresses | `00xcyd@proton.me` (profile badge), `cyberdachh@proton.me` (profile and freelance page), `hello@cyberdach.dev` (home) |
| 3 | Em dashes over budget | copy-lint: 9 on the home page, budget 2 |
| 4 | Virtue words | copy-lint: "actually" x2 |
| 5 | Stat strip not sourced | copy-lint: "35 / 4 / 135" on the home page |
| 6 | Numbered steps not ordered | copy-lint: 6 step numbers |
| 7 | Colour dots instead of brand icons | projects page language list |
| 8 | Stale GitHub metadata | repo description says "three.js orbit-d hero" and the topic `threejs` remains; the site no longer uses three.js |
| 9 | Blog says phase 2 is future work | AgentLens post; the code shipped Nov 22 |
| 10 | Raster text still says the old domain | `og-card.png` prints `cyberdach.dev` |

## Diagrams (inventory, not yet redrawn)

- `encryption-2026`: eight PNG figures (hero, ca-chain, gateway-anatomy, cert-flow, cert-viewer, terminal-receipt, http01-flow, dns01-laptop).
- `agentlens-first-try-accuracy`: one PNG (checkpoints).
- Eleven posts carry ASCII flows in code fences.

Plan: flow and sequence figures in PlantUML (documd `plantuml` engine), architecture figures as HTML/CSS (documd `html-css` engine), one figure theme derived from the SELA palette and checked against the documd contrast thresholds (text 4.5, lines 3.0).
