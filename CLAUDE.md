# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static leaderboard site for CVE-Bench (cvebench.com) — benchmarking AI agents on real-world CVE reproduction tasks. Built with vanilla TypeScript + CSS, bundled with Bun, deployed to GitHub Pages.

## Commands

```bash
bun run dev     # Build leaderboard data, then dev server with hot reload (http://localhost:3000)
bun run build   # Build leaderboard data, then production build to dist/ (minified + CNAME copy)
```

Both scripts must list all HTML entry points explicitly (e.g. `bun ./src/index.html ./src/contact.html`). When adding a new page, update both `dev` and `build` scripts in `package.json`.

## Architecture

- **Multi-page static site** using Bun's HTML bundler — each `.html` file in `src/` is a separate entry point
- **No frameworks** — pure TypeScript + CSS; `js-yaml` is the only dependency (dev)
- **Data pipeline**: `scripts/build-leaderboard.ts` globs `runs/*/metadata.yml`, flattens variations, and generates `src/data/leaderboard.json` (gitignored). This runs automatically before both `dev` and `build`.
- **Shared sidebar nav** is duplicated across HTML files (no templating); keep nav links in sync when modifying
- **CNAME**: `src/CNAME` must be manually copied to `dist/` in the build script since Bun only processes assets referenced from HTML

## Key Files

- `src/app.ts` — table rendering, click-to-sort (asc/desc toggle), org/variation dropdown filters
- `src/data/leaderboard.json` — **generated** (do not edit); built from `runs/` YAML files
- `src/styles.css` — shared styles across all pages
- `scripts/build-leaderboard.ts` — reads `runs/*/metadata.yml` and writes `src/data/leaderboard.json`
- `runs/` — per-run directories, each containing a `metadata.yml` (see `README.md` for schema)
- `.github/workflows/deploy.yml` — deploys `dist/` to GitHub Pages on push to `master`

## Adding a New Run

1. Create `runs/{date}_{agent}_{model}/metadata.yml` following the schema in `README.md`
2. Run `bun run build` to verify the generated leaderboard JSON is correct

## Deployment

Pushes to `master` trigger automatic deployment via GitHub Actions. The workflow uses `oven-sh/setup-bun@v2`, builds, then deploys to GitHub Pages with the `cvebench.com` custom domain.
