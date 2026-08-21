# Hyperverse card market pricing

Research and model date: 2026-08-21. Market prices are volatile; the external examples below are calibration points, not permanent price claims.

## Market findings

Second-hand card markets price the exact card, printing, treatment, language, condition, and grade—not rarity in isolation. TCGplayer describes Market Price as an average of recent completed sales for a specific product and condition, with outliers removed. eBay likewise uses completed transactions, accepted Best Offers, exact grades when available, and warns that condition, timing, and demand still move the result. Hyperverse therefore gives every catalog ID its own raw price rather than deriving the final value solely from its rarity.

The grade curve is nonlinear. Representative current sold-price aggregates show the sharpest premium at the top:

| Card | Market role | Raw | Grade 8 | Grade 9 | Grade 9.5 | PSA 10 | PSA 10 / raw |
|---|---:|---:|---:|---:|---:|---:|---:|
| Pokémon Base Set Energy Removal | Common | $1.47 | $18.25 | $33.81 | $37.00 | $64.93 | 44.2× |
| Pokémon Base Set Pikachu | Common, high demand | $5.00 | $41.00 | $75.99 | $91.19 | $532.51 | 106.5× |
| MTG Alpha Lightning Bolt | Common, iconic/vintage | $325.00 | $425.69 | $1,122.50 | $1,814.99 | $4,253.33 | 13.1× |
| Yu-Gi-Oh! LOB 1st Edition Blue-Eyes | Ultra Rare, iconic | $1,849.79 | $3,950.59 | $8,299.25 | $15,700.00 | $45,000.00 | 24.3× |
| Yu-Gi-Oh! GFTP Dark Magician | Ghost Rare | $559.99 | $647.27 | $779.53 | $1,199.93 | $2,425.00 | 4.3× |
| Pokémon Gold Star Treecko | Gold Star | $2,504.43 | $5,885.24 | $9,950.00 | $10,945.00 | $32,790.00 | 13.1× |
| Pokémon Gold Star Mew | Gold Star, high demand | $1,941.23 | $6,274.75 | $11,249.65 | $12,375.00 | $86,620.00 | 44.6× |

The spread between cards of nominally similar rarity is as important as the grade. The two Gold Stars above have similar raw prices but very different PSA 10 outcomes. PSA also cautions that low-population cards can command additional premiums and that a Gem Mint 10 may sell for several times a Mint 9. Population scarcity, gem rate, character appeal, play demand, set age, and sale liquidity all matter.

Sources:

- [TCGplayer Market Price methodology](https://help.tcgplayer.com/hc/en-us/articles/213588017-TCGplayer-Market-Price)
- [eBay Price Guide methodology](https://pages.ebay.com/price-guide/)
- [PSA card-value guidance](https://www.psacard.com/cardvalue)
- [PSA note on population and grade premiums](https://www.psacard.com/articles/articleview/3546/a-note-about-sportscard-pricing)
- [Energy Removal market history](https://www.pricecharting.com/game/pokemon-base-set/energy-removal-92)
- [Pikachu market history](https://www.pricecharting.com/game/pokemon-base-set/pikachu-58)
- [Alpha Lightning Bolt market history](https://www.pricecharting.com/game/magic-alpha/lightning-bolt)
- [LOB 1st Edition Blue-Eyes market history](https://www.pricecharting.com/game/yugioh-legend-of-blue-eyes-white-dragon/blue-eyes-white-dragon-1st-edition-lob-001)
- [Ghost Rare Dark Magician market history](https://www.pricecharting.com/game/yugioh-ghosts-from-the-past/dark-magician-gftp-en128)
- [Gold Star Treecko market history](https://www.pricecharting.com/game/pokemon-team-rocket-returns/treecko-gold-star-109)
- [Gold Star Mew market history](https://www.pricecharting.com/game/pokemon-dragon-frontiers/mew-gold-star-101)

## Hyperverse model

Each price is calculated as:

`fixed card base price × optional stamped multiplier × SGS grade/label multiplier`

The individual base values live in `src/campaign/cardPricing.ts`. Rarity defines sensible supply bands, but every card ID receives one explicit value within its band. SUPER and Alternative status are properties of the card itself, so their premiums are baked into that fixed base value.

Within a band, position is set by significance to the Hyperverse setting rather than by rarity alone — see below. Bands deliberately overlap at the edges: a recognisable character can be worth more than a generic card one rarity above it, exactly as a chase uncommon outsells a bulk rare in a real market.

| Band | Range |
|---|---|
| Common | 1–8 CC |
| Uncommon | 5–28 CC |
| Rare | 12–55 CC |
| Ultra Rare (standard) | 110–280 CC |
| Ultra Rare (SUPER) | 300–450 CC |
| Alternative | 10,000–28,000 CC |

Ungraded condition scores are intentionally ignored. Two owned copies with the same card ID and the same stamp status always have the same raw value, regardless of acquisition time or hidden centering, corner, edge, and surface scores. Those scores begin affecting price only after SGS grading.

### SUPER cards

Pokémon describes modern Pokémon ex as belonging to the Double Rare tier; Tera Pokémon ex also receive a distinct foil and textured treatment. Current completed-sale aggregates for cards such as Scarlet & Violet Arcanine ex and Gardevoir ex show that the specific Pokémon still matters, so “ex” is a premium category rather than a universal real-world price.

Hyperverse follows that structure: all ten SUPER cards have individually assigned base prices of 300–450 CC. The entire SUPER band sits above the standard Ultra Rare band of 110–280 CC. This premium is part of the card's fixed base price and is never recalculated per owned copy.

Sources:

- [Pokémon on the Double Rare category and Pokémon ex treatment](https://www.pokemon.com/uk/pokemon-news/pokemon-tcg-scarlet-and-violet-revamps-pokemon-tcg-card-aesthetic)
- [Arcanine ex completed-sale history](https://www.pricecharting.com/game/pokemon-scarlet-%26-violet/arcanine-ex-32)
- [Gardevoir ex completed-sale history](https://www.pricecharting.com/game/pokemon-scarlet-%26-violet/gardevoir-ex-86)

### Collector significance

Position inside a band is set by how much a card matters to the setting, drawn from `docs/Hyperverse_Backstory.txt`. Collectors pay for the cards that carry the story.

**The antagonist.** Dr. Breen founded the Combine Empire out of the Second Celestial Empire's abandoned facilities and is the architect of the present-day war. He was the cheapest Ultra Rare in the game at 95 CC; he is now 275 CC, near the top of the standard band.

**The Four Emperors.** The surviving Elders who transformed the First Celestial Government into the Second Celestial Empire, and the set's title characters. Saruman 265, Uatu 260, Rassilon 255, Metron 250 — clustered, because they ruled as a body.

**The superweapons.** Project Catasthor severed entire universes from the Hyperverse permanently and is the most consequential object in the setting: 280 CC, the highest standard Ultra Rare. Project Voidstar, the unfinished False Vacuum Decay Cannon, follows at 225–230.

**The X-Tremists.** The named protagonist team — Obama, Cyclops, Murdoc Niccals, Squidward, Bob Ross and Eminem — were scattered across the price list, three of them priced as filler. Each now leads its rarity band: Cyclops SUPER 400, Obama 215, X-Tremists Unite! 210, Squidward 55, Cyclops Tactician 40, Bob Ross and Eminem 28, Murdoc 26.

**Pivotal events.** The Tomb of the Fallen Elder 48 (the betrayal that created the Empire), Project Parabellum 44 (the programme that triggered the largest war in Hyperverse history), Combine Advisor 38 (the infiltration that hollowed out the TCDR), Decapitation Strike 18 (the summit that killed the rebel leadership and all Four Emperors), Setting the Bounty 16 (Operation Null Coercion, the origin of the Celestial Credit bounty economy).

**Contraband.** Hyperversal Gate 185. Machines opening unrestricted dimensional passages were outlawed, confiscated and destroyed by the First Celestial Government, which makes a surviving one a collector's item rather than equipment.

Cards with no footprint in the backstory were trimmed slightly so that lore-bearing cards lead their bands.

### Grade and label multipliers

SGS 7.0 is the commercial floor: it is the first grade worth more than the same raw card. Grades below 7.0 are collector outcomes and depreciate the card. Their multipliers are shared across rarities: 1.0 = 0.2×, 1.5 = 0.25×, 2.0 = 0.3×, 2.5 = 0.35×, 3.0 = 0.4×, 3.5 = 0.45×, 4.0 = 0.5×, 4.5 = 0.55×, 5.0 = 0.6×, 5.5 = 0.7×, 6.0 = 0.8×, and 6.5 = 0.9×.

| Grade / label | Common | Uncommon | Rare | Ultra Rare | Alternative |
|---|---:|---:|---:|---:|---:|
| Bronze 7.0 | 1.5× | 1.4× | 1.25× | 1.05× | 1.01× |
| Bronze 7.5 | 2× | 1.8× | 1.35× | 1.1× | 1.03× |
| Bronze 8.0 | 3× | 2.5× | 1.5× | 1.2× | 1.05× |
| Bronze 8.5 | 5× | 4× | 2× | 1.5× | 1.075× |
| Silver 9.0 | 8× | 6× | 3× | 2× | 1.1× |
| Gold 9.5 | 10× | 8× | 5× | 3× | 1.5× |
| White Gold 10 — other Pristine 10 | 20× | 18× | 12× | 8× | 4× |
| Platinum 10 — three 10s and one 9.5 | 45× | 40× | 30× | 45× | 50× |
| Diamond 10 — four 10s | 100× | 90× | 75× | 120× | 250× |

Lower-priced cards receive larger relative multiples because authentication and a scarce gem-mint population create a price floor. Ultra Rares start with a much larger raw anchor, while Alternatives regain an extreme Platinum/Diamond tail to behave like Ghost Rares and Pokémon Gold Stars. The grading fee is not included in the displayed market value: it remains the player's sunk-risk gate, so a 7.0 result is above raw value without guaranteeing that grading was profitable after the fee.

### Grading fee

The fee scales with the card: `max(80 CC, 25% of the card's raw value)`, quoted from the raw value the player can already see, including any stamp premium.

A flat fee cannot serve a catalog spanning 1 to 28,000 CC. At a flat 300 CC the fee was 10,000% of a Common, 135% of an average Ultra Rare, and 1.8% of an Alternative, so grading is only ever a live decision in one band — and in that band the fee exceeds the prize, which is why a 9.5 Ultra Rare felt like a loss even when it was marginally positive.

Because a pack-fresh card can only return 9.0, 9.5, or 10 (the condition roll floors centering at 8 and every other subgrade at 9), grade 9.5 at ~73% of outcomes decides whether a band is worth grading. Under the scaled fee:

| Band | Variants worth grading at 9.5 |
|---|---|
| Common | 0 of 96 |
| Uncommon | 39 of 96 |
| Rare | 33 of 50 |
| Ultra Rare | 50 of 54 |
| Alternative | 10 of 10 |

The 80 CC floor is what keeps Commons out of the market; a percentage alone would make cheap cards gradeable. Pristine 10 outcomes on bulk cards stay profitable by design — that tail is the lottery, not the expected result.

### Stamped treatments

Pokémon Center promos provide a close like-for-like comparison because the stamped and plain cards otherwise share the same card number and artwork. The current ungraded Charmander #44 aggregates place the Pokémon Center-stamped version at several times the plain promo. A broader 26-pair market analysis likewise found that the premium varies heavily by card, confirming that the stamp should modify an individual base price rather than replace it.

Hyperverse uses a conservative rarity-scaled stamp premium: 2× Common, 2.25× Uncommon, 2.5× Rare, 3× Ultra Rare, or 4× Alternative. Stamped is an explicit variant, so a stamped and an unstamped copy are not price-identical; two stamped copies of the same card are.

Sources:

- [Plain Charmander #44 market history](https://www.pricecharting.com/game/pokemon-promo/charmander-44)
- [Pokémon Center-stamped Charmander #44 market history](https://www.pricecharting.com/game/pokemon-promo/charmander-pokemon-center-44)
- [Analysis of 26 stamped/plain Pokémon promo pairs](https://www.moonstonehq.com/articles/pokemon-center-stamp-premium)

### Alternative price band

Raw Alternatives range from 10,000–28,000 CC, matching the broad calibrated territory between headline Ghost Rares and Gold Stars. Their Pristine multiplier ranges from 4× for White Gold to 250× for Diamond. A Diamond Alternative, especially when stamped, is a collection-defining result.

## Player-facing behavior

- Every catalog card, including the six Energy cards, has one explicit base value.
- Two ungraded copies with the same card ID and stamp status always show the same raw value.
- SUPER and Alternative premiums are baked into the card's base value; Stamped is a visible per-copy premium.
- Booster reveals show the card's raw value, including its stamped-treatment premium.
- Every owned copy shows its current CC value.
- Collection value totals duplicate copies independently and updates immediately after grading.
- The collection can be sorted by market value.
- The grading reveal shows the new market value alongside what the copy was worth raw, the fee paid, and the net gain, so the result reads without mental arithmetic.
- Grading deducts its scaled fee from the player's Celestial Credits, and the collection shows the exact quote on each card's grading button before the player commits.
- Price does not affect battle rules. Selling is not implemented yet; when it ships a card sells for exactly its displayed market value.

## Sale value

A card sells for exactly its displayed market value. There is no dealer spread and no liquidity discount.

An earlier model applied both. It was removed deliberately: it meant the number shown on a card was never the number a player received, so every sale required mental arithmetic against two invisible rates. One honest number beats a more realistic model the player has to decode.

The consequence is that the pack economy is balanced entirely through base values, grade multipliers, the grading fee, and the pack price — not through the sale side.

## Pack economy

A standard booster costs 100 CC and contains 4 Commons, 2 Uncommons, and one premium card.

Simulated over 150,000 packs against the shipped pricing code, with optimal grade-or-keep play and sale at full market value:

| | Value |
|---|---:|
| Median pack | 185 CC |
| 25th percentile | 70 CC |
| 75th percentile | 296 CC |
| 95th percentile | 1,411 CC |
| Mean | 542 CC |
| Packs returning less than the pack price | 27% |

### Pack price is deliberately below expected value

The mean is 542 CC against a 100 CC pack. This is deliberate and is not treated as an exploit.

Credits are earned by winning matches and tournaments, not by opening boosters, so a player cannot spam packs to compound credits — pack purchasing is gated behind actually playing the game. A player who opens boosters purely to liquidate them is skipping the game rather than breaking it, and in a single-player campaign there is no competitive integrity to protect. The pack price is therefore set by what a player earning credits through play can afford, not by the expected sale value of the contents.

### Why the Ultra Rare curve stops at 3x

The sourced grade 9 premiums of 4-6x come from vintage cards, where raw supply is scarce alongside graded supply. Hyperverse cards are pack-fresh, and Ultra Rares appear in 15.83% of packs. At a 222 CC average base, a 4.5x grade 9 makes the average graded Ultra Rare worth roughly 1,400 CC, several times the pack price on its own.

### Alternatives are deliberately untouched

At a 0.17% pull rate an Alternative appears roughly once every 588 packs. Its base values and grade curve are unchanged, as are the Platinum and Diamond multipliers: they account for a small share of the mean and carry the payoff the chase exists for.

## Maintenance rule

When adding a card, add its base CC value in the same change. The pricing test fails if the catalog and price list are not one-to-one. Rebalance individual base anchors when gameplay demand changes; rebalance rarity/grade tables only when the entire market curve should change — and re-run the pack simulation afterwards, because the pack price is calibrated against the mean it produces.
