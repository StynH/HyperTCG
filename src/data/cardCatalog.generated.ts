// Generated from HyperTCGMaker. Run npm run sync:cards to refresh.
export const GENERATED_CARDS = [
  {
    "kind": "unit",
    "name": "Admiral Asgore Dreemurr",
    "subtitle": "Berserker",
    "type": "Combine",
    "flavor": "The trident is already hot.",
    "hp": 180,
    "defense": 55,
    "cost": [
      "boson",
      "boson",
      "boson",
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "admiral-asgore-dreemurr-unstoppable-advance-0",
        "name": "Unstoppable Advance",
        "text": "This card is unaffected by **Paralyzed** and **Cowering**."
      },
      {
        "id": "admiral-asgore-dreemurr-weight-of-the-trident-1",
        "name": "Weight of the Trident",
        "text": "Whenever this card is targeted by an attack, the attacking Unit takes 10 Damage."
      }
    ],
    "attacks": [
      {
        "id": "asgore-molten-trident",
        "name": "Molten Trident",
        "cost": [
          "boson",
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "asgore-molten-trident-d6-0",
            "die": 6
          }
        ],
        "damage": "60",
        "effect": "- **[DR]** even: the Defending Unit cannot Rotate until the end of your Opponent's next turn.\n- **[DR]** odd: the Defending Unit is afflicted with **Infect for 10**."
      },
      {
        "id": "asgore-spiral-of-flame",
        "name": "Spiral of Flame",
        "cost": [
          "boson",
          "boson",
          "boson",
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "100",
        "effect": "Each other Unit your Opponent controls in their Vanguard takes 20 Damage."
      }
    ],
    "primary": "boson",
    "unitTreatment": "super",
    "setId": "ORIG",
    "number": 1,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "001-admiral-asgore-dreemurr",
    "image": "/cards/001-admiral-asgore-dreemurr.png"
  },
  {
    "kind": "unit",
    "name": "Apocalypse",
    "subtitle": "Bruiser",
    "type": "Combine",
    "flavor": "Empires end. He does not.",
    "hp": 160,
    "defense": 60,
    "cost": [
      "boson",
      "boson",
      "boson",
      "neutrino"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "apocalypse-ancient-dominion-0",
        "name": "Ancient Dominion",
        "text": "Units your Opponent controls in their Vanguard get **-10 DEF**."
      },
      {
        "id": "apocalypse-survival-of-the-fittest-1",
        "name": "Survival of the Fittest",
        "text": "Whenever another **Combine** type Unit you control is Vanquished, this card recovers 10 HP."
      }
    ],
    "attacks": [
      {
        "id": "apocalypse-horsemen-ascend",
        "name": "Horsemen Ascend",
        "cost": [
          "boson",
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Search your deck for 1 **Combine** type Unit with an Energy Cost of 2 or less and play it to your Backguard."
      },
      {
        "id": "apocalypse-plasma-cannon",
        "name": "Plasma Cannon",
        "cost": [
          "boson",
          "boson",
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "70+",
        "effect": "This attack deals 10 more Damage for each surplus Energy tapped to pay for it."
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 2,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "002-apocalypse",
    "image": "/cards/002-apocalypse.png"
  },
  {
    "kind": "unit",
    "name": "Barack Obama",
    "subtitle": "Tactician",
    "type": "X-Tremists",
    "flavor": "Let me be clear.",
    "hp": 55,
    "defense": 25,
    "cost": [
      "photon",
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "barack-obama-de-facto-strategist-0",
        "name": "De Facto Strategist",
        "text": "**X-Tremists** type Units you control get **+20 DEF** while you control 3 or more other **X-Tremists** type Units."
      }
    ],
    "attacks": [
      {
        "id": "obama-let-me-be-clear",
        "name": "Let Me Be Clear",
        "cost": [
          "photon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Draw 2 cards. Then put 1 card from your hand on the bottom of your deck."
      },
      {
        "id": "obama-negotiated-terms",
        "name": "Negotiated Terms",
        "cost": [
          "photon",
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit is afflicted with **Cowering** and cannot Rotate until the end of your Opponent's next turn."
      }
    ],
    "primary": "photon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 3,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "003-barack-obama",
    "image": "/cards/003-barack-obama.png"
  },
  {
    "kind": "unit",
    "name": "Cyclops",
    "subtitle": "Leader",
    "type": "X-Tremists",
    "flavor": "Form up. Six against everything.",
    "hp": 85,
    "defense": 55,
    "cost": [
      "photon",
      "photon",
      "gluon",
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "cyclops-lead-the-x-tremists-0",
        "name": "Lead the X-Tremists",
        "text": "Attacks used by other **X-Tremists** type Units you control deal 10 more Damage."
      }
    ],
    "attacks": [
      {
        "id": "cyclops-super-pinpoint-beam",
        "name": "Pinpoint Beam",
        "cost": [
          "photon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "30",
        "effect": "This attack's Damage is not reduced by a Defense Check."
      },
      {
        "id": "cyclops-super-wide-aperture",
        "name": "Wide Aperture",
        "cost": [
          "photon",
          "photon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "60",
        "effect": ""
      },
      {
        "id": "cyclops-super-visor-release",
        "name": "Visor Release",
        "cost": [
          "photon",
          "photon",
          "gluon",
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "90",
        "effect": "During your next turn, this card cannot attack."
      }
    ],
    "primary": "photon",
    "unitTreatment": "super",
    "setId": "ORIG",
    "number": 4,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "004-cyclops-super",
    "image": "/cards/004-cyclops-super.png"
  },
  {
    "kind": "unit",
    "name": "Donald Trump",
    "subtitle": "Leader",
    "type": "",
    "flavor": "Nobody builds a wall like this.",
    "hp": 55,
    "defense": 20,
    "cost": [
      "gluon",
      "gluon",
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "donald-trump-deal-maker-0",
        "name": "Deal Maker",
        "text": "Once during your turn, you may put 1 card from your hand on the bottom of your deck. If you do, draw 2 cards."
      }
    ],
    "attacks": [
      {
        "id": "trump-build-the-wall",
        "name": "Build the Wall",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Until the end of your Opponent's next turn, Units your Opponent controls cannot Rotate."
      },
      {
        "id": "trump-executive-order",
        "name": "Executive Order",
        "cost": [
          "gluon",
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 **Continuous Effect** or **Equipment** Utility card your Opponent controls. Vanquish it."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 5,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "005-donald-trump",
    "image": "/cards/005-donald-trump.png"
  },
  {
    "kind": "unit",
    "name": "Dr. Breen",
    "subtitle": "Leader",
    "type": "Combine",
    "flavor": "He won with paperwork first.",
    "hp": 55,
    "defense": 20,
    "cost": [
      "gluon",
      "gluon",
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "dr-breen-harmonious-development-0",
        "name": "Harmonious Development",
        "text": "**Combine** type Units you control get **+10 DEF**."
      },
      {
        "id": "dr-breen-overwatch-command-1",
        "name": "Overwatch Command",
        "text": "Attacks used by **Combine** type Units you control that target a Unit with a **Condition** deal 10 more Damage."
      }
    ],
    "attacks": [
      {
        "id": "breen-instrument-of-our-doctrine",
        "name": "Instrument of Our Doctrine",
        "cost": [
          "gluon",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Search your deck for 1 **Combine** type Infantry Unit and put it into your hand."
      },
      {
        "id": "breen-address-to-the-citizenry",
        "name": "Address to the Citizenry",
        "cost": [
          "gluon",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Until the end of your Opponent's next turn, **Combine** type Units you control take 10 less Attack Damage and cannot be afflicted with **Conditions**."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 6,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "006-dr-breen",
    "image": "/cards/006-dr-breen.png"
  },
  {
    "kind": "unit",
    "name": "Garen Crownguard",
    "subtitle": "Leader",
    "type": "TCR",
    "flavor": "Demacia does not kneel.",
    "hp": 140,
    "defense": 65,
    "cost": [
      "gluon",
      "gluon",
      "gluon",
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "garen-crownguard-courage-of-the-republic-0",
        "name": "Courage of the Republic",
        "text": "Other **TCR** type Units you control in your Vanguard take 10 less Attack Damage."
      },
      {
        "id": "garen-crownguard-perseverance-1",
        "name": "Perseverance",
        "text": "Once during your turn, this card recovers 20 HP."
      }
    ],
    "attacks": [
      {
        "id": "garen-decisive-strike",
        "name": "Decisive Strike",
        "cost": [
          "gluon",
          "boson"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "50",
        "effect": "If the Defending Unit is Vanquished by this attack, this card does not become Exhausted."
      },
      {
        "id": "garen-demacian-justice",
        "name": "Demacian Justice",
        "cost": [
          "gluon",
          "gluon",
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "80",
        "effect": "This attack's Damage is not reduced by a Defense Check."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "super",
    "setId": "ORIG",
    "number": 7,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "007-garen-crownguard",
    "image": "/cards/007-garen-crownguard.png"
  },
  {
    "kind": "unit",
    "name": "Jean-Luc Picard",
    "subtitle": "Leader",
    "type": "TCR",
    "flavor": "Make it so.",
    "hp": 60,
    "defense": 25,
    "cost": [
      "gluon",
      "gluon",
      "gluon",
      "photon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "jean-luc-picard-supreme-leader-0",
        "name": "Supreme Leader",
        "text": "**TCR** type Units you control get **+10 DEF** and cannot be afflicted with **Cowering**."
      }
    ],
    "attacks": [
      {
        "id": "picard-make-it-so",
        "name": "Make It So",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Draw 2 cards."
      },
      {
        "id": "picard-red-alert",
        "name": "Red Alert",
        "cost": [
          "gluon",
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Each **TCR** type Unit you control recovers 30 HP."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 8,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "008-jean-luc-picard",
    "image": "/cards/008-jean-luc-picard.png"
  },
  {
    "kind": "unit",
    "name": "Raiden",
    "subtitle": "Assassin",
    "type": "",
    "flavor": "He decides. The sword obeys.",
    "hp": 120,
    "defense": 70,
    "cost": [
      "electron",
      "electron",
      "muon",
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "raiden-zandatsu-0",
        "name": "Zandatsu",
        "text": "Whenever a Unit is Vanquished by an attack used by this card, this card recovers 30 HP."
      }
    ],
    "attacks": [
      {
        "id": "raiden-high-frequency-blade",
        "name": "High Frequency Blade",
        "cost": [
          "electron",
          "muon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "50",
        "effect": ""
      },
      {
        "id": "raiden-ripper-mode",
        "name": "Ripper Mode",
        "cost": [
          "electron",
          "electron",
          "muon",
          "boson"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "raiden-ripper-mode-d10-0",
            "die": 10
          }
        ],
        "damage": "80",
        "effect": "If **[DR]** is 6 or higher, this card does not become Exhausted."
      }
    ],
    "primary": "electron",
    "unitTreatment": "super",
    "setId": "ORIG",
    "number": 9,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "009-raiden",
    "image": "/cards/009-raiden.png"
  },
  {
    "kind": "unit",
    "name": "Soldier",
    "subtitle": "Berserker",
    "type": "",
    "flavor": "MAGGOTS! OFF MY BATTLEFIELD!",
    "hp": 100,
    "defense": 45,
    "cost": [
      "boson",
      "boson",
      "boson",
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "soldier-maggots-0",
        "name": "Maggots!",
        "text": "Attacks used by Infantry Units you control deal 10 more Damage."
      }
    ],
    "attacks": [
      {
        "id": "soldier-tf2-super-buff-banner",
        "name": "Buff Banner",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Until the end of this turn, attacks used by Infantry Units you control deal 20 more Damage."
      },
      {
        "id": "soldier-tf2-super-rocket-jump-assault",
        "name": "Rocket Jump Assault",
        "cost": [
          "boson",
          "muon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "50",
        "effect": "Rotate this card. It does not become Exhausted."
      },
      {
        "id": "soldier-tf2-super-kamikaze",
        "name": "Kamikaze",
        "cost": [
          "boson",
          "boson",
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "90",
        "effect": "This card takes 30 Damage."
      }
    ],
    "primary": "boson",
    "unitTreatment": "super",
    "setId": "ORIG",
    "number": 10,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "010-soldier-tf2-super",
    "image": "/cards/010-soldier-tf2-super.png"
  },
  {
    "kind": "unit",
    "name": "Terra",
    "subtitle": "Hero",
    "type": "TCR",
    "flavor": "Darkness is carried, not cast out.",
    "hp": 110,
    "defense": 50,
    "cost": [
      "photon",
      "boson",
      "neutrino",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "terra-darkness-within-0",
        "name": "Darkness Within",
        "text": "While this card is afflicted with a **Condition**, attacks used by this card deal 20 more Damage."
      }
    ],
    "attacks": [
      {
        "id": "terra-earthshaker",
        "name": "Earthshaker",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "30",
        "effect": ""
      },
      {
        "id": "terra-rock-breaker",
        "name": "Rock Breaker",
        "cost": [
          "boson",
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "40",
        "effect": "This attack also deals 20 Damage to up to 2 other Units your Opponent controls in their Vanguard."
      },
      {
        "id": "terra-fatal-mode",
        "name": "Fatal Mode",
        "cost": [
          "photon",
          "boson",
          "neutrino"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "80",
        "effect": "This card is afflicted with **Cursed**."
      }
    ],
    "primary": "photon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 11,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "011-terra",
    "image": "/cards/011-terra.png"
  },
  {
    "kind": "unit",
    "name": "Xehanort",
    "subtitle": "Mystic",
    "type": "Combine",
    "flavor": "Every world has a door.",
    "hp": 70,
    "defense": 70,
    "cost": [
      "neutrino",
      "neutrino",
      "neutrino",
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "xehanort-the-gazing-eye-0",
        "name": "The Gazing Eye",
        "text": "Your Opponent plays with their hand revealed."
      },
      {
        "id": "xehanort-seeker-of-darkness-1",
        "name": "Seeker of Darkness",
        "text": "Whenever a Unit your Opponent controls is Vanquished, this card recovers 20 HP."
      }
    ],
    "attacks": [
      {
        "id": "xehanort-no-name",
        "name": "No Name",
        "cost": [
          "neutrino",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "40",
        "effect": ""
      },
      {
        "id": "xehanort-time-stop",
        "name": "Time Stop",
        "cost": [
          "neutrino",
          "neutrino",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit is afflicted with **Paralyzed**."
      },
      {
        "id": "xehanort-rain-of-keyblades",
        "name": "Rain of Keyblades",
        "cost": [
          "neutrino",
          "neutrino",
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "70",
        "effect": "The Defending Unit is afflicted with **Weakened**."
      }
    ],
    "primary": "neutrino",
    "unitTreatment": "super",
    "setId": "ORIG",
    "number": 12,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "012-xehanort",
    "image": "/cards/012-xehanort.png"
  },
  {
    "kind": "utility",
    "name": "Citadel",
    "subtitle": "",
    "type": "Combine",
    "flavor": "It does not land. It arrives.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "gluon",
      "gluon",
      "electron",
      "neutrino"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 13,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "continuous",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "**Combine** type Units you control get **+20 DEF**.\nOnce during your turn, you may search your deck for 1 **Combine** type Unit with an Energy Cost of 3 or less and play it to your Backguard.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "013-citadel",
    "image": "/cards/013-citadel.png"
  },
  {
    "kind": "utility",
    "name": "Hyperversal Gate",
    "subtitle": "",
    "type": "",
    "flavor": "Outlawed. Built anyway.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "gluon",
      "photon",
      "electron",
      "muon",
      "boson",
      "neutrino"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 14,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Search your deck for up to 2 Units and play them to open Unit positions you control.\nThen Vanquish 2 Energy you control.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "014-hyperversal-gate",
    "image": "/cards/014-hyperversal-gate.png"
  },
  {
    "kind": "utility",
    "name": "X-Tremists Unite!",
    "subtitle": "",
    "type": "X-Tremists",
    "flavor": "A shack full of idiots. Ours.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "photon",
      "muon",
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 15,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "You can play this card only if you control 3 or more **X-Tremists** type Units.",
    "utilityEffect": "Ready each **X-Tremists** type Unit you control.\nUntil the end of this turn, attacks used by **X-Tremists** type Units you control deal 20 more Damage.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "015-x-tremists-unite",
    "image": "/cards/015-x-tremists-unite.png"
  },
  {
    "kind": "utility",
    "name": "Zero Hour",
    "subtitle": "",
    "type": "TCR",
    "flavor": "Five minutes. It was enough.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "gluon",
      "gluon",
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 16,
    "total": 102,
    "rarity": "ultra",
    "utilityType": "free",
    "utilityContent": "effect",
    "utilityCondition": "Play this card when a Unit you control would be Vanquished.",
    "utilityEffect": "That Unit remains in play with 30 HP instead.\nThen Ready each **TCR** type Unit you control.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "016-zero-hour",
    "image": "/cards/016-zero-hour.png"
  },
  {
    "kind": "unit",
    "name": "Cyclops",
    "subtitle": "Tactician",
    "type": "X-Tremists",
    "flavor": "Cover the left. Murdoc, drive.",
    "hp": 80,
    "defense": 50,
    "cost": [
      "gluon",
      "photon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "cyclops-field-discipline-0",
        "name": "Field Discipline",
        "text": "Once during your turn, you may Rotate 1 **X-Tremists** type Unit you control. It does not become Exhausted."
      }
    ],
    "attacks": [
      {
        "id": "cyclops-optic-blast",
        "name": "Optic Blast",
        "cost": [
          "gluon",
          "photon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "30",
        "effect": "Rotate the Defending Unit."
      },
      {
        "id": "cyclops-tactical-reposition",
        "name": "Tactical Reposition",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Rotate up to 2 Units you control. They do not become Exhausted. Then draw 1 card."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 17,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "017-cyclops-tactician",
    "image": "/cards/017-cyclops-tactician.png"
  },
  {
    "kind": "unit",
    "name": "Ebony Maw",
    "subtitle": "Mystic",
    "type": "Combine",
    "flavor": "Dr. Breen awaits the broadcast.",
    "hp": 50,
    "defense": 55,
    "cost": [
      "neutrino",
      "neutrino",
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "ebony-maw-silken-counsel-0",
        "name": "Silken Counsel",
        "text": "While this card is in your Backguard, **Combine** type Units you control in your Vanguard get **+10 DEF**."
      }
    ],
    "attacks": [
      {
        "id": "ebony-maw-whispered-persuasion",
        "name": "Whispered Persuasion",
        "cost": [
          "neutrino",
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Target 1 Unit your Opponent controls. Rotate it. It becomes Exhausted."
      },
      {
        "id": "ebony-maw-your-suffering-will-be-legendary",
        "name": "Your Suffering Will Be Legendary",
        "cost": [
          "neutrino",
          "neutrino",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "30",
        "effect": "The Defending Unit is afflicted with **Cursed**."
      }
    ],
    "primary": "neutrino",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 18,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "018-ebony-maw",
    "image": "/cards/018-ebony-maw.png"
  },
  {
    "kind": "unit",
    "name": "Lola Bunny",
    "subtitle": "Tactician",
    "type": "TCR",
    "flavor": "She named them. They cope.",
    "hp": 65,
    "defense": 45,
    "cost": [
      "electron",
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "lola-bunny-unit-registration-0",
        "name": "Unit Registration",
        "text": "Once during your turn, you may search your deck for 1 **X-Tremists** type Unit or **X-Perience** type Unit and put it into your hand."
      }
    ],
    "attacks": [
      {
        "id": "lola-fast-break",
        "name": "Fast Break",
        "cost": [
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Draw 1 card. Then Rotate 1 Unit you control. It does not become Exhausted."
      },
      {
        "id": "lola-assist",
        "name": "Assist",
        "cost": [
          "electron",
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "lola-assist-d6-0",
            "die": 6
          }
        ],
        "damage": "N",
        "effect": "If **[DR]** is 4 or higher, draw 2 cards."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 19,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "019-lola-bunny",
    "image": "/cards/019-lola-bunny.png"
  },
  {
    "kind": "unit",
    "name": "Mark Rutte",
    "subtitle": "Tactician",
    "type": "TCR",
    "flavor": "He remembers Obama. Sadly.",
    "hp": 50,
    "defense": 20,
    "cost": [
      "gluon",
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "mark-rutte-mission-briefing-0",
        "name": "Mission Briefing",
        "text": "When this card is played, look at the top 4 cards of your deck. Put 1 Utility card from among them into your hand and the rest on the bottom of your deck."
      }
    ],
    "attacks": [
      {
        "id": "rutte-assignment-orders",
        "name": "Assignment Orders",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Search your deck for 1 **Instant Effect** Utility card and put it into your hand. If you control a Leader Unit, draw 1 card."
      },
      {
        "id": "rutte-bureaucratic-delay",
        "name": "Bureaucratic Delay",
        "cost": [
          "gluon",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit becomes Exhausted."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 20,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "020-mark-rutte",
    "image": "/cards/020-mark-rutte.png"
  },
  {
    "kind": "unit",
    "name": "Ordinal",
    "subtitle": "Tactician",
    "type": "Combine",
    "flavor": "No name. No face. A number.",
    "hp": 80,
    "defense": 50,
    "cost": [
      "gluon",
      "gluon",
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "ordinal-ordinal-command-0",
        "name": "Ordinal Command",
        "text": "Attacks used by **Combine** type Infantry Units you control deal 10 more Damage."
      }
    ],
    "attacks": [
      {
        "id": "ordinal-redeploy",
        "name": "Redeploy",
        "cost": [
          "gluon",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Rotate up to 2 **Combine** type Units you control. They do not become Exhausted."
      },
      {
        "id": "ordinal-tactical-overlay",
        "name": "Tactical Overlay",
        "cost": [
          "gluon",
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Until the end of your Opponent's next turn, **Combine** type Units you control get **+20 DEF**."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 21,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "021-ordinal",
    "image": "/cards/021-ordinal.png"
  },
  {
    "kind": "unit",
    "name": "Patlu",
    "subtitle": "Bruiser",
    "type": "X-Perience",
    "flavor": "It is One Punch Patlu now.",
    "hp": 70,
    "defense": 45,
    "cost": [
      "boson",
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "patlu-one-punch-doctrine-0",
        "name": "One Punch Doctrine",
        "text": "While you control another **X-Perience** type Bruiser Unit, attacks used by this card deal 10 more Damage."
      }
    ],
    "attacks": [
      {
        "id": "patlu-jab",
        "name": "Jab",
        "cost": [
          "boson"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      },
      {
        "id": "patlu-one-punch",
        "name": "ONE PUNCH!",
        "cost": [
          "boson",
          "muon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "patlu-one-punch-d20-0",
            "die": 20
          }
        ],
        "damage": "90",
        "effect": "If **[DR]** is 10 or lower, this attack fails."
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 22,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "022-patlu",
    "image": "/cards/022-patlu.png"
  },
  {
    "kind": "unit",
    "name": "Squidward",
    "subtitle": "Rogue",
    "type": "X-Tremists",
    "flavor": "Terrified, miserable, present.",
    "hp": 55,
    "defense": 35,
    "cost": [
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "squidward-perpetually-miserable-0",
        "name": "Perpetually Miserable",
        "text": "This card cannot be afflicted with **Cowering**."
      }
    ],
    "attacks": [
      {
        "id": "squidward-hide-behind-bob",
        "name": "Hide Behind Bob",
        "cost": [
          "muon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Rotate this card. It does not become Exhausted."
      },
      {
        "id": "squidward-panicked-flail",
        "name": "Panicked Flail",
        "cost": [
          "muon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "squidward-panicked-flail-d6-0",
            "die": 6
          }
        ],
        "damage": "10x",
        "effect": "This attack deals 10 Damage times **[DR]**."
      },
      {
        "id": "squidward-clarinet-screech",
        "name": "Clarinet Screech",
        "cost": [
          "muon",
          "muon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit is afflicted with **Cowering**. If you control 3 or more other **X-Tremists** type Units, each Unit your Opponent controls in their Vanguard is afflicted with **Cowering** instead."
      }
    ],
    "primary": "muon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 23,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "023-squidward",
    "image": "/cards/023-squidward.png"
  },
  {
    "kind": "unit",
    "name": "Sylas",
    "subtitle": "Rogue",
    "type": "Combine",
    "flavor": "The chains came off first.",
    "hp": 80,
    "defense": 50,
    "cost": [
      "muon",
      "muon",
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "sylas-chainbreaker-0",
        "name": "Chainbreaker",
        "text": "This card is unaffected by **Paralyzed** and cannot be prevented from Rotating."
      }
    ],
    "attacks": [
      {
        "id": "sylas-kingslayer",
        "name": "Kingslayer",
        "cost": [
          "muon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20+",
        "effect": "If the Defending Unit is a Leader Unit, this attack deals 30 more Damage."
      },
      {
        "id": "sylas-chain-lash",
        "name": "Chain Lash",
        "cost": [
          "muon",
          "muon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "sylas-chain-lash-d10-0",
            "die": 10
          }
        ],
        "damage": "40",
        "effect": "If **[DR]** is 6 or higher, the Defending Unit cannot Rotate until the end of your Opponent's next turn."
      }
    ],
    "primary": "muon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 24,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "024-sylas",
    "image": "/cards/024-sylas.png"
  },
  {
    "kind": "unit",
    "name": "Vengeful Spectre",
    "subtitle": "Spectre",
    "type": "",
    "flavor": "It refused the paperwork.",
    "hp": 65,
    "defense": 60,
    "cost": [
      "neutrino",
      "neutrino",
      "muon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "vengeful-spectre-grave-return-0",
        "name": "Grave Return",
        "text": "When this card is Vanquished, you may put 1 Spectre Unit from your Vanquished Pile into your hand."
      }
    ],
    "attacks": [
      {
        "id": "vengeful-spectre-retribution",
        "name": "Retribution",
        "cost": [
          "neutrino",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20+",
        "effect": "This attack deals 10 more Damage for each Spectre Unit in your Vanquished Pile."
      },
      {
        "id": "vengeful-spectre-mark-of-doom",
        "name": "Mark of Doom",
        "cost": [
          "neutrino",
          "neutrino",
          "neutrino"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "vengeful-spectre-mark-of-doom-d20-0",
            "die": 20
          }
        ],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. If **[DR]** is 18 or higher, the targeted Unit is afflicted with **Doomed**."
      }
    ],
    "primary": "neutrino",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 25,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "025-vengeful-spectre",
    "image": "/cards/025-vengeful-spectre.png"
  },
  {
    "kind": "unit",
    "name": "Yoko Littner",
    "subtitle": "Marksman",
    "type": "",
    "flavor": "She calls it before firing.",
    "hp": 65,
    "defense": 50,
    "cost": [
      "muon",
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "yoko-littner-covering-fire-0",
        "name": "Covering Fire",
        "text": "While this card is in your Backguard, attacks used by Units you control in your Vanguard deal 10 more Damage."
      }
    ],
    "attacks": [
      {
        "id": "yoko-sidearm",
        "name": "Sidearm",
        "cost": [
          "muon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      },
      {
        "id": "yoko-superconducting-rifle",
        "name": "Superconducting Rifle",
        "cost": [
          "muon",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit takes 20 Damage."
      },
      {
        "id": "yoko-overcharged-round",
        "name": "Overcharged Round",
        "cost": [
          "muon",
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "40",
        "effect": "This attack's Damage is not reduced by a Defense Check."
      }
    ],
    "primary": "muon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 26,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "026-yoko-littner",
    "image": "/cards/026-yoko-littner.png"
  },
  {
    "kind": "utility",
    "name": "Copycats",
    "subtitle": "",
    "type": "X-Perience",
    "flavor": "Matching uniforms. A crate.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 27,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Until the end of this turn, **X-Perience** type Units you control are also **X-Tremists** type Units.\nThen Ready each **X-Perience** type Unit you control.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "027-copycats",
    "image": "/cards/027-copycats.png"
  },
  {
    "kind": "utility",
    "name": "Energy Reactor",
    "subtitle": "",
    "type": "Combine",
    "flavor": "Malmuth has one weak point.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "electron",
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 28,
    "total": 102,
    "rarity": "rare",
    "utilityType": "continuous",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "During your turn, you may play 1 additional Energy card.\nWhenever a Unit you control is Vanquished by Attack Damage, Vanquish this card.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "028-energy-reactor",
    "image": "/cards/028-energy-reactor.png"
  },
  {
    "kind": "utility",
    "name": "Planet N8318",
    "subtitle": "",
    "type": "X-Tremists",
    "flavor": "A rusting shack. Technically HQ.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 29,
    "total": 102,
    "rarity": "rare",
    "utilityType": "continuous",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "**X-Tremists** type Units you control get **+20 DEF**.\nOnce during your turn, you may Rotate 1 **X-Tremists** type Unit you control. It does not become Exhausted.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "029-planet-n8318",
    "image": "/cards/029-planet-n8318.png"
  },
  {
    "kind": "utility",
    "name": "Splinter Groups",
    "subtitle": "",
    "type": "TCR",
    "flavor": "The Republic files everyone.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 30,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Search your deck for up to 2 Units with an Energy Cost of 2 or less and put them into your hand.\nIf you control a Leader Unit, search for up to 3 instead.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "030-splinter-groups",
    "image": "/cards/030-splinter-groups.png"
  },
  {
    "kind": "utility",
    "name": "Suppression Protocol",
    "subtitle": "",
    "type": "Combine",
    "flavor": "Compliance is installed.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "gluon",
      "electron",
      "neutrino"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 31,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Target 1 Unit your Opponent controls. The targeted Unit is afflicted with **Paralyzed**.\nIf the targeted Unit is a Citizen Unit or an Infantry Unit, it is also afflicted with **Weakened**.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "031-suppression-protocol",
    "image": "/cards/031-suppression-protocol.png"
  },
  {
    "kind": "utility",
    "name": "Zephyr Strike",
    "subtitle": "",
    "type": "TCR",
    "flavor": "Hit once. Leave no answer.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "electron",
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 32,
    "total": 102,
    "rarity": "rare",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Ready 1 **TCR** type Unit you control.\nUntil the end of this turn, attacks used by that Unit deal 20 more Damage.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "032-zephyr-strike",
    "image": "/cards/032-zephyr-strike.png"
  },
  {
    "kind": "unit",
    "name": "Antonije Pušić",
    "subtitle": "Tactician",
    "type": "TCR",
    "flavor": "Charm is not a clearance level.",
    "hp": 60,
    "defense": 30,
    "cost": [
      "electron",
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "pusic-clearance-denied",
        "name": "Clearance Denied",
        "cost": [
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Your Opponent reveals their hand. Target 1 Utility card in it. Your Opponent puts that card on the bottom of their deck."
      },
      {
        "id": "pusic-counterintelligence",
        "name": "Counterintelligence",
        "cost": [
          "electron",
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Look at your Opponent's hand. Then draw 1 card."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 33,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "033-antonije-pusic",
    "image": "/cards/033-antonije-pusic.png"
  },
  {
    "kind": "unit",
    "name": "Bob Ross",
    "subtitle": "Citizen",
    "type": "X-Tremists",
    "flavor": "No mistakes. Happy accidents.",
    "hp": 60,
    "defense": 30,
    "cost": [
      "photon",
      "photon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "bob-ross-no-mistakes-only-happy-accidents-0",
        "name": "No Mistakes, Only Happy Accidents",
        "text": "Once during your turn, you may reroll 1 effect die rolled by a Unit you control."
      }
    ],
    "attacks": [
      {
        "id": "bob-ross-serene-presence",
        "name": "Serene Presence",
        "cost": [
          "photon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Unit you control. The targeted Unit is afflicted with **Tranquil**."
      },
      {
        "id": "bob-ross-beat-the-devil-out-of-it",
        "name": "Beat the Devil Out of It",
        "cost": [
          "photon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      }
    ],
    "primary": "photon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 34,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "034-bob-ross",
    "image": "/cards/034-bob-ross.png"
  },
  {
    "kind": "unit",
    "name": "Cremator",
    "subtitle": "Specialist",
    "type": "Combine",
    "flavor": "Sanitation, Combine style.",
    "hp": 95,
    "defense": 45,
    "cost": [
      "electron",
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "cremator-immolate",
        "name": "Immolate",
        "cost": [
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": "The Defending Unit is afflicted with **Infect for 10**."
      },
      {
        "id": "cremator-scorched-earth",
        "name": "Scorched Earth",
        "cost": [
          "electron",
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "cremator-scorched-earth-d8-0",
            "die": 8
          }
        ],
        "damage": "30",
        "effect": "If **[DR]** is 5 or higher, the Defending Unit is afflicted with **Infect for 20**."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 35,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "035-cremator",
    "image": "/cards/035-cremator.png"
  },
  {
    "kind": "unit",
    "name": "Disaster Spectre",
    "subtitle": "Spectre",
    "type": "",
    "flavor": "It arrives just before it does.",
    "hp": 55,
    "defense": 55,
    "cost": [
      "neutrino",
      "neutrino"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "disaster-spectre-herald-of-ruin",
        "name": "Herald of Ruin",
        "cost": [
          "neutrino",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": "The Defending Unit is afflicted with **Infect for 10**."
      },
      {
        "id": "disaster-spectre-collapse",
        "name": "Collapse",
        "cost": [
          "neutrino",
          "neutrino",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "disaster-spectre-collapse-d8-0",
            "die": 8
          }
        ],
        "damage": "30",
        "effect": "If **[DR]** is 7 or higher, the Defending Unit is afflicted with **Cursed**."
      }
    ],
    "primary": "neutrino",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 36,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "036-disaster-spectre",
    "image": "/cards/036-disaster-spectre.png"
  },
  {
    "kind": "unit",
    "name": "Elite",
    "subtitle": "Infantry",
    "type": "Combine",
    "flavor": "Nobody asks them twice.",
    "hp": 100,
    "defense": 60,
    "cost": [
      "gluon",
      "gluon",
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "elite-pulse-volley",
        "name": "Pulse Volley",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "30",
        "effect": ""
      },
      {
        "id": "elite-overwatch-volley",
        "name": "Overwatch Volley",
        "cost": [
          "gluon",
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "50",
        "effect": ""
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 37,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "037-elite",
    "image": "/cards/037-elite.png"
  },
  {
    "kind": "unit",
    "name": "Eminem",
    "subtitle": "Specialist",
    "type": "X-Tremists",
    "flavor": "He talked his way off a trident.",
    "hp": 60,
    "defense": 30,
    "cost": [
      "photon",
      "muon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "eminem-lose-yourself",
        "name": "Lose Yourself",
        "cost": [
          "photon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "eminem-lose-yourself-d12-0",
            "die": 12
          }
        ],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit is afflicted with **Cowering**. If **[DR]** is 9 or higher, this card does not become Exhausted."
      },
      {
        "id": "eminem-panic",
        "name": "Panic",
        "cost": [
          "muon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "This card gets **+30 DEF** until the end of your Opponent's next turn. Then draw 1 card."
      }
    ],
    "primary": "photon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 38,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "038-eminem",
    "image": "/cards/038-eminem.png"
  },
  {
    "kind": "unit",
    "name": "Engineer",
    "subtitle": "Specialist",
    "type": "Combine",
    "flavor": "Nobody tells him what it makes.",
    "hp": 70,
    "defense": 40,
    "cost": [
      "electron",
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "engineer-field-repair-0",
        "name": "Field Repair",
        "text": "Once during your turn, you may target 1 Machine Unit you control. That Unit recovers 10 HP."
      }
    ],
    "attacks": [
      {
        "id": "engineer-sentry-deployment",
        "name": "Sentry Deployment",
        "cost": [
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Search your deck for 1 Machine Unit with an Energy Cost of 2 or less and play it to your Backguard."
      },
      {
        "id": "engineer-arc-welder",
        "name": "Arc Welder",
        "cost": [
          "electron",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "engineer-arc-welder-d6-0",
            "die": 6
          }
        ],
        "damage": "20",
        "effect": "If **[DR]** is 5 or higher, the Defending Unit is afflicted with **Paralyzed**."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 39,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "039-engineer",
    "image": "/cards/039-engineer.png"
  },
  {
    "kind": "unit",
    "name": "Geert Wilders",
    "subtitle": "Leader",
    "type": "",
    "flavor": "Regulated was not regulated.",
    "hp": 50,
    "defense": 20,
    "cost": [
      "photon",
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "geert-wilders-populist-appeal-0",
        "name": "Populist Appeal",
        "text": "Citizen Units you control get **+10 DEF**, and attacks used by them deal 10 more Damage."
      }
    ],
    "attacks": [
      {
        "id": "wilders-loud-rhetoric",
        "name": "Loud Rhetoric",
        "cost": [
          "photon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Citizen Units you control get **+20 DEF** until the end of your Opponent's next turn."
      },
      {
        "id": "wilders-border-control",
        "name": "Border Control",
        "cost": [
          "photon",
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Until the end of your Opponent's next turn, your Opponent cannot play Units to their Backguard."
      }
    ],
    "primary": "photon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 40,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "040-geert-wilders",
    "image": "/cards/040-geert-wilders.png"
  },
  {
    "kind": "unit",
    "name": "Kramer",
    "subtitle": "Citizen",
    "type": "X-Perience",
    "flavor": "I walked into the wrong garage.",
    "hp": 55,
    "defense": 25,
    "cost": [
      "muon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "kramer-management-0",
        "name": "Management",
        "text": "**X-Perience** type Units you control cost **[A]** less to play."
      }
    ],
    "attacks": [
      {
        "id": "kramer-wrong-garage",
        "name": "Wrong Garage",
        "cost": [
          "muon"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "kramer-wrong-garage-d6-0",
            "die": 6
          }
        ],
        "damage": "N",
        "effect": "If **[DR]** is 4 or higher, search your deck for 1 **X-Perience** type Unit and put it into your hand."
      }
    ],
    "primary": "muon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 41,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "041-kramer",
    "image": "/cards/041-kramer.png"
  },
  {
    "kind": "unit",
    "name": "Lawmaker",
    "subtitle": "Tactician",
    "type": "TCR",
    "flavor": "The Coalition wrote good law.",
    "hp": 50,
    "defense": 25,
    "cost": [
      "gluon",
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "lawmaker-regulated-travel-0",
        "name": "Regulated Travel",
        "text": "Units your Opponent controls cannot Rotate during the turn they are played."
      }
    ],
    "attacks": [
      {
        "id": "lawmaker-emergency-session",
        "name": "Emergency Session",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Search your deck for 1 **Continuous Effect** Utility card and put it into your hand."
      },
      {
        "id": "lawmaker-gavel",
        "name": "Gavel",
        "cost": [
          "gluon",
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit becomes Exhausted. If you control a Leader Unit, the targeted Unit is also afflicted with **Cowering**."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 42,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "042-lawmaker",
    "image": "/cards/042-lawmaker.png"
  },
  {
    "kind": "unit",
    "name": "Marksman",
    "subtitle": "Marksman",
    "type": "TCR",
    "flavor": "Four centuries. Same drill.",
    "hp": 70,
    "defense": 40,
    "cost": [
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "marksman-ranged-support",
        "name": "Ranged Support",
        "cost": [
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit takes 20 Damage."
      },
      {
        "id": "marksman-precision-shot",
        "name": "Precision Shot",
        "cost": [
          "electron",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "marksman-precision-shot-d8-0",
            "die": 8
          }
        ],
        "damage": "30+",
        "effect": "If **[DR]** is 7 or higher, this attack deals 20 more Damage."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 43,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "043-marksman",
    "image": "/cards/043-marksman.png"
  },
  {
    "kind": "unit",
    "name": "Motu",
    "subtitle": "Bruiser",
    "type": "X-Perience",
    "flavor": "Fuel first. Heroics after.",
    "hp": 100,
    "defense": 35,
    "cost": [
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "motu-samosa-surge-0",
        "name": "Samosa Surge",
        "text": "Once during your turn, you may Vanquish 1 Energy you control. If you do, attacks used by this card deal 20 more Damage this turn."
      }
    ],
    "attacks": [
      {
        "id": "motu-rolling-charge",
        "name": "Rolling Charge",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      },
      {
        "id": "motu-belly-bounce",
        "name": "Belly Bounce",
        "cost": [
          "boson",
          "boson"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "motu-belly-bounce-d4-0",
            "die": 4
          }
        ],
        "damage": "30",
        "effect": "If **[DR]** is 1, this card takes 10 Damage."
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 44,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "044-motu",
    "image": "/cards/044-motu.png"
  },
  {
    "kind": "unit",
    "name": "Murdoc Niccals",
    "subtitle": "Rogue",
    "type": "X-Tremists",
    "flavor": "We found them in a crate.",
    "hp": 65,
    "defense": 35,
    "cost": [
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "murdoc-niccals-reluctant-pilot-0",
        "name": "Reluctant Pilot",
        "text": "Once during your turn, you may Rotate this card. It does not become Exhausted."
      }
    ],
    "attacks": [
      {
        "id": "murdoc-bass-feedback",
        "name": "Bass Feedback",
        "cost": [
          "muon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "murdoc-bass-feedback-d6-0",
            "die": 6
          }
        ],
        "damage": "20+",
        "effect": "If **[DR]** is 3 or lower, this card takes 10 Damage. If **[DR]** is 4 or higher, this attack deals 20 more Damage."
      },
      {
        "id": "murdoc-get-in-the-ship",
        "name": "Get In The Ship",
        "cost": [
          "muon",
          "muon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Rotate each **X-Tremists** type Unit you control. They do not become Exhausted."
      }
    ],
    "primary": "muon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 45,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "045-murdoc-niccals",
    "image": "/cards/045-murdoc-niccals.png"
  },
  {
    "kind": "unit",
    "name": "Observing Spectre",
    "subtitle": "Spectre",
    "type": "",
    "flavor": "It makes sure someone saw.",
    "hp": 45,
    "defense": 65,
    "cost": [
      "neutrino",
      "neutrino"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "observing-spectre-unseen-0",
        "name": "Unseen",
        "text": "While you control another Spectre Unit, attacks that target this card deal 10 less Damage."
      }
    ],
    "attacks": [
      {
        "id": "observing-spectre-watching",
        "name": "Watching",
        "cost": [
          "neutrino"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Look at the top 5 cards of your Opponent's deck. Put 1 of them on the bottom of their deck and the rest back in any order."
      },
      {
        "id": "observing-spectre-cold-touch",
        "name": "Cold Touch",
        "cost": [
          "neutrino",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": "The Defending Unit is afflicted with **Weakened**."
      }
    ],
    "primary": "neutrino",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 46,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "046-observing-spectre",
    "image": "/cards/046-observing-spectre.png"
  },
  {
    "kind": "unit",
    "name": "Peter Griffin",
    "subtitle": "Bruiser",
    "type": "",
    "flavor": "Nobody has asked which universe.",
    "hp": 110,
    "defense": 25,
    "cost": [
      "muon",
      "boson"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "peter-freakin-sweet",
        "name": "Freakin' Sweet",
        "cost": [
          "muon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "30",
        "effect": ""
      },
      {
        "id": "peter-chicken-fight",
        "name": "Chicken Fight",
        "cost": [
          "muon",
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "40",
        "effect": ""
      }
    ],
    "primary": "muon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 47,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "047-peter-griffin",
    "image": "/cards/047-peter-griffin.png"
  },
  {
    "kind": "unit",
    "name": "Sniper",
    "subtitle": "Marksman",
    "type": "Combine",
    "flavor": "Somewhere, a scope is warm.",
    "hp": 70,
    "defense": 35,
    "cost": [
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "sniper-marked-target-0",
        "name": "Marked Target",
        "text": "When this card attacks, the Defending Unit gets **-20 DEF** for that Defense Check."
      }
    ],
    "attacks": [
      {
        "id": "sniper-silent-shot",
        "name": "Silent Shot",
        "cost": [
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "sniper-silent-shot-d8-0",
            "die": 8
          }
        ],
        "damage": "BG",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit takes 20 Damage. If **[DR]** is 6 or higher, that Unit is afflicted with **Weakened**."
      },
      {
        "id": "sniper-headshot",
        "name": "Headshot",
        "cost": [
          "electron",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "sniper-headshot-d20-0",
            "die": 20
          }
        ],
        "damage": "30",
        "effect": "If **[DR]** is 18 or higher, this attack is a **Critical Hit**."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 48,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "048-sniper",
    "image": "/cards/048-sniper.png"
  },
  {
    "kind": "unit",
    "name": "Stalker",
    "subtitle": "Creation",
    "type": "Combine",
    "flavor": "They kept the useful parts.",
    "hp": 60,
    "defense": 30,
    "cost": [
      "neutrino",
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "stalker-hollowed-0",
        "name": "Hollowed",
        "text": "This card is unaffected by **Conditions**."
      }
    ],
    "attacks": [
      {
        "id": "stalker-rebuilt-limbs",
        "name": "Rebuilt Limbs",
        "cost": [
          "neutrino"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      },
      {
        "id": "stalker-conversion-protocol",
        "name": "Conversion Protocol",
        "cost": [
          "neutrino",
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Citizen Unit your Opponent controls. Vanquish it."
      }
    ],
    "primary": "neutrino",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 49,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "049-stalker",
    "image": "/cards/049-stalker.png"
  },
  {
    "kind": "unit",
    "name": "Stanley Pines",
    "subtitle": "Rogue",
    "type": "",
    "flavor": "The case is not authentic.",
    "hp": 70,
    "defense": 35,
    "cost": [
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "stanley-pines-mystery-shack-0",
        "name": "Mystery Shack",
        "text": "Once during your turn, you may look at the top 3 cards of your Opponent's deck and put them back in any order."
      }
    ],
    "attacks": [
      {
        "id": "stanley-sell-them-junk",
        "name": "Sell Them Junk",
        "cost": [
          "muon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Search your Vanquished Pile for 1 Utility card and put it into your hand."
      },
      {
        "id": "stanley-brass-knuckles",
        "name": "Brass Knuckles",
        "cost": [
          "muon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      }
    ],
    "primary": "muon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 50,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "050-stanley-pines",
    "image": "/cards/050-stanley-pines.png"
  },
  {
    "kind": "unit",
    "name": "Stewie Griffin",
    "subtitle": "Specialist",
    "type": "",
    "flavor": "He improved the blueprints.",
    "hp": 40,
    "defense": 30,
    "cost": [
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "stewie-griffin-prototype-workshop-0",
        "name": "Prototype Workshop",
        "text": "When this card is played, search your deck for 1 **Equipment** Utility card and put it into your hand."
      }
    ],
    "attacks": [
      {
        "id": "stewie-ray-gun",
        "name": "Ray Gun",
        "cost": [
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "stewie-ray-gun-d8-0",
            "die": 8
          }
        ],
        "damage": "20",
        "effect": "If **[DR]** is 7 or higher, the Defending Unit is afflicted with **Paralyzed**."
      },
      {
        "id": "stewie-time-machine",
        "name": "Time Machine",
        "cost": [
          "electron",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Put 1 Unit from your Vanquished Pile into your hand."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 51,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "051-stewie-griffin",
    "image": "/cards/051-stewie-griffin.png"
  },
  {
    "kind": "unit",
    "name": "Tech Specialist",
    "subtitle": "Specialist",
    "type": "TCR",
    "flavor": "Old, documented, repairable.",
    "hp": 65,
    "defense": 35,
    "cost": [
      "electron",
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "tech-specialist-systems-access-0",
        "name": "Systems Access",
        "text": "Machine Units you control get **+10 DEF**."
      }
    ],
    "attacks": [
      {
        "id": "tech-specialist-recalibrate",
        "name": "Recalibrate",
        "cost": [
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Ready 1 Machine Unit you control with an Energy Cost of 2 or less."
      },
      {
        "id": "tech-specialist-overclock",
        "name": "Overclock",
        "cost": [
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Machine Unit you control. Until the end of this turn, attacks used by the targeted Unit deal 20 more Damage."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 52,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "052-tech-specialist",
    "image": "/cards/052-tech-specialist.png"
  },
  {
    "kind": "unit",
    "name": "Tupac",
    "subtitle": "Gunner",
    "type": "",
    "flavor": "Earth-Alpha never went quiet.",
    "hp": 65,
    "defense": 35,
    "cost": [
      "photon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "tupac-all-eyez",
        "name": "All Eyez",
        "cost": [
          "photon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Look at your Opponent's hand. Then this card gets **+20 DEF** until the end of your Opponent's next turn."
      },
      {
        "id": "tupac-hit-em-up",
        "name": "Hit 'Em Up",
        "cost": [
          "photon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "tupac-hit-em-up-d10-0",
            "die": 10
          }
        ],
        "damage": "30",
        "effect": "If **[DR]** is 7 or higher, the Defending Unit is afflicted with **Weakened**."
      }
    ],
    "primary": "photon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 53,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "053-tupac",
    "image": "/cards/053-tupac.png"
  },
  {
    "kind": "unit",
    "name": "Vale",
    "subtitle": "Specialist",
    "type": "TCR",
    "flavor": "I can give you five minutes.",
    "hp": 55,
    "defense": 30,
    "cost": [
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [
      {
        "id": "vale-comms-officer-0",
        "name": "Comms Officer",
        "text": "**Free Effect** Utility cards you play cost **[A]** less."
      }
    ],
    "attacks": [
      {
        "id": "vale-five-minutes",
        "name": "Five Minutes",
        "cost": [
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit is afflicted with **Cowering**."
      },
      {
        "id": "vale-orbital-relay",
        "name": "Orbital Relay",
        "cost": [
          "electron",
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Look at the top 5 cards of your deck. Put 1 Utility card from among them into your hand and the rest on the bottom of your deck."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 54,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "054-vale",
    "image": "/cards/054-vale.png"
  },
  {
    "kind": "utility",
    "name": "Clearmind",
    "subtitle": "",
    "type": "",
    "flavor": "Breathe. The door is locked.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "photon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 55,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "free",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Remove all **Conditions** from each Unit you control.\nThen target 1 Unit you control. That Unit is afflicted with **Tranquil**.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "055-clearmind",
    "image": "/cards/055-clearmind.png"
  },
  {
    "kind": "utility",
    "name": "Contract with the TCR",
    "subtitle": "",
    "type": "X-Tremists",
    "flavor": "Registered. Issued one hauler.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "gluon",
      "photon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 56,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "continuous",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "**X-Tremists** type Units you control are also **TCR** type Units.\nOnce during your turn, if you control 3 or more **X-Tremists** type Units, you may draw 1 card.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "056-contract-with-the-tcr",
    "image": "/cards/056-contract-with-the-tcr.png"
  },
  {
    "kind": "utility",
    "name": "Incoming Warning",
    "subtitle": "",
    "type": "TCR",
    "flavor": "Inbound. You have four minutes.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 57,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "free",
    "utilityContent": "effect",
    "utilityCondition": "Play this card when your Opponent uses an attack.",
    "utilityEffect": "Units you control take 20 less Attack Damage from that attack.\nThen draw 1 card.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "057-incoming-warning",
    "image": "/cards/057-incoming-warning.png"
  },
  {
    "kind": "utility",
    "name": "Infiltration Strike",
    "subtitle": "",
    "type": "X-Tremists",
    "flavor": "Getting out is the hard part.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "muon",
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 58,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Target 1 Unit your Opponent controls in their Backguard. That Unit takes 30 Damage.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "058-infiltration-strike",
    "image": "/cards/058-infiltration-strike.png"
  },
  {
    "kind": "utility",
    "name": "Inter-Hyperversal Space",
    "subtitle": "",
    "type": "",
    "flavor": "Between worlds, something waits.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "neutrino",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 59,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Target 1 Unit you control. Return it to your hand.\nAll **Equipment** attached to it is Vanquished.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "059-inter-hyperversal-space",
    "image": "/cards/059-inter-hyperversal-space.png"
  },
  {
    "kind": "utility",
    "name": "Oblique Blade",
    "subtitle": "",
    "type": "TCR",
    "flavor": "It cuts on the unguarded angle.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "electron",
      "muon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 60,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "equipment",
    "utilityContent": "attack",
    "utilityCondition": "Attach this card to a **TCR** type Unit or an Assassin Unit you control.",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "oblique-blade-riposte",
      "name": "Riposte",
      "cost": [
        "electron",
        "muon"
      ],
      "isGenericCostVariable": false,
      "dice": [
        {
          "id": "oblique-blade-riposte-d8-0",
          "die": 8
        }
      ],
      "damage": "30",
      "effect": "If **[DR]** is 7 or higher, the equipped Unit does not become Exhausted."
    },
    "id": "060-oblique-blade",
    "image": "/cards/060-oblique-blade.png"
  },
  {
    "kind": "utility",
    "name": "One Punch!",
    "subtitle": "",
    "type": "X-Perience",
    "flavor": "He has waited all mission.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "boson",
      "boson"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 61,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Target 1 Bruiser Unit you control. Until the end of this turn, attacks used by that Unit deal 30 more Damage.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "061-one-punch",
    "image": "/cards/061-one-punch.png"
  },
  {
    "kind": "utility",
    "name": "Overwatch Directive",
    "subtitle": "",
    "type": "Combine",
    "flavor": "Movement is reportable.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "gluon",
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 62,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "continuous",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Whenever a Unit your Opponent controls Rotates, that Unit takes 10 Damage.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "062-overwatch-directive",
    "image": "/cards/062-overwatch-directive.png"
  },
  {
    "kind": "utility",
    "name": "Suppressing Fire",
    "subtitle": "",
    "type": "",
    "flavor": "Accuracy is optional.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 63,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Each Unit your Opponent controls in their Vanguard takes 10 Damage.\nUntil the end of your Opponent's next turn, those Units get **-10 DEF**.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "063-suppressing-fire",
    "image": "/cards/063-suppressing-fire.png"
  },
  {
    "kind": "utility",
    "name": "Transhuman Conditioning",
    "subtitle": "",
    "type": "Combine",
    "flavor": "Fear was removed early.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "neutrino",
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 64,
    "total": 102,
    "rarity": "uncommon",
    "utilityType": "continuous",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "**Combine** type Units you control cannot be afflicted with **Cowering** or **Weakened**, and get **+10 DEF**.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "064-transhuman-conditioning",
    "image": "/cards/064-transhuman-conditioning.png"
  },
  {
    "kind": "unit",
    "name": "2D",
    "subtitle": "Citizen",
    "type": "",
    "flavor": "He is rarely sure.",
    "hp": 45,
    "defense": 20,
    "cost": [
      "photon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "2d-off-key",
        "name": "Off-Key",
        "cost": [
          "photon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      },
      {
        "id": "2d-on-melancholy-hill",
        "name": "On Melancholy Hill",
        "cost": [
          "photon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Each Unit you control recovers 10 HP."
      }
    ],
    "primary": "photon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 65,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "065-2d",
    "image": "/cards/065-2d.png"
  },
  {
    "kind": "unit",
    "name": "Andy King",
    "subtitle": "Citizen",
    "type": "TCR",
    "flavor": "Registered voter, Earth Superior.",
    "hp": 45,
    "defense": 20,
    "cost": [
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "andy-king-civic-duty",
        "name": "Civic Duty",
        "cost": [
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Draw 1 card."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 66,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "066-andy-king",
    "image": "/cards/066-andy-king.png"
  },
  {
    "kind": "unit",
    "name": "Civilian",
    "subtitle": "Citizen",
    "type": "",
    "flavor": "Someone had to keep living.",
    "hp": 40,
    "defense": 20,
    "cost": [
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "civilian-improvised-weapon",
        "name": "Improvised Weapon",
        "cost": [
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 67,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "067-civilian",
    "image": "/cards/067-civilian.png"
  },
  {
    "kind": "unit",
    "name": "Cleaning Droid",
    "subtitle": "Machine",
    "type": "",
    "flavor": "It outlived three governments.",
    "hp": 40,
    "defense": 30,
    "cost": [
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "cleaning-droid-scrub",
        "name": "Scrub",
        "cost": [
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Remove all **Conditions** from 1 Unit you control."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 68,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "068-cleaning-droid",
    "image": "/cards/068-cleaning-droid.png"
  },
  {
    "kind": "unit",
    "name": "Conscript",
    "subtitle": "Infantry",
    "type": "Combine",
    "flavor": "The Combine reassigns.",
    "hp": 50,
    "defense": 25,
    "cost": [
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "conscript-ordered-forward",
        "name": "Ordered Forward",
        "cost": [
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      },
      {
        "id": "conscript-human-wave",
        "name": "Human Wave",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20+",
        "effect": "If you control 3 or more other **Combine** type Infantry Units, this attack deals 20 more Damage."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 69,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "069-conscript",
    "image": "/cards/069-conscript.png"
  },
  {
    "kind": "unit",
    "name": "Demoman",
    "subtitle": "Gunner",
    "type": "",
    "flavor": "One eye. Excellent aim.",
    "hp": 80,
    "defense": 35,
    "cost": [
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "demoman-sticky-trap",
        "name": "Sticky Trap",
        "cost": [
          "boson"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "demoman-sticky-trap-d6-0",
            "die": 6
          }
        ],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit takes 10 x **[DR]** Damage."
      },
      {
        "id": "demoman-grenade-launcher",
        "name": "Grenade Launcher",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "demoman-grenade-launcher-d4-0",
            "die": 4
          }
        ],
        "damage": "20",
        "effect": "If **[DR]** is 1, this card takes 20 Damage."
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 70,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "070-demoman",
    "image": "/cards/070-demoman.png"
  },
  {
    "kind": "unit",
    "name": "Desert Droid",
    "subtitle": "Machine",
    "type": "",
    "flavor": "Sand in everything. Still on.",
    "hp": 85,
    "defense": 45,
    "cost": [
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "desert-droid-sandblast",
        "name": "Sandblast",
        "cost": [
          "boson"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      },
      {
        "id": "desert-droid-dune-charge",
        "name": "Dune Charge",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "30",
        "effect": ""
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 71,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "071-desert-droid",
    "image": "/cards/071-desert-droid.png"
  },
  {
    "kind": "unit",
    "name": "Grunt",
    "subtitle": "Infantry",
    "type": "Combine",
    "flavor": "Armor, rations, no briefing.",
    "hp": 75,
    "defense": 40,
    "cost": [
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "grunt-heavy-swing",
        "name": "Heavy Swing",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "40",
        "effect": ""
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 72,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "072-grunt",
    "image": "/cards/072-grunt.png"
  },
  {
    "kind": "unit",
    "name": "Guard",
    "subtitle": "Infantry",
    "type": "Combine",
    "flavor": "Assigned personnel sleep here.",
    "hp": 90,
    "defense": 65,
    "cost": [
      "gluon",
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "guard-riot-shield",
        "name": "Riot Shield",
        "cost": [
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "This card takes 10 less Attack Damage until the end of your Opponent's next turn."
      },
      {
        "id": "guard-baton-strike",
        "name": "Baton Strike",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 73,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "073-guard",
    "image": "/cards/073-guard.png"
  },
  {
    "kind": "unit",
    "name": "Junk Droid",
    "subtitle": "Machine",
    "type": "",
    "flavor": "Salvage rated. Not for this.",
    "hp": 45,
    "defense": 30,
    "cost": [
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "junk-droid-scrap-toss",
        "name": "Scrap Toss",
        "cost": [
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      },
      {
        "id": "junk-droid-self-destruct",
        "name": "Self-Destruct",
        "cost": [
          "electron",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. Vanquish this card. The targeted Unit takes 30 Damage."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 74,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "074-junk-droid",
    "image": "/cards/074-junk-droid.png"
  },
  {
    "kind": "unit",
    "name": "Metrocop",
    "subtitle": "Infantry",
    "type": "Combine",
    "flavor": "The name was chosen carefully.",
    "hp": 60,
    "defense": 35,
    "cost": [
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "metrocop-stun-stick",
        "name": "Stun Stick",
        "cost": [
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      },
      {
        "id": "metrocop-apply-pressure",
        "name": "Apply Pressure",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 75,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "075-metrocop",
    "image": "/cards/075-metrocop.png"
  },
  {
    "kind": "unit",
    "name": "Mining Droid",
    "subtitle": "Machine",
    "type": "",
    "flavor": "It does not extract itself.",
    "hp": 90,
    "defense": 45,
    "cost": [
      "boson"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "mining-droid-extract",
        "name": "Extract",
        "cost": [
          "boson"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Search your deck for 1 Energy card and put it into your hand."
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 76,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "076-mining-droid",
    "image": "/cards/076-mining-droid.png"
  },
  {
    "kind": "unit",
    "name": "Norm of the North",
    "subtitle": "Bruiser",
    "type": "",
    "flavor": "Displaced. Extremely annoyed.",
    "hp": 120,
    "defense": 30,
    "cost": [
      "boson",
      "boson",
      "muon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "norm-bear-hug",
        "name": "Bear Hug",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "norm-bear-hug-d4-0",
            "die": 4
          }
        ],
        "damage": "20",
        "effect": "If **[DR]** is 4, the Defending Unit is afflicted with **Paralyzed**."
      },
      {
        "id": "norm-arctic-slam",
        "name": "Arctic Slam",
        "cost": [
          "boson",
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "40",
        "effect": ""
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 77,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "077-norm-of-the-north",
    "image": "/cards/077-norm-of-the-north.png"
  },
  {
    "kind": "unit",
    "name": "Pilot",
    "subtitle": "Specialist",
    "type": "TCR",
    "flavor": "It flies. That is the pitch.",
    "hp": 55,
    "defense": 40,
    "cost": [
      "muon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "pilot-evasive-pattern",
        "name": "Evasive Pattern",
        "cost": [
          "muon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Rotate 1 Unit you control. It does not become Exhausted."
      },
      {
        "id": "pilot-strafing-run",
        "name": "Strafing Run",
        "cost": [
          "muon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      }
    ],
    "primary": "muon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 78,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "078-pilot",
    "image": "/cards/078-pilot.png"
  },
  {
    "kind": "unit",
    "name": "Retrieval Machine",
    "subtitle": "Machine",
    "type": "TCR",
    "flavor": "Dead, data, hardware. In order.",
    "hp": 85,
    "defense": 45,
    "cost": [
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "retrieval-machine-salvage",
        "name": "Salvage",
        "cost": [
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Put 1 Machine Unit from your Vanquished Pile into your hand."
      },
      {
        "id": "retrieval-machine-grapple",
        "name": "Grapple",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "retrieval-machine-grapple-d4-0",
            "die": 4
          }
        ],
        "damage": "20",
        "effect": "If **[DR]** is 3 or higher, Rotate the Defending Unit."
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 79,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "079-retrieval-machine",
    "image": "/cards/079-retrieval-machine.png"
  },
  {
    "kind": "unit",
    "name": "Rover",
    "subtitle": "Machine",
    "type": "TCR",
    "flavor": "Still under warranty.",
    "hp": 90,
    "defense": 55,
    "cost": [
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "rover-ram",
        "name": "Ram",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "30",
        "effect": ""
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 80,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "080-rover",
    "image": "/cards/080-rover.png"
  },
  {
    "kind": "unit",
    "name": "Salesman",
    "subtitle": "Citizen",
    "type": "",
    "flavor": "Credits accepted. Rest is open.",
    "hp": 45,
    "defense": 20,
    "cost": [
      "photon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "salesman-hard-sell",
        "name": "Hard Sell",
        "cost": [
          "photon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Draw 1 card. Then put 1 card from your hand on the bottom of your deck."
      },
      {
        "id": "salesman-briefcase-swing",
        "name": "Briefcase Swing",
        "cost": [
          "photon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      }
    ],
    "primary": "photon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 81,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "081-salesman",
    "image": "/cards/081-salesman.png"
  },
  {
    "kind": "unit",
    "name": "Scanner",
    "subtitle": "Machine",
    "type": "Combine",
    "flavor": "The flash is the report.",
    "hp": 40,
    "defense": 30,
    "cost": [
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "scanner-flash-scan",
        "name": "Flash Scan",
        "cost": [
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Look at the top 3 cards of your deck. Put 1 of them into your hand and the rest on the bottom of your deck."
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 82,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "082-scanner",
    "image": "/cards/082-scanner.png"
  },
  {
    "kind": "unit",
    "name": "Scout Droid",
    "subtitle": "Machine",
    "type": "TCR",
    "flavor": "It has seen the far side.",
    "hp": 35,
    "defense": 30,
    "cost": [
      "electron"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "scout-droid-recon-sweep",
        "name": "Recon Sweep",
        "cost": [
          "electron"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Look at the top 4 cards of your deck. Put 1 Machine Unit from among them into your hand and the rest on the bottom of your deck."
      },
      {
        "id": "scout-droid-spark",
        "name": "Spark",
        "cost": [
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      }
    ],
    "primary": "electron",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 83,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "083-scout-droid",
    "image": "/cards/083-scout-droid.png"
  },
  {
    "kind": "unit",
    "name": "Sentry",
    "subtitle": "Machine",
    "type": "",
    "flavor": "It does not blink.",
    "hp": 70,
    "defense": 55,
    "cost": [
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "sentry-lock-on",
        "name": "Lock On",
        "cost": [
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Target 1 Unit your Opponent controls. The targeted Unit gets **-20 DEF** until the end of your Opponent's next turn."
      },
      {
        "id": "sentry-turret-fire",
        "name": "Turret Fire",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20",
        "effect": ""
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 84,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "084-sentry",
    "image": "/cards/084-sentry.png"
  },
  {
    "kind": "unit",
    "name": "Soldier",
    "subtitle": "Infantry",
    "type": "Combine",
    "flavor": "There is always another one.",
    "hp": 85,
    "defense": 50,
    "cost": [
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "combine-soldier-standard-issue",
        "name": "Standard Issue",
        "cost": [
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      },
      {
        "id": "combine-soldier-squad-fire",
        "name": "Squad Fire",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20+",
        "effect": "This attack deals 10 more Damage for each other **Combine** type Infantry Unit you control."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 85,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "085-soldier",
    "image": "/cards/085-soldier.png"
  },
  {
    "kind": "unit",
    "name": "Soldier",
    "subtitle": "Infantry",
    "type": "",
    "flavor": "Nobody has told him yet.",
    "hp": 90,
    "defense": 40,
    "cost": [
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "soldier-tf2-rocket-jump",
        "name": "Rocket Jump",
        "cost": [
          "boson"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Rotate this card. It does not become Exhausted. Then this card takes 10 Damage."
      },
      {
        "id": "soldier-tf2-rocket-launcher",
        "name": "Rocket Launcher",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [
          {
            "id": "soldier-tf2-rocket-launcher-d4-0",
            "die": 4
          }
        ],
        "damage": "30",
        "effect": "If **[DR]** is 1, this card takes 10 Damage."
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 86,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "086-soldier-tf2",
    "image": "/cards/086-soldier-tf2.png"
  },
  {
    "kind": "unit",
    "name": "Transport Droid",
    "subtitle": "Machine",
    "type": "",
    "flavor": "Automated route. No override.",
    "hp": 95,
    "defense": 40,
    "cost": [
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "transport-droid-load-cargo",
        "name": "Load Cargo",
        "cost": [
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "BG",
        "effect": "Put 1 Unit with an Energy Cost of 1 from your Vanquished Pile into your hand."
      },
      {
        "id": "transport-droid-heavy-haul",
        "name": "Heavy Haul",
        "cost": [
          "boson",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "N",
        "effect": "Rotate 1 Unit you control. It does not become Exhausted."
      }
    ],
    "primary": "boson",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 87,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "087-transport-droid",
    "image": "/cards/087-transport-droid.png"
  },
  {
    "kind": "unit",
    "name": "Trooper",
    "subtitle": "Infantry",
    "type": "TCR",
    "flavor": "Ninety seconds. That good.",
    "hp": 80,
    "defense": 45,
    "cost": [
      "gluon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [
      {
        "id": "trooper-service-rifle",
        "name": "Service Rifle",
        "cost": [
          "gluon"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "10",
        "effect": ""
      },
      {
        "id": "trooper-formation-fire",
        "name": "Formation Fire",
        "cost": [
          "gluon",
          "any"
        ],
        "isGenericCostVariable": false,
        "dice": [],
        "damage": "20+",
        "effect": "This attack deals 10 more Damage for each other **TCR** type Infantry Unit you control."
      }
    ],
    "primary": "gluon",
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 88,
    "total": 102,
    "rarity": "common",
    "utilityType": "instant",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "088-trooper",
    "image": "/cards/088-trooper.png"
  },
  {
    "kind": "utility",
    "name": "Battle Medicine",
    "subtitle": "",
    "type": "",
    "flavor": "Tastes like tomato soup.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "photon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 89,
    "total": 102,
    "rarity": "common",
    "utilityType": "free",
    "utilityContent": "effect",
    "utilityCondition": "",
    "utilityEffect": "Target 1 Unit you control. That Unit recovers 30 HP.\nThen remove all **Conditions** from it.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "089-battle-medicine",
    "image": "/cards/089-battle-medicine.png"
  },
  {
    "kind": "utility",
    "name": "Deploy Armor",
    "subtitle": "",
    "type": "",
    "flavor": "Fake plating stops real rounds.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "boson",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 90,
    "total": 102,
    "rarity": "common",
    "utilityType": "equipment",
    "utilityContent": "effect",
    "utilityCondition": "Attach this card to any Unit you control.",
    "utilityEffect": "The equipped Unit gets **+20 HP** and **+10 DEF**.\nIf the equipped Unit is a Machine Unit, it gets **+40 HP** instead.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "090-deploy-armor",
    "image": "/cards/090-deploy-armor.png"
  },
  {
    "kind": "utility",
    "name": "Herring Bandito",
    "subtitle": "",
    "type": "",
    "flavor": "The serial number is a fish.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 91,
    "total": 102,
    "rarity": "common",
    "utilityType": "equipment",
    "utilityContent": "attack",
    "utilityCondition": "Attach this card to a Rogue Unit, a Gunner Unit or a Citizen Unit you control.",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "herring-bandito-empty-the-clip",
      "name": "Empty the Clip",
      "cost": [
        "muon",
        "any"
      ],
      "isGenericCostVariable": false,
      "dice": [
        {
          "id": "herring-bandito-empty-the-clip-d4-0",
          "die": 4
        }
      ],
      "damage": "20+",
      "effect": "This attack deals 10 x **[DR]** more Damage."
    },
    "id": "091-herring-bandito",
    "image": "/cards/091-herring-bandito.png"
  },
  {
    "kind": "utility",
    "name": "Keltec PR57",
    "subtitle": "",
    "type": "",
    "flavor": "Legal in nine universes.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "any",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 92,
    "total": 102,
    "rarity": "common",
    "utilityType": "equipment",
    "utilityContent": "attack",
    "utilityCondition": "Attach this card to any Unit you control.",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "keltec-pr57-point-blank",
      "name": "Point Blank",
      "cost": [
        "any",
        "any"
      ],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "20",
      "effect": ""
    },
    "id": "092-keltec-pr57",
    "image": "/cards/092-keltec-pr57.png"
  },
  {
    "kind": "utility",
    "name": "Narrow Escape",
    "subtitle": "",
    "type": "X-Tremists",
    "flavor": "The engines caught. Barely.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "muon",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 93,
    "total": 102,
    "rarity": "common",
    "utilityType": "free",
    "utilityContent": "effect",
    "utilityCondition": "Play this card when an **X-Tremists** type Unit you control is targeted by an attack.",
    "utilityEffect": "Rotate the targeted Unit. It does not become Exhausted.\nThen that attack fails.",
    "utilityAttack": {
      "id": "unused-utility-attack",
      "name": "",
      "cost": [],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "",
      "effect": ""
    },
    "id": "093-narrow-escape",
    "image": "/cards/093-narrow-escape.png"
  },
  {
    "kind": "utility",
    "name": "Pulse Rifle",
    "subtitle": "",
    "type": "Combine",
    "flavor": "Standard issue. Standard result.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 94,
    "total": 102,
    "rarity": "common",
    "utilityType": "equipment",
    "utilityContent": "attack",
    "utilityCondition": "Attach this card to a **Combine** type Unit you control.",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "pulse-rifle-controlled-burst",
      "name": "Controlled Burst",
      "cost": [
        "electron",
        "any"
      ],
      "isGenericCostVariable": false,
      "dice": [],
      "damage": "30",
      "effect": ""
    },
    "id": "094-pulse-rifle",
    "image": "/cards/094-pulse-rifle.png"
  },
  {
    "kind": "utility",
    "name": "Stun Baton",
    "subtitle": "",
    "type": "Combine",
    "flavor": "A compliance tool. Officially.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "gluon"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 95,
    "total": 102,
    "rarity": "common",
    "utilityType": "equipment",
    "utilityContent": "attack",
    "utilityCondition": "Attach this card to a **Combine** type Infantry Unit you control.",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "stun-baton-compliance-shock",
      "name": "Compliance Shock",
      "cost": [
        "gluon"
      ],
      "isGenericCostVariable": false,
      "dice": [
        {
          "id": "stun-baton-compliance-shock-d6-0",
          "die": 6
        }
      ],
      "damage": "N",
      "effect": "Target 1 Unit your Opponent controls. If **[DR]** is 5 or higher, the targeted Unit is afflicted with **Cowering**."
    },
    "id": "095-stun-baton",
    "image": "/cards/095-stun-baton.png"
  },
  {
    "kind": "utility",
    "name": "TCR-V02 Strike Gun",
    "subtitle": "",
    "type": "TCR",
    "flavor": "Reliable. Utterly unimaginative.",
    "hp": 0,
    "defense": 0,
    "cost": [
      "electron",
      "any"
    ],
    "isGenericCostVariable": false,
    "art": null,
    "artZoom": 1,
    "artX": 0.5,
    "artY": 0.5,
    "abilities": [],
    "attacks": [],
    "primary": null,
    "unitTreatment": "standard",
    "setId": "ORIG",
    "number": 96,
    "total": 102,
    "rarity": "common",
    "utilityType": "equipment",
    "utilityContent": "attack",
    "utilityCondition": "Attach this card to a **TCR** type Unit you control.",
    "utilityEffect": "",
    "utilityAttack": {
      "id": "tcr-v02-aimed-burst",
      "name": "Aimed Burst",
      "cost": [
        "electron",
        "any"
      ],
      "isGenericCostVariable": false,
      "dice": [
        {
          "id": "tcr-v02-aimed-burst-d6-0",
          "die": 6
        }
      ],
      "damage": "30+",
      "effect": "If **[DR]** is 6, this attack deals 20 more Damage."
    },
    "id": "096-tcr-v02-strike-gun",
    "image": "/cards/096-tcr-v02-strike-gun.png"
  }
] as const;
