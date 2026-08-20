# Making a new card

How to design, word, script, and ship one new Hyperverse card.

The rules authority is `docs/Hyperverse_TCG_Rules_SSOT_2026-08-12.md`. This document does
not invent rules; it defines the procedure, the design constraints a legal card must
satisfy, and the exact wording style printed card text must follow. Where the two
disagree, the SSOT wins and this document is wrong and must be fixed.

---

## 1. What a card actually consists of

A finished card is five artifacts, not one. A card that is missing any of them either
fails catalog initialization, fails the sync gate, or fails the test inventory gate.

| # | Artifact | Location | Authored by |
|---|---|---|---|
| 1 | Printed card data | `sets/Hyperverse_Base_Set_ORIG.render-request.json` in HyperTCGMaker | you, in the maker editor |
| 2 | Rendered art | `public/cards/<card-id>.png` | copied by `npm run sync:cards` |
| 3 | Typed catalog entry | `src/data/cardCatalog.generated.ts` | generated — never hand-edit |
| 4 | Executable effect script | `src/data/effects/cards/<card-id>.json` | you, by hand |
| 5 | Gameplay test | `src/game/cardTests/cards/<card-id>.test.ts` | you, by hand |

Two exceptions:

- **Alternative cards** (`103`+) are hand-authored in `src/data/alternativeCards.ts` as
  `CardDefinition` objects instead of coming from the maker, but still need artifacts
  2, 4, and 5. Their art lives at `public/cards/<card-id>.png`.
- **Energy cards** are synthesized in `src/data/catalog.ts` and are not designed per set.

The current catalog is 96 printed Base Set cards + 3 Alternative cards + 6 Energy cards
= 105, so there are exactly 105 effect scripts and 105 test files.

---

## 2. Workflow

1. **Design on paper first.** Decide character, fiction, Subtitle, Type, HP, DEF, Energy
   Cost, and what each attack physically depicts. Section 4 constrains all of these.
2. **Write the card in HyperTCGMaker.** Fill in every printed field (Section 3). Word all
   rules text to Section 5 before rendering — rewording later invalidates art, catalog,
   script, and tests at once.
3. **Render the card** in the maker so `output/<card-id>.png` exists and the set's
   `render-request.json` contains the entry.
4. **Write the effect script** at `src/data/effects/cards/<card-id>.json` (Section 6).
   Do this before syncing: `npm run sync:cards` refuses to run while any card in the
   render request lacks a script.
5. **Sync.**
   ```bash
   npm run sync:cards
   ```
   This copies the art, regenerates `cardCatalog.generated.ts`, and reports the card count.
   It defaults to `C:/Users/Styn/Documents/GitHub/HyperTCGMaker`; set `HYPERVERSE_MAKER_PATH`
   for another checkout.
6. **Write the gameplay test** at `src/game/cardTests/cards/<card-id>.test.ts` (Section 7).
7. **Optionally add the card to a deck** in `src/game/deck.ts` if it should be playable in
   the POC. Respect the copy limits in Section 4.
8. **Run every gate** (Section 8).

---

## 3. Printed fields

### Every card

Card kind (Unit or Utility), Name, Type, Energy Cost, Artwork, artwork position, Flavor
text, Set ID, Card number, Set total, Rarity.

- **Flavor text: maximum 35 characters.** Hard limit.
- Rarity is one of Common, Uncommon, Rare, Ultra, Secret (stored lowercase in the catalog).
- Card number is unique in the set; Set total stays constant across the set. Alternative
  cards are numbered beyond the set total.
- Artwork zoom/position is presentation only and creates no rules.

### Unit only

Subtitle, Unit treatment (Standard / SUPER / Alternative), HP, DEF, Primary Energy,
Abilities (name + text, any number including none), Attacks (any number including none).

### Utility only

Utility classification (Instant Effect / Continuous Effect / Equipment / Free Effect /
Construction), Utility content (Effect or Additional Attack), optional Condition text,
Effect text or a single Additional Attack. A **Construction** additionally prints a
**Completion Cost** (a whole number ≥ 1), always uses Effect content, and labels its Effect
the **Completed Effect**. Utility cards never show HP, DEF, Primary Energy, Abilities, or
a Subtitle.

### Attacks (Unit attacks and Additional Attacks)

Attack name, attack Energy cost, effect dice (D4/D6/D8/D10/D12/D20, more than one allowed),
Damage, attack effect text.

---

## 4. Design rules a legal card must satisfy

### Identity

- **Subtitle** is rules text, not decoration. Use the established vocabulary: Infantry,
  Specialist, Marksman, Tactician, Leader, Creation, Berserker, Bruiser, Machine, Spectre,
  Citizen, Assassin, Mystic, Gunner, Rogue, Hero. **Hero is deliberately rare.** Do not
  invent a Subtitle without amending the SSOT.
- **Type** carries faction identity (`Combine`, `TCR`, `X-Tremists`, `X-Perience`, …).
  Faction names go in Type, not glued onto the Name.
- Multiple Subtitles and multiple Types are **undecided** — do not use them.

### Statistics

- **HP** is derived from the character's durability, not from cost or rarity. Bands:
  ordinary human 40–70, trained human 60–90, armored/enhanced 80–120, superhuman or large
  creature 100–160, extremely durable monster/machine 140–200. Above ~200 needs an
  exceptional fictional reason; 180 should be extremely rare.
- **DEF** is 1–100 and expresses how reliably the character avoids a clean hit.
- HP and DEF are independent and compound each other. Pick a profile — high HP/low DEF,
  low HP/high DEF, or moderate in both. High HP *and* high DEF is boss territory.
- Neither stat is derived from Energy Cost, rarity, or SUPER status.

### Numbers

- **Every printed Damage value, and every Damage, HP, or DEF amount written in card text,
  is a multiple of 10.** The game never uses 5s.
- Die faces, die thresholds, card counts, and Energy counts are exempt.

### Costs

- Energy Cost may be any combination of the six types plus **Any**, including mono-type
  and all six. A two-symbol cost is mono-type or one type plus **Any**; a second real type
  needs three symbols or more.
- **Primary Energy** is the most frequent type in the Energy Cost. It only drives the card's
  color treatment, is never paid, and constrains nothing.
- Attack costs are independent of the Unit's Energy Cost. Cost flavor follows the Energy
  domains: Gluon = order/command/society, Photon = spirit/inspiration/belief,
  Electron = machines/knowledge/technique, Muon = freedom/rebellion/instinct,
  Boson = matter/strength/nature/scale, Neutrino = the unknown/occult/death/unreality.

### Attacks

- An attack deals Attack Damage **only if the depicted action could physically harm a
  Unit.** Negotiating, ordering, broadcasting, ruling, filing, searching, and repairing
  must be **N** or **BG** attacks. Non-combatants may legitimately have no damaging attack.
- Damage notation: `40` fixed, `40+` base plus extra added by that attack's own text,
  `10x` a multiple of a variable named in that attack's text, `N`, `BG`. `+` and `x`
  describe Attack Damage only, and only Damage written on the attack itself changes the
  notation — Damage added by an Ability, another card, or an Equipment does not.
- **N**: no printed Damage, Vanguard-only, no Critical d20.
- **BG**: usable from either row, no printed Damage, no Critical d20, does not also take
  the N marker. An attack can never have both BG and printed Damage.
- If the attack header lists an effect die, the text uses **[DR]** and never repeats a
  "Roll a d6" instruction.

### Classifications and deck legality

- Decks are exactly 60 cards, max 3 copies of a non-Energy card, Energy unlimited,
  **at most one Alternative card in total**.
- **SUPER**: one per player on the field; power band comparable to Pokémon ex/GX/V. Never
  print an individual SUPER drawback — the universal penalty (doubled surplus Damage) is
  already a rule.
- **Alternative**: always Secret Rare, numbered beyond the set total, must be a meaningfully
  different but recognizable version of the character. Alternative does not imply SUPER.
- Rarity manages complexity, spectacle, and collectability — not raw power. Competitive
  Commons are expected.

---

## 5. Wording, grammar, and sentencing

Card text is a controlled language. The goal is one clear rules reading in the fewest words.

### 5.1 Required forms

| Concept | Required form |
|---|---|
| Self-reference | **this card** |
| The opposing player | **Opponent** (always capitalized) |
| Unit taking Attack Damage | **Defending Unit** |
| Target of an N/BG attack | **targeted Unit** |
| Putting a card onto the field | **play**, **played** |
| A card's Energy requirement | **Energy Cost** |
| Choosing / referring back to a target | **target** / **targeted** |
| Unit controller | **Controller** |
| Damage in card text | **Damage** |
| Rows | **Vanguard**, **Backguard** |
| Unit states | **Ready**, **Exhausted** |
| Row movement | **Rotate**, **Rotated**, **Rotating** |
| Removal | **Vanquish**, **Vanquished**, **Vanquished Pile** |
| Persistent state category | **Condition** |
| Damage categories | **Attack Damage**, **Effect Damage** |
| Critical result / roll | **Critical Hit** / **Critical d20** |
| Defense roll | **Defense Check** |
| Attack markers | **N**, **BG** |
| Effect dice / result | **D4**–**D20** / **[DR]** |
| Utility classes | **Instant Effect**, **Continuous Effect**, **Equipment**, **Free Effect** |
| Unit classes | **SUPER**, **Alternative** |

### 5.2 Capitalization

- Capitalize every defined game term above, everywhere it appears, including **Opponent**
  in `your Opponent controls` and `your Opponent's next turn`.
- **targeted** stays lowercase in ordinary sentence position; capitalize only at the start
  of a sentence.
- Condition names are capitalized *and* bolded: `**Cowering**`, `**Infect for 10**`.
- Type and Subtitle names are written exactly as printed on the card.

### 5.3 Banned wording

- ❌ **select / selected** as a targeting term. Use target / targeted.
- ❌ **summon**. Units are *played*.
- ❌ A card's own printed name as self-reference. Use *this card*.
- ❌ `Energy Cost of 2 Energy or less` → ✅ `Energy Cost of 2 or less`.
- ❌ `**Combine** Unit` → ✅ `**Combine** type Unit`; with a Subtitle,
  `**TCR** type Tactician Unit`.
- ❌ `takes 20 Effect Damage` on ordinary effect text → ✅ `takes 20 Damage`. Damage from
  card text is already Effect Damage by rule; write **Effect Damage** only when the
  distinction itself matters.
- ❌ `Roll a d6. If the result is…` when the attack header already lists a D6 → ✅ `If **[DR]** is…`.
- ❌ `If this attack succeeds, …`. Attack text is assumed to resolve when the attack
  resolves; only write it when the card genuinely distinguishes success from use, failure,
  or payment.
- ❌ Restating core rules ("the Unit is Exhausted", "place it in the Vanquished Pile")
  unless the card interacts with that specific distinction.

### 5.4 Sentence templates

Use these shapes. All examples are real printed text.

**Targeting, then acting on the target.** Target first in its own sentence, then refer back
with *the targeted Unit*.

> Target 1 Unit your Opponent controls. The targeted Unit is afflicted with **Cowering** and cannot Rotate until the end of your Opponent's next turn.

**Untargeted area effects.** Name the set, then the effect.

> Each other Unit your Opponent controls in their Vanguard takes 20 Damage.

**Once-per-turn optional Abilities.** Timing → `you may` cost → `If you do,` payoff.

> Once during your turn, you may put 1 card from your hand on the bottom of your deck. If you do, draw 2 cards.

**Triggered Abilities.** `Whenever …, …` for repeatable triggers; `When this card is
played, …` for entry triggers.

> Whenever this card is targeted by an attack, the attacking Unit takes 10 Damage.

> When this card is played, look at the top 4 cards of your deck. Put 1 Utility card from among them into your hand and the rest on the bottom of your deck.

**Continuous / conditional statics.** Lead with the `While` clause.

> While this card is afflicted with a **Condition**, attacks used by this card deal 20 more Damage.

**Duration-first restrictions.** Lead with the duration clause.

> Until the end of your Opponent's next turn, Units your Opponent controls cannot Rotate.

**Effect-die outcomes.** Threshold form, or a bulleted pair for split outcomes.

> If **[DR]** is 6 or higher, this card does not become Exhausted.

> - **[DR]** even: the Defending Unit cannot Rotate until the end of your Opponent's next turn.
> - **[DR]** odd: the Defending Unit is afflicted with **Infect for 10**.

**Searching.** Name the zone, the count, the filter, and the destination in one sentence.

> Search your deck for 1 **Combine** type Unit with an Energy Cost of 2 or less and play it to your Backguard.

**Ordered deck inspection.** State what happens to the selection *and* to the remainder.

> Look at the top 5 cards of your Opponent's deck. Put 1 of them on the bottom of their deck and the rest back in any order.

**Utility Condition text.** `Play this card when …` / `Attach this card to …`.

> Play this card when a Unit you control would be Vanquished.

> Attach this card to a **TCR** type Unit or an Assassin Unit you control.

### 5.5 Clause order and punctuation

1. Timing or duration (`Once during your turn,` / `Until the end of your Opponent's next
   turn,` / `While this card …,`)
2. Condition or trigger (`If **[DR]** is 6 or higher,` / `Whenever this card is targeted
   by an attack,`)
3. Cost (`you may Vanquish 1 **Muon** Energy you control.`)
4. Effect (`If you do, inflict 20 Damage to that Unit.`)

- One rules step per sentence; end every sentence with a period.
- Use digits for counts: `1 Unit`, `2 cards`, `top 4 cards`.
- Write `up to 2` when the count is optional, a bare count when it is mandatory.
- Say `you may` only when the player can decline; otherwise use the imperative.
- Use `Then` to force sequencing that matters: `Rotate up to 2 Units you control. They do not become Exhausted. Then draw 1 card.`
- Speak to the controller as **you**; the other player is always **your Opponent**.
- Prefer `Defending Unit` on attacks with printed Damage, `targeted Unit` on N/BG attacks.

### 5.6 Rich-text notation

| Notation | Meaning |
|---|---|
| `**text**` | bold — used for Condition names, Types, Subtitle-defined groups, keyword-like stat deltas (`**+20 DEF**`), `**[DR]**` |
| `__text__` | italics |
| line starting `-` | bulleted list item |
| `[G] [P] [E] [M] [B] [N] [A]` | inline Energy symbols |
| `[D4]`…`[D20]` | inline die symbols |
| `[DR]` | effect die result |

Newlines inside a bulleted list are preserved; other newlines collapse to a single space
when rendered, so use bullets whenever two outcomes must read as parallel lines.

---

## 6. Scripting the card

Contract: `src/game/effectTypes.ts`. Interpreter: `src/game/effectRuntime.ts`. Overview:
`docs/EFFECT_SCRIPTS.md`. **The engine never switches on a card ID or name** — a new card
must be expressible by composing existing selectors, expressions, conditions, and
operations. If it isn't, extend the generic vocabulary; do not special-case the card.

File: `src/data/effects/cards/<card-id>.json`, with `"version": 1` and a `cardId` exactly
equal to the catalog ID.

```json
{
  "version": 1,
  "cardId": "001-admiral-asgore-dreemurr",
  "continuous": [],
  "triggers": [],
  "activated": [],
  "attacks": [],
  "utility": {}
}
```

Sections: `activated` (player actions, `once`, `costs`, `effects`), `triggers` (event
listeners), `continuous` (auras, restrictions, immunities, cost changes), `attacks`
(`prepare` / `effects` / `afterDamage` keyed to the printed attack ID), `utility`
(`condition`, `reaction`, `attach`, `effects`), `energy`.

A **Construction** is scripted like any other Utility, and the Completed Effect maps onto
the ordinary sections. Reaching Done does not run anything by itself: the Completed Effect
is whatever the card's `continuous` (passives), `triggers` (event responses), and
`activated` (abilities the player triggers) sections express, and the engine automatically
keeps all of them dormant until the Construction reaches its Completion Cost — no
card-specific branch is needed. `utility.effects` therefore stays empty for a Construction
(`"utility": { "effects": [] }`), exactly as for a Continuous Effect that only carries a
`continuous` aura. The engine reads the Completion Cost from the catalog's `completionCost`;
the script never restates it.

### ID binding rules

- Every printed Ability's `id` must appear as the `id` of an `activated`, `triggers`, or
  `continuous` entry. An Ability with both a static and a triggered part uses the **same
  ability id in both sections** (see `001-admiral-asgore-dreemurr.json`).
- Every printed attack `id`, and a Utility's Additional Attack `id`, must appear in `attacks`.
- Utility cards must have a `utility` section; Energy cards must have an `energy` section.
- Equipment `continuous` entries use their own descriptive ids (`deploy-armor-defense`)
  because Utility cards have no printed Abilities.
- IDs are maker-generated and stable: `<name-slug>-<ability-slug>-<index>` for abilities,
  a unique slug per attack, `<attack-id>-d6-0` per die. **Never rename an ID after scripts
  or tests exist** — nothing links them but the string.

### Built-in card references

`source` (this card), `attacker`, `defender`, `event-source`, `event-target`,
`equipped-unit`, plus anything you `store` with `choose` / `choose-slots` / `for-each`.

### Text-to-script mapping

| Printed wording | Script shape |
|---|---|
| `Target 1 Unit your Opponent controls.` | `choose` with `controller: "opponent"`, `min`/`max` 1, `store: "target"` |
| `The targeted Unit …` | operations against `"target"` |
| `Once during your turn, you may …` | `activated` with `timing: "action"`, `once: "turn"` |
| `Whenever this card is targeted by an attack, …` | `triggers` with `event: "attack-targeted"`, `condition: { eventTarget: "source" }` |
| `When this card is played, …` | `triggers` with `event: "played"` |
| `While … , Units you control get +20 DEF` | `continuous` with `kind: "defense"` and a `condition` |
| `Until the end of your Opponent's next turn, … cannot Rotate` | `modifier` with `kind: "cannot-rotate"`, `duration: "opponent-next-turn"` |
| `If **[DR]** is even: … odd: …` | `if` on `{ parity: { value: { value: "dr" }, is: "even" } }` with `then`/`else` |
| `This attack deals 10 Damage for each Energy Exhausted` | `set-attack` in `prepare` using `{ value: "surplus" }` |
| `Search your deck for 1 …` | `choose` over `zone: "deck"` then `move` |
| `Play this card when a Unit you control would be Vanquished.` | `utility.reaction` with `event: "would-vanquish"` |
| `Attach this card to …` | `utility.attach` selector; the runtime adds the choose + attach |
| `is afflicted with **Infect for 10**` | `condition` op with `condition: "infected"`, `amount: 10` |

Prefer a `condition` on the entry over branching inside effects when the branch is a
static legality question; prefer `if` when both branches produce effects.

---

## 7. Testing the card

File: `src/game/cardTests/cards/<card-id>.test.ts`. The inventory gate is strict — a
missing, duplicate, unknown, or misnamed file fails the run, and **every** JSON attack,
activated ability, trigger, continuous effect, Utility, and Energy play needs at least one
scenario. **Any effect section containing conditional logic needs at least two scenarios
that execute different outcomes**, so a single happy path cannot pass.

```ts
import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '<card-id>',
  scenarios: [
    s.attack('<attack-id>', { effectRoll: 2, expect: [s.lastDamage(60), s.condition('defender', 'infected', false)] }),
    s.attack('<attack-id>', { name: '<what this second outcome proves>', effectRoll: 1, expect: [s.condition('defender', 'infected', true, 10)] }),
  ],
});
```

Scenario builders: `attack`, `activated`, `trigger`, `continuous`, `utility`, `energy`,
`construction`, `opponentAttack`, `friendlyAttack`, `opponentPlayUnit`. Options include
`name`, `covers`, `setup`, `choices`, `effectRoll`, `criticalRoll`, `defenseRoll`,
`surplus`. `construction` starts the card in play in the Utility zone and advances it once;
tune `setup.sourceCompletion` (and `setup.sourceDone`) so that single advance completes it
or leaves it dormant. Cover `utility` by playing the card (`utility` builder, assert it
lands in the Utility zone), and cover each Completed-Effect section — `continuous:<id>`,
`trigger:<id>`, `activated:<id>` — with `setup.sourceDone: true` so the section is live,
plus a dormant case (`sourceDone: false`) proving it stays off until Done.

Expectations: `hpChange`, `hp`, `playerHpChange`, `condition`, `ready`, `zone`,
`zonePosition`, `row`, `zoneCountChange`, `modifier`, `modifierTotal`, `lastDamage`,
`attached`, `attackAvailable`, `tappedChange`, `usedAction`, `logIncludes`, `error`,
`winner`, `owner`, `attackBlocked`, `remainsExhaustedNextTurn`.

Rules of thumb:

- Assert observable state, not internals: HP deltas, Conditions, zones, modifiers, rolls.
- Pin every die you depend on (`effectRoll`, `criticalRoll`, `defenseRoll`) so scenarios
  are deterministic.
- Use `covers: ['trigger:<id>', 'continuous:<id>']` when one scenario proves several
  sections at once.
- Give any scenario beyond the first an explicit `name` describing the outcome it proves.

---

## 8. Gates before the card is done

```bash
npm run sync:cards
```
```bash
npm run build
```
```bash
npm test -- <card-id>
```
```bash
npm test
```
```bash
npm run lint
```

What each catches: `sync:cards` refuses to regenerate the catalog while any card lacks a
JSON script; catalog initialization (`validateEffectScripts`) rejects duplicate card IDs,
unknown operations, unsupported versions, scripts with no matching card, and any Ability,
attack, Additional Attack, Utility, or Energy without an executable script; `npm test`
runs the inventory gate plus every scenario through the real engine.

### Final checklist

- [ ] Flavor text ≤ 35 characters
- [ ] Every Damage/HP/DEF number in text and on attacks is a multiple of 10
- [ ] DEF within 1–100; HP inside its band for the character
- [ ] Primary Energy is the most frequent type in the Energy Cost
- [ ] Non-harmful actions are N or BG, not damaging attacks
- [ ] Damage notation matches the attack's own text (`40` / `40+` / `10x` / `N` / `BG`)
- [ ] Text uses `this card`, `Opponent`, `target`/`targeted`, `Defending Unit` vs
      `targeted Unit`, `[Type] type Unit`, and no `select`/`summon`/redundant
      `Effect Damage`
- [ ] No repeated die-roll instruction when the header lists the die
- [ ] Every Ability id, attack id, and Additional Attack id is bound in the JSON script
- [ ] Conditional sections have at least two outcome scenarios in the test
- [ ] Card number, Set ID, Set total, and rarity are correct; Alternative is Secret and
      numbered beyond the set total
- [ ] Deck copy limits respected if the card was added to `src/game/deck.ts`

---

## 9. Undecided — do not design around these

Named-Unit uniqueness, full turn sequence, draw timing after the first-turn restriction,
the exact decking-out trigger, reaction windows and priority, forced promotion with no
Ready Backguard Unit, multiple Subtitles, multiple Types, exact Utility placement/zone,
Equipment handling when a Unit leaves play unvanquished, default Defense interaction for
Effect Damage, natural vs modified die values for Critical results, and whether another
SUPER may be played after the first is Vanquished.

A new card must not depend on any of these. The engine's temporary defaults are listed at
the end of `docs/EFFECT_SCRIPTS.md`; they are engine policy, not card design licence.
