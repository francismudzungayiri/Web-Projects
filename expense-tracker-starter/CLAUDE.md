# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A React 19 + Vite expense tracker, used as the starter project for a Claude Code course. The README describes the original starter as having a bug, poor UI, and messy code. The totals bug, the single-component structure, and the UI have since been addressed, so the README's description no longer matches the code.

## Commands

```bash
npm run dev      # Dev server at http://localhost:5173 (Vite picks the next free port if taken)
npm run build    # Production build to dist/
npm run preview  # Serve the production build
npm run lint     # ESLint (flat config, eslint.config.js)
```

No test runner is configured, so changes need checking in a browser.

## Architecture

Client-only JavaScript (JSX, no TypeScript) with no backend, router, or state library. Transactions live in memory and reset to the hardcoded seed data on reload.

`src/main.jsx` mounts `App` in `StrictMode`. `src/App.jsx` owns the `transactions` state, the seed data, whether the add panel is open, and the undo state, and passes data down to the components in `src/components/`:

- `Summary` derives the totals, the percentage of income left, and the counting balance animation.
- `TransactionForm` is a modal `<dialog>` that owns the form state. It is mounted only while open, and reports new transactions through `onAdd`.
- `TransactionList` owns the filter state, sorts rows newest first, and groups them by day.

`amount` is always stored as a number, and `date` as a local `YYYY-MM-DD` string. Use `src/formatMoney.js` to display money.

## Behavior to preserve

- Deleting has no confirmation. The 5-second undo in `App` is the only way back, and only the latest deletion can be undone.
- List changes go through `animateListChange` in `App`, which uses the View Transitions API and falls back to an instant update. Rows and day groups need unique `viewTransitionName` values, and state updates inside it should use the functional form.
- Row actions depend on the input type: Delete appears on hover or keyboard focus with a mouse (`hover: hover`), and behind a `⋯` button on touch screens (`hover: none`).

## Styling

Styles are plain CSS, with design tokens and globals in `src/index.css` and app styles in `src/App.css`. Use the color tokens rather than literal colors, because dark mode works by redefining them under `prefers-color-scheme`. The Geist font loads from Google Fonts in `index.html`. Animations must respect `prefers-reduced-motion`.
