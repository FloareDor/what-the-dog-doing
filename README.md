# Project: Zoomies

`Project: Zoomies` is a portrait mobile browser game set at CMU, where stepping outside is deadly and Scotty is the only runner fast enough to reconnect the campus.

## Play Online (GitHub Pages)

https://floaredor.github.io/what-the-dog-doing/

## Lore

No one knows when it began, only that by morning one rule was true: if you leave a building, you die.

Students, professors, and staff are trapped across CMU. Safe zones are isolated. Supply routes are broken. Panic spreads from hall to hall.

Scotty is the only one fast enough to survive outside. At Home Base, he starts with one ability: `Zoomies`. With it, he unlocks nearby territory and opens early rescue routes. But speed alone cannot save campus.

So Scotty goes college by college, working with professors, staff, and students through quick puzzle-style missions (with light combat support) to unlock new powers:

- Hamerschlag (Engineering): `coil turret`
- Gates Hillman (SCS): `target patch`
- Newell-Simon (RI): `bot buddy`
- Wean (Physics + CS): `repel field`
- Mellon Institute (Chemistry): `catalyst mix`
- Baker (Psychology): `focus bark`

Each unlock expands what Scotty can do. Collaboration becomes the real power-up.

In the final encounter against the `Dean of Goop`, Scotty combines campus-wide abilities to reconnect routes, stabilize safe zones, and save CMU.

## Controls

- Tap center: jump / double-jump
- Tap left or right side: wallrun lane shift
- Swipe down: slide
- Hold touch near yellow ring: grapple pull

## Local Setup and Run

Requirements:

- Node.js 20+
- npm

Commands:

```bash
npm install
npm run build
npm run start
```

Then open `http://localhost:8000` on a phone (or mobile simulator), since gameplay is tuned for portrait mobile input.

## Submission Build

```bash
npm run build
npm run pack
```

Generated artifacts:

- `build/index.html`
- `build/game.tar`
- `build/game.tar.br`

`npm run pack` reports whether `build/game.tar.br` is within the 15360-byte submission limit.
