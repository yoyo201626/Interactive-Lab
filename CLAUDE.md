# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A **Projectile Motion Simulator**: an interactive web page that animates projectile motion with live physics. `doc.md` (Chinese) is the informal spec; `image.png` is the authoritative UI reference.

Intended UI (see `image.png` for exact layout):

- **Left control panel**: Initial Velocity, Launch Angle, Launch Height sliders; Gravity dropdown; Air Resistance and Show Components toggles; Reset Simulation and Pause/Play buttons.
- **Center chart area**: coordinate grid, animated projectile, parabolic trajectory, launch point, highest point, impact point, initial velocity components, horizontal/vertical guide lines, pan/zoom/select controls.
- **Bottom stat cards**: Max Height, Flight Time, Horizontal Range, Impact Speed.

## Stack

- **Vue 3 + Vite** for the front end.
- **D3** (`d3-scale`, `d3-shape`, `d3-array`) for the trajectory chart — scales/line-generator/bisector are computed in JS, but the SVG itself is rendered via Vue templates (not `d3.select().append`), to avoid fighting Vue's reactivity.

## Commands

- `npm run dev` — start the Vite dev server.
- `npm run build` — production build.
- `npm run preview` — preview the production build.

No test suite or linter is configured yet.

## Architecture

- `src/physics.js` — pure simulation function `simulateProjectile()`. Numerically integrates (semi-implicit Euler, dt=0.01) from launch until y=0, with optional quadratic air resistance (fixed `DRAG_COEFFICIENT`, not exposed as a UI control). Returns the full point array plus derived stats (max height, flight time, range, impact speed).
- `src/App.vue` — owns `settings` (reactive) and drives the animation loop via `requestAnimationFrame`, advancing `currentTime` in real seconds against the current simulation's `flightTime`.
- `src/components/ControlPanel.vue`, `TrajectoryChart.vue`, `StatsCards.vue` — presentational; `TrajectoryChart` interpolates the animated marker's position from `points` via `d3.bisector` on `currentTime`, rather than re-simulating per frame.
