# Hyperverse TCG — Rift Table

A browser-playable single-player proof of concept for the Hyperverse TCG. The game uses the 2026-08-12 rules SSOT and the rendered Base Set assets from HyperTCGMaker.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:4173`.

## Gameplay in this POC

- Legal 60-card decks, seven-card opening hands, and an optional mulligan of up to three cards
- Ten selectable, fully shuffled archetype decks with distinct strategies and Energy signatures
- 250 player HP, deck-out loss, and direct attacks
- Five Vanguard and five Backguard positions per player
- Unlimited scrolling Utility zones
- Typed permanent Energy with automatic cost payment
- Direct-click Energy and Utility play, plus click-to-place Units
- Energy grouped by type as compact ready/total counters
- Ready, Exhausted, Rotation, first-turn restrictions, and forced Vanguard refill
- Critical d20 attacks and d100 Defense Checks
- A generic rules-driven opponent that evaluates every legal play, target, ability, reaction, and attack
- Fair known-deck belief sampling and selectable Initiate, Challenger, and Veteran search levels
- Persistent full-card detail inspection for cards in hand and on the battlefield

Every Base Set effect is executable through a generic JSON interpreter: activated
and triggered abilities, continuous auras, Equipment, Additional Attacks, searches,
ordered choices, Conditions, variable Damage, and Free Effect reactions. No card
effect is hardcoded in the match engine. See `docs/EFFECT_SCRIPTS.md` for the
scripting contract and the explicit defaults used where the rules SSOT is undecided.

## Refresh HyperTCGMaker assets

The sync script copies all rendered Base Set cards and all six Energy card images, then regenerates the typed catalog:

```bash
npm run sync:cards
```

It defaults to `C:/Users/Styn/Documents/GitHub/HyperTCGMaker`. Set `HYPERVERSE_MAKER_PATH` to use another checkout.

## Project shape

- `src/data/effects/cards/` — one executable JSON pseudo-script per card

- `src/game/` — pure match state and rules transitions
- `src/data/` — generated card catalog and energy metadata
- `src/ui/` — focused React components
- `src/styles/` — glassmorphism design system and responsive layout
- `scripts/` — asset synchronization
