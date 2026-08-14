# Card effect tests

Every catalog card has one gameplay test file in `src/game/cardTests/cards/<card-id>.test.ts`.
The test inventory is strict: a missing, duplicate, unknown, or incorrectly named file fails the run.

Each file contains explicit arrange/action/assert scenarios. The runner performs real engine actions,
resolves declared choices, and checks observable post-action game state: HP changes, Damage, Conditions,
Ready/Exhausted state, rotation, zones, modifiers, attachments, searches, draws, and reaction results.
The inventory gate requires every JSON attack, activated effect, trigger, continuous effect, Utility,
and Energy play to be covered by at least one scenario. Any effect section containing conditional
logic must have at least two executable outcome scenarios, so a single happy-path test cannot satisfy
the inventory.

## Commands

```text
npm test
npm run test:cards
npm test -- 001-admiral-asgore-dreemurr
npm test -- "energy-*"
npm test -- src/game/cardTests/cards/089-battle-medicine.test.ts
npm test -- 025-vengeful-spectre --case "does not apply"
npm test -- --list
npm test -- --cards --json
npm test -- --core
npm test -- --help
```

Filters accept exact card IDs, exact card names, filenames, repository-relative file paths, partial
card IDs/names, and `*` wildcards. `--fail-fast` stops on the first failure. `--json` produces
machine-readable output suitable for CI tooling.
