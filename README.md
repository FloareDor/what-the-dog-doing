# Hamish Campus Sprint

Portrait mobile browser runner with jump, wallrun, slide, and grapple.

## Controls

- Tap center: jump / double-jump
- Tap left or right side: wallrun lane shift
- Swipe down: slide
- Hold touch near yellow ring: grapple pull

## Run

```bash
cd hamish
npm run build
npm run start
```

Then open `http://localhost:8000` on a phone (or mobile simulator).

## Package for submission

```bash
cd hamish
npm run build
npm run pack
```

Artifacts:

- `build/index.html`
- `build/game.tar`
- `build/game.tar.br`

`npm run pack` prints whether `game.tar.br` passes the 15360-byte limit.
