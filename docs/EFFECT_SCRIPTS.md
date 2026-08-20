# Generic effect scripting

Every catalog card has one executable JSON script in `src/data/effects/cards/`. The
filename and `cardId` match the generated catalog ID. This includes all 96 printed
Base Set cards and the six Energy cards.

The TypeScript contract is `src/game/effectTypes.ts`; the interpreter is
`src/game/effectRuntime.ts`. The match engine never switches on a card ID or card
name. A new card is implemented by composing selectors, conditions, expressions,
events, modifiers, and operations in JSON.

## Script sections

- `activated`: player actions, optional once-per-turn tracking, costs, and effects.
- `triggers`: event listeners such as played, targeted, Rotated, or Vanquished.
- `continuous`: live auras, restrictions, immunities, cost changes, and type grants.
- `attacks`: executable behavior keyed to each printed attack ID.
- `utility`: play conditions, reaction windows, attachment selectors, and effects.
- `energy`: the Energy identity and normal per-turn play rule.

Attacks use explicit phases. Effect dice are rolled first. Operations that set attack
Damage, failure, Critical status, Defense behavior, or Exhaustion are evaluated as
attack preparation. A natural 1 then stops the resolving effect program. Printed
effects, Attack Damage, after-Damage effects, and cleanup follow in order.

## Generic building blocks

Selectors query a controller and zone, then filter by card kind, functional Type,
Subtitle, Utility classification, row, Ready state, Condition, printed Energy Cost,
attachment, top-of-deck window, exclusions, or an `anyOf` union. Selected cards and
slots are stored as named references and linked into later operations.

Expressions use constants, the effect die result, surplus Energy, current attack
Damage, event Damage, Condition amount, counts, addition, and multiplication.
Conditions compose with `all`, `any`, and `not`, and can test selectors, stored
references, comparisons, parity, Conditions, event kind, source, and target.

The operation vocabulary is:

- choice: `choose`, `choose-slots`
- zones: `move`, `attach`, `vanquish`, `shuffle`, `reveal`
- cards: `draw`, `damage`, `heal`, `ready`, `exhaust`, `rotate`
- Conditions: `condition`, `remove-conditions`
- rules: `modifier`, `set-attack`, `prevent-vanquish`
- control flow: `if`, `for-each`, `roll`, `log`

The UI has one generic choice panel for targets, searches, optional selections,
ordered deck inspection, open positions, reactions, and effect-die abilities.

## Example

```json
{
  "version": 1,
  "cardId": "example-card",
  "attacks": [{
    "id": "example-attack",
    "effects": [
      {
        "op": "choose",
        "selector": {
          "zone": ["vanguard", "backguard"],
          "controller": "opponent",
          "kind": "unit"
        },
        "store": "target",
        "min": 1,
        "max": 1,
        "prompt": "Choose an opposing Unit."
      },
      { "op": "condition", "target": "target", "condition": "cowering" }
    ]
  }]
}
```

## Validation and verification

Catalog initialization fails fast when a card, printed ability, printed attack, or
Additional Attack lacks a script. It also rejects duplicate card IDs and unknown
operations. `npm run sync:cards` refuses to refresh the catalog if any card lacks
its JSON file.

`npm test` runs engine-level scenarios through Vite's module runtime, covering Unit
play, payment, dice, Defense Checks, Damage, Exhaustion, generic choices, Equipment,
Additional Attacks, continuous auras, triggers, Free Effect reactions, and Construction
completion.

A **Construction** Utility carries a runtime Completion counter and an `isDone` flag while
in play. Its scripted `continuous` / `triggers` / `activated` contributions are suppressed
by a single generic guard (`isDormantConstruction`) until it is Done, so no card-specific
branch is needed. Reaching Done runs nothing on its own; it simply brings those sections
online, so a passive Completed Effect starts applying and an activatable one becomes usable
under its own timing for as long as the Construction stays Done.

## Rules decisions required for play

The 2026-08-12 SSOT explicitly leaves several systems undecided. The executable game
uses these narrow defaults until the SSOT resolves them:

- decking out occurs when a required draw finds an empty deck;
- Effect Damage does not receive a Defense Check;
- forced Vanguard promotion uses the first occupied Backguard position, even if the
  Unit is Exhausted;
- each defined event opens one Free Effect response choice before queued triggers
  continue; the deterministic opponent uses its first legal response;
- there is no universal SUPER defeat penalty because none is defined;
- a turn readies cards, resolves start-of-turn Conditions, allows actions, resolves
  end-of-turn Conditions, and passes to the opponent.

These are core rule policies, not card-specific effects, and are isolated in the
engine/runtime so they can be changed without rewriting card JSON.
