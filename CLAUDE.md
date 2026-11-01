# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A React 19 + Vite expense tracker, used as the starter project for a Claude Code course. Per the README, it intentionally has a bug, poor UI, and messy code, all meant to be fixed during the course. Don't assume existing patterns are conventions to preserve.

## Commands

```bash
npm run dev      # Dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Serve the production build
npm run lint     # ESLint (flat config, eslint.config.js)
```

No test runner is configured.

## Architecture

Client-only JavaScript (JSX, no TypeScript) with no backend, router, or state library. Transactions live in memory and reset to the hardcoded seed data on reload.

`src/main.jsx` mounts `App` in `StrictMode`. `src/App.jsx` holds everything else in one component: the transaction list, form state, filter state, derived totals, and all markup. Styles are plain CSS, with globals in `src/index.css` and app styles in `src/App.css`.