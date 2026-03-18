# Poke Profile

Retro-style Pokemon profile quiz built with React, TypeScript, and Vite.

Users answer a guided survey, then get a deterministic Pokemon profile and team lineup with an interactive reveal flow.

## Features

- Multi-step survey flow with custom question screens
- Deterministic result generation from answers:
  - Pokemon you are
  - Legendary Pokemon
  - Starter final evolution
  - Regional/type-based teammates
  - Additional deterministic and wild encounter teammates
- Interactive results presentation:
  - 3-second gathering prompt
  - one-by-one modal reveal
  - full results grid after reveal
- Results utilities:
  - save results screenshot (PNG)
  - copy shareable results link to clipboard
- Mobile DOB picker support and desktop calendar support

## Tech Stack

- React + TypeScript
- Vite
- ESLint
- `react-day-picker` (desktop date selection)
- `react-mobile-datepicker` (mobile date selection)
- `html2canvas` (screenshot export)

## Project Structure

High-level areas:

- `src/features/survey/` - survey questions, steps, and flow orchestration
- `src/features/result/` - deterministic result hooks, result services, and helpers
- `src/services/pokeapi/` - PokeAPI fetch clients
- `src/services/assets/` - shared public asset URL helpers
- `src/styles/` - global styles

`SurveyFlow` is split into:

- `SurveyStart`
- `SurveyQuestions`
- `SurveyResults`

## Local Development

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

## Deployment (GitHub Pages)

This app is static and does not require a backend.

Deployment is handled via GitHub Actions using:

- `.github/workflows/deploy-pages.yml`

Important config:

- `vite.config.ts` uses `base: './'` for compatibility with project pages and custom domains.

### GitHub repo settings

1. Go to **Settings -> Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` to trigger deployment

## Notes

- Shared result links encode survey answers into a URL query parameter.
- Screenshot export captures the rendered results panel in-browser.
