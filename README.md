# Sakushi Lab

A static, multilingual visual illusion playground. It runs entirely in the browser with Vite, vanilla TypeScript, Canvas, SVG export, and WebM recording.

Live site: [Sakushi Lab](https://piccoripico.github.io/sakushi-lab/)

## Multilingual Documents

- [日本語](docs/README.ja.md)
- [Français](docs/README.fr.md)
- [Español](docs/README.es.md)
- [Deutsch](docs/README.de.md)
- [简体中文](docs/README.zh-Hans.md)
- [繁體中文](docs/README.zh-Hant.md)
- [한국어](docs/README.ko.md)

## About Visual Illusions

Visual illusions are images or motion patterns that reveal how strongly perception depends on context. Lines that are physically parallel may appear tilted, equal shapes may look different in size, and still patterns may seem to shimmer or move.

These effects are not simply "errors" in vision. They show how the visual system estimates brightness, contrast, depth, direction, size, and motion from surrounding information. Sakushi Lab lets you change the conditions behind each illusion and see how those changes make the effect stronger, weaker, or easier to notice.

The generated images and videos are suitable for learning, demonstrations, design experiments, and casual exploration. Some motion-based illusions can feel intense, so take a break if an animation feels uncomfortable.

## Features

- Six visual illusions:
  - Café Wall
  - Hermann / Scintillating Grid
  - Müller-Lyer
  - Ebbinghaus
  - Fraser Spiral
  - Moiré Motion Field
- Parameter controls generated from each illusion module's schema.
- Optional seed controls for reproducible generation.
- Deterministic generation with seed-backed URL sharing.
- PNG, SVG, WebM, and reproducible URL export.
- UI languages: English, French, Spanish, German, Japanese, Simplified Chinese, Traditional Chinese, and Korean.

## Development

```powershell
npm.cmd install
npm.cmd run verify
```

Useful scripts:

- `npm.cmd run dev`: start the Vite development server.
- `npm.cmd test`: run unit tests.
- `npm.cmd run build`: type-check and build `dist/`.
- `npm.cmd run test:e2e`: run Playwright tests.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and uploads `dist/` as a Pages artifact on pushes to `main` or manual dispatch.
