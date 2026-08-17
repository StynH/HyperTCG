# Hyperverse TCG Rules

**Status:** Master rules document  
**Revision:** 2026-08-12 (revised during Base Set card design)

This document is the single source of truth for the current Hyperverse TCG rules. Only established rules are stated as rules. Undecided systems are listed at the end.

---

## 1. Card Types

The game currently uses three main card types:

- **Unit**
- **Utility**
- **Energy**

Utility cards have four classifications:

- **Instant Effect**
- **Continuous Effect**
- **Equipment**
- **Free Effect**

A Unit may also have a special classification:

- **SUPER**
- **Alternative**

---

## 2. Unit Cards

A Unit card may contain:

- Name
- Subtitle
- Type
- HP
- DEF
- Energy Cost
- Primary Energy
- Abilities
- Attacks
- Flavor text
- Set ID
- Card number
- Set total
- Rarity

Abilities are optional.

A Unit may have any number of attacks permitted by its layout, including none.

There is no mandatory structure such as one Ability and two attacks.

### Subtitle / Archetype

The line directly beneath a Unit's name is its functional **Subtitle**.

The Subtitle is the Unit's archetype. Cards may refer to a Unit by its Subtitle. The Subtitle is part of the card's rules identity and is not decorative text.

The current Subtitle vocabulary is:

- **Infantry**
- **Specialist**
- **Marksman**
- **Tactician**
- **Leader**
- **Creation**
- **Berserker**
- **Bruiser**
- **Machine**
- **Spectre**
- **Citizen**
- **Assassin**
- **Mystic**
- **Gunner**
- **Rogue**
- **Hero**

**Hero** is intended to be used rarely in card design.

Whether a Unit may have multiple Subtitles is not yet defined.

### Functional Types

Cards may have functional **Types**.

Card effects may refer to cards by their printed Type. Type matching is based on the functional Type printed on the card, not on words appearing in the card's name.

Faction and group identities such as **Combine**, **TCR**, **X-Tremists**, and **X-Perience** are expressed through the Type field rather than being automatically prefixed to a card's Name.

When rules text refers to a Type, use the explicit form **“[Type] type Unit”**. When both Type and Subtitle are relevant, use **“[Type] type [Subtitle] Unit”**.

Examples of the required structure:

- **Combine type Unit**
- **Combine type Infantry Unit**
- **TCR type Tactician Unit**

Whether a card may have multiple functional Types is not yet defined.

### Primary Energy

A Unit's **Primary Energy** controls its visual card-color treatment.

Primary Energy is the Energy type the Unit leans toward the **most**. It is the most frequent Energy type in that Unit's Energy Cost.

Primary Energy does **not** restrict or define the Unit's Energy Cost or its attack costs, and it is never paid.

There is no Primary/Secondary Energy system.

A Unit may have an Energy Cost containing any legal combination of Energy types, including mono-type, multi-type, all six Energy types, and **Any** costs. Mono-type Units are intentional and fully supported. Each attack independently uses whatever Energy combination fits that action.

Because a two-symbol cost splits evenly, a second Energy type is only expressible from three symbols upward. A two-symbol Energy Cost is therefore either mono-type, or one type plus **Any**.

### Self-Reference

When a card refers to itself in rules text, it always uses **“this card”**.

A card does not use its own printed name as self-reference.

### Targeting

When rules text identifies a specific card or Unit as a target, use **target** and **targeted**.

**Select** and **selected** are not interchangeable targeting terms and are not used as substitutes for target or targeted.

The word **targeted** is not capitalized unless normal sentence capitalization requires it.

### HP

HP represents the amount of damage a Unit can take.

A Unit is Vanquished when its HP reaches 0 or lower.

### DEF

DEF ranges from 1 to 100 and is used for Defense Checks.

### HP and DEF Independence

HP and DEF are independent statistics.

There is no rule or balance assumption that links a Unit's HP to its DEF. A Unit with high HP does not inherently receive high DEF, and a Unit with low HP does not inherently receive low DEF.

Each statistic must be balanced separately because DEF affects repeated incoming Attack Damage across the life of the Unit.

---

## 3. Ready and Exhausted

A Unit is either **Ready** or **Exhausted**.

- A Ready Unit may perform actions allowed by the rules and its card text.
- An Exhausted Unit cannot normally attack or Rotate.
- Units enter play Ready.
- Units may attack during the turn they are played.
- A Unit normally becomes Exhausted when it uses an attack.
- A Unit remains Exhausted even if its attack fails.
- Card text may prevent or override Exhaustion.

Energy cards are tapped when used as payment and become available again when they are Readied.

---

## 4. Battlefield

Each player controls two Unit rows:

- **Vanguard**
- **Backguard**

### Vanguard

Units in the Vanguard may normally:

- Attack
- Be targeted by enemy attacks

### Backguard

Units in the Backguard normally:

- Cannot attack
- Cannot be targeted by enemy attacks
- May still use Abilities
- May use attacks marked **BG**

### Empty Vanguard

If a player's Vanguard is empty, that player must move a Unit from their Backguard into the Vanguard.

### Rotation

Moving a Unit between the Vanguard and Backguard is called **Rotating**.

To Rotate a Unit voluntarily:

1. The Unit must be Ready.
2. Move it to the other row.
3. Exhaust it.

The Ready requirement applies to voluntary Rotation. If a card effect instructs a Unit to Rotate, resolve that Rotation even if the Unit is Exhausted unless the effect says otherwise.

A Unit keeps all Damage, Equipment, Conditions, and ongoing modifiers when it Rotates.

---

## 5. Match Setup and Victory

### Deck Construction

- A deck contains exactly **60 cards**.
- A deck may contain up to **3 copies** of the same non-Energy card unless another rule states otherwise.
- Energy cards are exempt from the normal copy limit and may be included without limit.
- The Alternative deck limit still applies independently.

### Opening Hand

Each player begins the game with **7 cards** in their hand.

Before the first turn begins, each player may choose up to **3 cards** from their opening hand to mulligan. Shuffle the chosen cards back into that player's deck, then draw the same number of cards. A player may keep all 7 cards by choosing no cards to mulligan.

### Battlefield Capacity

Each player has:

- **5 Vanguard slots**
- **5 Backguard slots**

A player may therefore control up to 10 Units across those two rows unless a card effect or future rule states otherwise.

### Player HP

Each player begins the game with **250 HP**.

If a player's HP reaches 0 or lower, that player loses the game.

### Direct Attacks

If a player controls no Units, that player may be attacked directly.

Damage from a direct attack is dealt to that player's HP.

### Decking Out

Decking out is a loss condition.

The exact rules event that causes an empty deck to count as decking out is not yet defined.

### First-Turn Restrictions

On each player's own first turn:

- That player does not draw a card.
- That player cannot attack.

These restrictions apply to both players on their respective first turns.

---

## 6. Energy

Energy works as a permanent resource.

### Playing Energy

- A player may normally play one Energy card per turn.
- Newly played Energy may be tapped immediately.
- Energy is tapped to pay Energy Costs, Utility costs, and attack costs.

### Energy Types

The six Energy types are:

- Gluon
- Photon
- Electron
- Muon
- Boson
- Neutrino

A generic or **Any** cost may be paid with Energy of any type.

### Surplus Energy

When paying for an attack:

- The printed cost must be satisfied.
- The player may tap additional Energy of any type.
- Surplus Energy has no effect unless card text refers to it.

Cards do not need to grant permission to use surplus Energy.

### Vanquished Energy

Energy may be Vanquished by costs and effects.

Vanquished Energy is placed in its owner's Vanquished Pile.

---

## 7. Energy Domains and Costs

Energy domains describe broad fictional archetypes rather than morality alone.

| Energy | Domain |
|---|---|
| **Gluon** | Order, command, society, unity |
| **Photon** | Spirit, inspiration, expression, belief |
| **Electron** | Machines, knowledge, technique, information |
| **Muon** | Freedom, rebellion, instinct, individuality |
| **Boson** | Matter, strength, nature, physical scale |
| **Neutrino** | The unknown, occult, death, alienness, unreality |

A Unit's Energy Cost represents what that version of the character embodies.

An attack's Energy cost represents the nature of the action being performed.

A Utility's Energy cost represents the nature of the effect, object, action, or resource being used.

Costs may use one Energy type or any combination of multiple Energy types. A cost may use all six Energy types when appropriate.

**Any** costs may be paid with Energy of any type.

A Unit's Primary Energy color is presentation only and does not constrain any of these costs.

---

## 8. Playing Units

To play a Unit:

1. Pay its Energy Cost by tapping the required Energy.
2. Place it into a legal Unit position.

The Unit enters play Ready.

A Unit played this turn may attack during the same turn if its position permits the attack and its controller can pay the attack cost.

Units are **played**. They are not summoned.

---

## 9. Attacks

To use an attack:

1. Choose a Ready Unit.
2. Choose one of its attacks.
3. Confirm that its current row permits that attack.
4. Choose all required targets.
5. Pay the printed attack cost.
6. Optionally pay surplus Energy.
7. Pay any additional costs.
8. Exhaust the attacking Unit.
9. Resolve the attack according to the rules below.

Attack text is assumed to resolve when the attack resolves. Wording such as “If this attack succeeds” is unnecessary unless the card specifically distinguishes success from use, failure, payment, or another timing event.

### Attack Resolution Order

For a damaging attack:

1. Roll any separate effect dice required by the attack and determine their pending outcomes.
2. Apply any effect that modifies, replaces, or determines the Critical d20.
3. If the Critical d20 was not replaced, roll it.
4. If the attack fails, end the attack without applying its damage or pending effects.
5. Otherwise, apply the attack's effects and resolve its printed damage.

For an N or BG attack:

1. Roll any effect dice required by the attack.
2. Resolve the attack's effects.

---

## 10. Damaging Attacks and the Critical d20

Every attack with printed damage normally rolls one universal **Critical d20**.

The Critical d20 is rolled after the attack's separate effect dice.

| Natural d20 result | Outcome |
|---:|---|
| **1** | The attack fails. |
| **2-19** | Resolve the attack normally. |
| **20** | Critical Hit. Double the attack's current Damage after all Damage modifiers have been applied. |

### Attack Failure

When the Critical d20 rolls a natural 1:

- The attack fails.
- The attack deals no printed damage.
- The attack's effects do not resolve.
- Paid Energy remains tapped.
- Additional costs remain paid.
- The attacking Unit remains Exhausted.

### Critical Hit

A Critical Hit doubles the attack's current Damage after all Damage increases and reductions have been applied.

If an attack's Damage has been increased or reduced, that modified Damage value is the value doubled by the Critical Hit.

Damage written inside effect text is not doubled by the Critical Hit.

A Critical Hit caused by card text is resolved in the same way as a Critical Hit caused by a natural 20.

### Influencing or Replacing the Critical d20

Card effects may influence, modify, reroll, replace, or determine the Critical d20.

The Critical d20 cannot be repurposed as an effect die, and its result cannot be used to resolve an attack effect.

If an effect states:

> This attack is a Critical Hit.

the Critical d20 is overridden and is not rolled for that attack.

---

## 11. N Attacks

An attack marked **N** has no printed damage and is Vanguard-only by default.

An N attack:

- Does not roll the universal Critical d20.
- Cannot Critical through the universal attack rule.
- May inflict Effect Damage through its text.
- May use separate effect dice.
- Still costs Energy.
- Still Exhausts the Unit unless card text says otherwise.
- Cannot be used from the Backguard unless another effect explicitly permits it.

---

## 12. Effect Dice

An attack may list a separate effect die in its attack header, such as **D4**, **D6**, **D8**, **D10**, **D12**, or **D20**.

When an effect die is listed in the attack header, that die is rolled as part of using the attack. The effect text does not repeat instructions such as **“Roll a d4.”**

**[DR]** means the result of the effect die listed in that attack's header.

An effect die may be any specified die, including a d20.

Effect dice:

- Are rolled before the universal Critical d20 when used by a damaging attack.
- Resolve only the effect printed beside them.
- Are separate from the universal Critical d20.
- Do not Critical or Critically Fail unless the card explicitly defines those results.
- May influence, modify, replace, or determine the later Critical d20 when the card explicitly says so.
- May use thresholds, ranges, exact values, odd or even values, or other printed conditions.

A damaging attack may therefore use both:

- One or more separate effect dice
- The later universal Critical d20, unless it is overridden

---

## 13. BG Attacks

An attack marked **BG** may be used while its Unit is in the Backguard.

A BG attack:

- May be used from either the Vanguard or Backguard.
- Has no printed attack damage.
- Does not roll the universal Critical d20.
- May inflict Effect Damage through its text.
- May use separate effect dice.
- Still costs Energy.
- Still Exhausts the Unit unless card text says otherwise.

An attack cannot have both BG and standard printed damage.

A BG attack does not also require the N marker.

---

## 14. Attack Damage and Effect Damage

### Attack Damage

**Attack Damage** is Damage dealt by the Damage value of an attack after all increases and reductions affecting that attack have been applied.

Attack Damage:

- Uses the universal Critical d20.
- May be increased or reduced by card effects.
- Is subject to a Defense Check.

When an attack becomes a Critical Hit, first apply all Damage modifiers to that attack. Then double the resulting Damage value.

### Printed Damage Notation

An attack's printed Damage value uses this notation:

| Notation | Meaning |
|---|---|
| **40** | A fixed Attack Damage value. |
| **40+** | A base value, plus extra Attack Damage added by that attack's own text. |
| **10x** | The attack has no fixed base. Its Attack Damage is a multiple of a variable named in that attack's text. |
| **N** | An N attack. No printed Attack Damage. |
| **BG** | A BG attack. No printed Attack Damage. |

The **+** and **x** notations describe Attack Damage only.

Only Damage written on the attack itself changes its notation. Damage added by an Ability, by another card, or by an Equipment does not make an attack **+**.

### Effect Damage

**Effect Damage** is Damage caused by card text or a Condition rather than by the Damage value of an attack.

Effect Damage:

- Does not roll its own Critical d20.
- Cannot Critical on its own.
- Is not doubled by the Critical Hit of the attack that created it.

Cards may specifically prevent or ignore Effect Damage.

---

## 15. Defense Checks

### The Defending Unit

The Unit taking Attack Damage from an attack is the **Defending Unit**. It is the Unit that rolls the Defense Check.

Card text uses **targeted** when a card is choosing a target, and **Defending Unit** when referring to the Unit that an attack with printed Attack Damage is resolving against.

**N** and **BG** attacks have no printed Attack Damage and cause no Defense Check, so their text refers to the **targeted** Unit instead.

### Rolling the Check

When a Unit takes Attack Damage, roll a d100 using two d10s.

- One d10 is the tens digit.
- One d10 is the ones digit.
- 00 counts as 100.

| Natural d100 result | Outcome |
|---:|---|
| **1-5** | Critical Defense. Negate the damage. |
| **95-100** | Critical Defense Failure. Double the damage. |
| **Any other result equal to or below DEF** | Successful Defense. Halve the damage. |
| **Any other result above DEF** | Failed Defense. Take normal damage. |

Critical Defense and Critical Defense Failure override the Unit's DEF value.

### Damage Order

Resolve attack Damage in this order:

1. Start with the attack's printed Damage.
2. Apply all Damage increases and reductions affecting that attack.
3. If the attack is a Critical Hit, double the resulting Damage.
4. Roll the defending Unit's Defense Check.
5. Apply the Defense result.
6. Round divided Damage down in favor of the defender.
7. Remove the final Damage from the Unit's HP.
8. Vanquish the Unit if its HP reaches 0 or lower.

A Critical Hit followed by a Critical Defense Failure deals four times the attack's modified Damage value from before the Critical Hit was applied.

### DEF Modification

Card effects may increase, reduce, ignore, replace, or otherwise modify DEF and Defense Checks.

Unless card text says otherwise, the Critical Defense ranges remain 1-5 and 95-100.

---

## 16. Conditions

**Conditions** are defined persistent states that may be applied to Units.

The current Conditions are:

- **Paralyzed**
- **Cowering**
- **Weakened**
- **Infected**
- **Doomed**
- **Cursed**
- **Tranquil**

Damage caused by a Condition is **Effect Damage**.

### Paralyzed

A Paralyzed Unit cannot Attack or Rotate.

Paralyzed lasts through two of that Unit's Controller's turns. The turn in which the Unit becomes Paralyzed counts immediately, even if Paralyzed is applied during that Controller's turn.

Remove Paralyzed at the end of the Controller's second turn counted this way.

### Cowering

A Cowering Unit cannot Attack.

At the end of that Unit's Controller's turn, flip a coin. On heads, remove Cowering.

### Weakened

A Weakened Unit cannot roll for a Critical Hit.

### Infected

Infected is written on card text as **Infect for X**, where X is the amount of Damage dealt by the Condition.

At the start of an Infected Unit's Controller's turn, that Unit takes X Effect Damage.

Infected does not clear on its own.

Infected does not stack. If an Infected Unit is afflicted with Infected again, the new **Infect for X** value replaces the existing value.

### Doomed

At the start of a Doomed Unit's Controller's next turn, Vanquish that Unit.

Doomed is intended to appear rarely in card design.

### Cursed

At the end of a Cursed Unit's Controller's turn, that Controller targets another Unit they control. The targeted Unit takes 20 Effect Damage.

### Tranquil

If a Tranquil Unit would be afflicted by any Condition other than Tranquil, remove Tranquil instead.

### Condition Immunity

A card may be unaffected by Conditions.

Condition immunity does not automatically prevent:

- Attack Damage
- Effect Damage that is not caused by a Condition
- Exhaustion
- Rotation
- DEF modification
- Targeting
- Vanquishing
- Utility effects

---

## 17. Utility Cards

Utility cards are non-Unit cards with an initial Energy cost.

### General Rules

- A player may play any number of Utility cards during their turn if they can pay the costs.
- Utility cards do not occupy Vanguard or Backguard positions.
- Utility cards cannot normally be played during the opponent's turn.
- **Free Effect** is the default exception to that timing restriction.
- Utility cards may be destroyed or Vanquished by card effects.

### Instant Effect

An Instant Effect:

- Resolves once.
- Is Vanquished after resolving.
- Cannot normally be played during the opponent's turn.

The word **Instant** describes a one-use Utility classification and does not grant opponent-turn reaction timing.

### Continuous Effect

A Continuous Effect:

- Remains in play after being played.
- Applies or triggers its effect while it remains in play.
- Has no universal field limit.

### Equipment

Equipment:

- Attaches to a legal Unit.
- Remains attached while in play.
- May grant effects, statistics, or Additional Attacks.
- May be destroyed or Vanquished separately.
- Is Vanquished when the equipped Unit is Vanquished.

A Unit may have up to two Equipment cards attached.

### Free Effect

A Free Effect:

- Is played from the hand.
- May be played during either player's turn.
- Resolves once.
- Is Vanquished after resolving.

Free Effects provide the game's default form of Utility interaction during the opponent's turn.

The exact reaction windows and priority rules governing when a Free Effect may be inserted into an action or attack sequence are not yet defined.

### Additional Attacks

An Additional Attack granted by Equipment is treated as an attack available to the equipped Unit and follows the normal attack rules unless the Equipment says otherwise.

---

## 18. Searching

Cards may instruct a player to search a defined zone, including:

- Deck
- Vanquished Pile
- Another named zone

Searching a public pile is still called searching.

---

## 19. Vanquishing

When a card is Vanquished, place it into its owner's Vanquished Pile unless card text says otherwise.

When a Unit is Vanquished:

- All Equipment attached to it is also Vanquished.

Units, Utility cards, and Energy may all be Vanquished.

### Surplus Damage

Whenever a Unit is Vanquished, any surplus Damage is inflicted on the player who controlled that Unit.

- Surplus Damage is the amount of Damage beyond what was required to reduce the Unit's HP to 0.
- Example: a Unit with 10 HP remaining that takes 30 Damage is Vanquished with 20 surplus Damage; its controller loses 20 HP.
- A Unit Vanquished by an effect that does not deal Damage (for example, a direct Vanquish or the Doomed condition) produces no surplus Damage.
- If a **SUPER** Unit is Vanquished, its surplus Damage is doubled before being inflicted on its controller.
- Surplus Damage that reduces a player's HP to 0 causes that player to lose the match.

### Face-Down Vanquished Cards

A card Vanquished face down remains face down and unknown in the Vanquished Pile.

A face-down card in a Vanquished Pile cannot be:

- Looked at
- Targeted
- Moved by card effects

---

## 20. SUPER Units

SUPER is a boss-level Unit classification.

### Field Limit

A player may control only one SUPER Unit on the field at a time, regardless of its position.

A player cannot play another SUPER while already controlling one.

### Universal Defeat Penalty

When a SUPER Unit is Vanquished, its controller suffers the universal SUPER penalty.

The penalty:

- Is identical for every SUPER Unit.
- Is not individually printed as a different drawback on each SUPER card.
- Doubles the surplus Damage inflicted on the controller when the SUPER Unit is Vanquished (see [Surplus Damage](#surplus-damage)).

SUPER is a classification and does not replace rarity.

---

## 21. Alternative Units

Alternative Units represent alternate Hyperverse versions of established characters.

### Deck Limit

A deck may contain only one Alternative card in total.

### Rarity and Numbering

Alternative cards:

- Are always Secret Rare.
- Are numbered beyond the regular set total.
- Are intended to appear approximately once per 90 booster packs.

The pack rate is a product rule rather than a gameplay rule.

### Identity

An Alternative card must represent a meaningfully different version of a character while remaining recognizably that character.

The difference may involve appearance, equipment, history, allegiance, powers, role, personality expression, or universe of origin.

Alternative does not automatically mean SUPER.

---

## 22. Successfully Played and Alternate Wins

Rules text may distinguish between a card **entering play** and being **successfully played**.

A card is successfully played only after the play has completed without being interrupted.

If a card effect states that a player wins the game when a card is successfully played, the win occurs only after that play succeeds.

The exact reaction windows, interruption timing, and priority rules are not yet defined.

---

## 23. Card Text Wording and Capitalization

Card rules text uses consistent functional terminology. These forms must remain consistent when cards are written or revised.

| Concept | Required form |
|---|---|
| Self-reference | **this card** |
| The opposing player | **Opponent** — always capitalized |
| Unit taking Attack Damage | **Defending Unit** |
| Putting a card onto the field | **play**, **played** |
| A card's Energy requirement | **Energy Cost** |
| Choosing a target | **target** |
| Referring back to a target | **targeted** |
| Unit card | **Unit** |
| Unit controller | **Controller** |
| Energy card/resource | **Energy** |
| Damage value or damage in card text | **Damage** |
| Front row | **Vanguard** |
| Back row | **Backguard** |
| Unit state | **Ready**, **Exhausted** |
| Row movement | **Rotate**, **Rotated**, **Rotating** |
| Defeat/removal term | **Vanquish**, **Vanquished** |
| Discard-like pile | **Vanquished Pile** |
| Defined condition category | **Condition** |
| Attack-based damage category | **Attack Damage** |
| Effect-based damage category | **Effect Damage** |
| Critical result | **Critical Hit** |
| Universal attack critical roll | **Critical d20** |
| Defense roll | **Defense Check** |
| Attack markers | **N**, **BG** |
| Effect die notation | **D4**, **D6**, **D8**, **D10**, **D12**, **D20**, etc. |
| Effect die result | **[DR]** |
| Utility classifications | **Instant Effect**, **Continuous Effect**, **Equipment**, **Free Effect** |
| Unit classifications | **SUPER**, **Alternative** |
| Printed Damage notation | **40**, **40+**, **10x**, **N**, **BG** |

Additional wording rules:

- **Opponent** is always capitalized, including in forms such as **your Opponent controls** and **your Opponent's next turn**.
- Units are **played**, never summoned. The cost paid is the **Energy Cost**.
- Write **Energy Cost of 2 or less**, not **Energy Cost of 2 Energy or less**. The term already names what is being counted.
- Use **Defending Unit** on attacks with printed Attack Damage, and **targeted Unit** on **N** and **BG** attacks.
- Do not use a card's printed name for self-reference when **this card** is intended.
- Do not use **select** or **selected** as substitutes for **target** or **targeted**.
- **targeted** remains lowercase in ordinary sentence position.
- Printed functional Type names are written exactly as printed on the card and are referenced by Type rather than by matching words in a card's name.
- Normal grammatical capitalization still applies at the beginning of a sentence.
- When an attack header already lists its effect die, do not repeat a die-roll instruction in the attack text.
- Use **[DR]** in attack text when referring to the result of the effect die listed in that attack's header.

- Damage caused by card effect text is already **Effect Damage** by rule. Card text normally says a target **takes X Damage** rather than redundantly saying **takes X Effect Damage**. Write **Effect Damage** explicitly only when the distinction itself matters.
- When referring to a functional Type, write **“[Type] type Unit”** rather than forms such as **“[Type] Unit.”**
- When referring to both a functional Type and Subtitle, write **“[Type] type [Subtitle] Unit.”**
- Use the shortest wording that produces one clear rules interpretation. Do not restate consequences already defined by the core rules unless the card specifically interacts with that distinction.

---

## 24. Card Elements and Printed Data

This section defines the content and visual data that may appear on cards. Presentation-only elements do not create gameplay rules unless another rule says otherwise.

### Shared Elements

For the current Unit/Utility card layout, cards may contain:

- **Card kind** — Unit or Utility
- **Name**
- **Type**
- **Energy Cost**
- **Artwork**
- **Artwork position** — presentation only
- **Flavor text** — maximum 35 characters
- **Set ID**
- **Card number**
- **Set total**
- **Rarity**

The established rarity names are:

- **Common**
- **Uncommon**
- **Rare**
- **Ultra**
- **Secret**

### Unit-Only Elements

Unit cards may contain:

- **Subtitle**
- **Unit treatment** — Standard, SUPER, or Alternative
- **HP**
- **DEF**
- **Primary Energy** — controls visual color treatment
- **Abilities**
- **Ability name**
- **Ability text**
- **Attacks**

### Utility-Only Elements

Utility cards may contain:

- **Utility classification** — Instant Effect, Continuous Effect, Equipment, or Free Effect
- **Utility content** — Effect or Additional Attack
- **Condition** — optional rules text explaining when or how the Utility can be used
- **Effect text**
- **Additional Attack**

Utility cards do not display HP, DEF, Primary Energy, Unit Abilities, or Unit Subtitle.

### Attack Elements

Unit attacks and Additional Attacks may contain:

- **Attack name**
- **Attack Energy cost**
- **Effect dice** — D4, D6, D8, D10, D12, D20, etc.; more than one may be present
- **Damage**
- **Attack effect**

### Rich-Text Notation

Rules text may use:

- `**text**` for bold
- `__text__` for italics
- Bulleted lines
- `[G] [P] [E] [M] [B] [N] [A]` for inline Energy symbols
- `[D4] [D6] [D8] [D10] [D12] [D20]` for inline die symbols

### Automatically Generated Visual Elements

The card presentation may automatically generate:

- Side rail identity
- Padded Card ID
- Rarity display
- Empty-art state
- Section labels
- Technical decoration

These visual elements do not store additional gameplay data.

The complete printed-field layout for **Energy** cards is not yet separately defined beyond their Energy identity and normal set/card metadata.

### Internal Identifiers

Abilities, attacks, and individual dice entries may carry internal editor IDs. These IDs are not displayed and have no gameplay meaning.

---

## 25. Design Guidelines — Not Gameplay Rules

The following are established design constraints for creating cards. They do not themselves create gameplay rules.

### HP and DEF

HP and DEF are derived from the character, not from the card.

HP answers how much punishment that specific character can physically survive. DEF answers how reliably that character avoids taking a clean hit, through armor, agility, shields, defensive skill, supernatural protection or positioning.

Neither statistic is derived from Energy Cost, rarity or SUPER status. A powerful card does not need high HP; a commander's power belongs in its Abilities and attacks. Removing the rarity gem and the SUPER treatment from a card must not make its statistics look wrong.

Rough sanity bands, not formulas:

| Character | HP |
|---|---:|
| Fragile or ordinary human | 40-70 |
| Tough or trained human | 60-90 |
| Heavily armored or enhanced human | 80-120 |
| Clearly superhuman, or a large combat creature | 100-160 |
| Extremely durable monster or machine | 140-200 |

Values above roughly 200 HP require an exceptional fictional reason. 180 HP should be extremely rare.

HP and DEF compound each other, so they are not both maximized casually. Prefer distinct defensive profiles: high HP with lower DEF, lower HP with high DEF, or moderate in both. High HP together with high DEF is boss territory and needs the fiction to support both.

### Round Numbers

Every printed Damage value, and every Damage, HP or DEF amount written in card text, is a multiple of 10. Nothing in the game uses 5s.

Die faces, die thresholds, card counts and Energy counts are exempt.

### Actions That Should Not Deal Attack Damage

An attack deals Attack Damage only when the action depicted could physically harm a Unit.

Negotiating, issuing orders, broadcasting, ruling, filing, searching and repairing do not deal Attack Damage. Those belong on **N** or **BG** attacks. Commanders, politicians, technicians and other non-combatants may legitimately have no damaging attack at all.

Sonic, energy and physical actions may deal Attack Damage normally.

### Attack Damage

There is no fixed Damage-per-Energy lookup table.

Attack Damage is balanced in the context of the entire card, including Energy Cost, attack cost, HP, DEF, flexibility, targeting, row access, effects, Conditions, archetype support, and relevant breakpoints.

Energy efficiency should still be compared across similar cards, but Damage is not generated from a universal formula.

### Rarity

Rarity is primarily used to manage complexity, build-around density, spectacle, uniqueness, and collectability rather than as a strict power ladder.

Competitive Common and Uncommon cards are allowed and expected.

### SUPER Power Band

SUPER Units are deliberately above the normal Unit power curve and are comparable in role and power to Pokémon ex, GX, V, and VMAX-style cards.

Their elevated power is balanced through the universal SUPER rules and restrictions rather than by forcing them onto the normal Unit curve.

### Hero Subtitle

The **Hero** Subtitle is intended to remain rare.

---

## 26. Undecided Rules

The following systems are still unresolved and must not be inferred:

- Named-Unit uniqueness
- Full turn sequence
- Draw timing after the first-turn restriction
- Exact decking-out trigger
- Reaction windows and priority
- Forced promotion when no Ready Backguard Unit exists
- Whether a Unit may have multiple Subtitles
- Whether a card may have multiple functional Types
- Exact Utility placement or zone
- Equipment handling when a Unit leaves play without being Vanquished
- Default Defense interaction for Effect Damage
- Whether Critical results use natural or modified die values
- Whether another SUPER may be played after the first is Vanquished
