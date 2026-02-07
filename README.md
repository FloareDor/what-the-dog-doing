# Project: Zoomies

`Project: Zoomies` is a portrait mobile browser game set at CMU, where stepping outside is deadly and Scotty is the only runner fast enough to reconnect the campus.

## Play Online (GitHub Pages)

https://floaredor.github.io/what-the-dog-doing/

## lore

ppl are stuck in campus buildings, and if they step outside they die. the goops have spread across cmu paths, entrances, and key routes, so every rescue run is dangerous.

scotty is the only one fast enough to move between buildings. in home base, scotty starts with `zoomies` as the base ability and quickly unlocks early territory so the first safe routes can open.

scotty tries to win with speed alone, but it is too hard because the goops keep growing, swarming lanes, and blocking evac routes. so the plan shifts: go college by college and team up with professors, staff, and students.

each college has an easy, fun mission (mostly puzzle-based, with light goop-clearing combat that fits the lore because scotty is protecting routes, not fighting people). finishing each mission unlocks a new ability:

- hamerschlag (engineering): `coil turret`
- gates hillman (scs): `target patch`
- newell-simon (ri): `bot buddy`
- wean (physics + cs): `repel field`
- mellon institute (chemistry): `catalyst mix`
- baker (psychology): `focus bark`

with each unlock, scotty gets better at controlling goops, reopening paths, and guiding survivors. in the final push against the `dean of goop`, all college abilities combine so scotty can reconnect campus and save cmu.

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

Final artifact to submit:

- Local path: `E:\cmu-e\tartanhacks\what\hamish\build\game.tar.br`
- GitHub file link: [`build/game.tar.br`](https://github.com/FloareDor/what-the-dog-doing/blob/main/build/game.tar.br)

Submission checklist:

- Hosted game link (GitHub Pages): `https://floaredor.github.io/what-the-dog-doing/`
- Offline validation artifact upload: `build/game.tar.br`

`npm run pack` reports whether `build/game.tar.br` is within the 15360-byte submission limit.
