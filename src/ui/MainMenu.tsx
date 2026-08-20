import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ENERGY_META, getCard } from '../data/catalog';
import {
  DECK_PRESETS, getDeckCardCount, getDeckEnergyCounts, getDeckPreset, getOpponentDeckId,
} from '../game/deck';
import type { EnergyType } from '../game/types';
import { LogoGlyph, MakerEnergyOrb } from './MakerGraphics';

interface MainMenuProps {
  selectedDeckId: string;
  onSelectDeck: (deckId: string) => void;
  onStart: () => void;
  onOpenCampaign: () => void;
}

function FeaturedCard({ cardId, position }: { cardId: string; position: number }) {
  const [hasImage, setHasImage] = useState(true);
  const card = getCard(cardId);
  return (
    <div className={`menu-featured-card card-position-${position}`} aria-label={card.name}>
      {hasImage ? (
        <img src={card.image} alt={card.name} onError={() => setHasImage(false)} />
      ) : (
        <div className="menu-card-fallback"><LogoGlyph size={42} /><span>{card.name}</span></div>
      )}
    </div>
  );
}

function Complexity({ value }: { value: 1 | 2 | 3 }) {
  return (
    <span className="complexity-meter" aria-label={`Complexity ${value} of 3`}>
      {[1, 2, 3].map((step) => <i key={step} className={step <= value ? 'filled' : ''} />)}
    </span>
  );
}

export function MainMenu({ selectedDeckId, onSelectDeck, onStart, onOpenCampaign }: MainMenuProps) {
  const selectedDeck = getDeckPreset(selectedDeckId);
  const opponentDeck = getDeckPreset(getOpponentDeckId(selectedDeckId));
  const energyCounts = getDeckEnergyCounts(selectedDeck);
  const energyMix = Object.entries(energyCounts) as Array<[EnergyType, number]>;
  const dominantEnergy = [...energyMix].sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'photon';
  const accentStyle = { '--deck-accent': ENERGY_META[dominantEnergy].color } as CSSProperties;

  const handleDeckKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = DECK_PRESETS.length - 1;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % DECK_PRESETS.length;
    else nextIndex = (index - 1 + DECK_PRESETS.length) % DECK_PRESETS.length;
    const nextDeck = DECK_PRESETS[nextIndex];
    onSelectDeck(nextDeck.id);
    document.getElementById(`deck-tab-${nextDeck.id}`)?.focus();
  };

  return (
    <div className="menu-shell" style={accentStyle}>
      <a className="skip-link" href="#menu-content">Skip to deck selection</a>
      <div className="cosmos menu-cosmos" aria-hidden="true">
        <span className="nebula one" /><span className="nebula two" /><span className="grid-plane" />
        <span className="rift-ring ring-one" /><span className="rift-ring ring-two" />
      </div>

      <header className="menu-topbar">
        <div className="brand"><LogoGlyph size={38} /><div><span>HYPERVERSE</span><small>TRADING CARD GAME</small></div></div>
        <div className="menu-build"><span aria-hidden="true" /> ORIGIN + FOUR EMPERORS</div>
        <div className="menu-edition">BUILD <b>26.08</b></div>
      </header>

      <main className="menu-main" id="menu-content">
        <section className="menu-intro" aria-labelledby="menu-title">
          <div>
            <span className="menu-kicker">SOLO MATCH</span>
            <h1 id="menu-title">Choose your<br /><em>deck.</em></h1>
            <p>{DECK_PRESETS.length} ready-to-play decks. Pick one to see its cards and game plan.</p>
          </div>
          <div className="menu-mode-stack">
            <button className="campaign-mode-card glass" type="button" onClick={onOpenCampaign}>
              <span className="mode-reticle" aria-hidden="true"><i /></span>
              <div><small>CAMPAIGN</small><strong>Open boosters</strong><p>Spend Celestial Credits and build your collection.</p></div>
              <b aria-hidden="true">→</b>
            </button>
            <div className="mode-card glass">
              <span className="mode-reticle" aria-hidden="true"><i /></span>
              <div><small>QUICK PLAY</small><strong>Solo match</strong><p>Play a full 250 HP match against the computer.</p></div>
              <b>01</b>
            </div>
          </div>
        </section>

        <section className="deck-archive glass" aria-labelledby="archive-title">
          <header><div><span>DECK SELECT</span><h2 id="archive-title">Battle decks</h2></div><b>{DECK_PRESETS.length}<small> AVAILABLE</small></b></header>
          <div className="deck-tabs" role="tablist" aria-label="Battle decks" aria-orientation="vertical">
            {DECK_PRESETS.map((deck, index) => {
              const isSelected = deck.id === selectedDeckId;
              return (
                <button
                  id={`deck-tab-${deck.id}`}
                  key={deck.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="selected-deck-panel"
                  tabIndex={isSelected ? 0 : -1}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => onSelectDeck(deck.id)}
                  onKeyDown={(event) => handleDeckKeys(event, index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><strong>{deck.name}</strong><small>{deck.faction} · {deck.archetype}</small></div>
                  <i aria-hidden="true">›</i>
                </button>
              );
            })}
          </div>
        </section>

        <section className="deck-dossier" id="selected-deck-panel" role="tabpanel" aria-labelledby={`deck-tab-${selectedDeck.id}`}>
          <div className="dossier-status"><span><i aria-hidden="true" /> SELECTED DECK</span><b>60 / 60 <small>LEGAL</small></b></div>

          <div className="dossier-hero">
            <div className="menu-card-fan" aria-label="Featured cards">
              {selectedDeck.featuredCardIds.map((cardId, index) => <FeaturedCard key={cardId} cardId={cardId} position={index} />)}
            </div>
            <div className="dossier-title">
              <span>{selectedDeck.faction} · {selectedDeck.archetype}</span>
              <h2>{selectedDeck.name}</h2>
            </div>
          </div>

          <p className="deck-description">{selectedDeck.description}</p>

          <div className="deck-data-grid">
            <div><small>UNITS</small><strong>{getDeckCardCount(selectedDeck, 'unit')}</strong></div>
            <div><small>UTILITY</small><strong>{getDeckCardCount(selectedDeck, 'utility')}</strong></div>
            <div><small>ENERGY</small><strong>{getDeckCardCount(selectedDeck, 'energy')}</strong></div>
            <div><small>COMPLEXITY</small><Complexity value={selectedDeck.complexity} /></div>
          </div>

          <div className="energy-signature">
            <span>ENERGY TYPES</span>
            <div>{energyMix.map(([energy, count]) => <MakerEnergyOrb key={energy} energy={energy} count={count} size={31} />)}</div>
          </div>

          <div className="game-plan">
            <span>GAME PLAN</span>
            <ol>{selectedDeck.gamePlan.map((step) => <li key={step}>{step}</li>)}</ol>
          </div>

          <div className="launch-panel">
            <div><small>OPPONENT</small><strong>{opponentDeck.name}</strong><span>Computer-controlled deck</span></div>
            <button type="button" onClick={onStart}><span>START MATCH</span><small>Play solo</small><b aria-hidden="true">→</b></button>
          </div>
        </section>
      </main>

      <footer className="menu-footer"><span>60 CARD FORMAT</span><span>250 HP</span><span>ORIGIN + FOUR EMPERORS</span><b>HYPERVERSE TCG</b></footer>
    </div>
  );
}
