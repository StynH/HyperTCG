import { useMemo, useState, type CSSProperties } from 'react';
import {
  BOOSTER_DEFINITIONS, openBooster, type BoosterCard, type BoosterDefinition, type OpenedBooster,
} from '../campaign/boosters';
import {
  canPurchaseBooster, HAS_UNLIMITED_CELESTIAL_CREDITS, loadCampaignProfile,
  purchaseBooster, saveCampaignProfile, type CampaignProfile,
} from '../campaign/profile';
import { LogoGlyph } from './MakerGraphics';
import { CampaignCollection } from './CampaignCollection';

interface CampaignModeProps {
  onExit: () => void;
}

function campaignStats(profile: CampaignProfile) {
  return {
    totalCards: Object.values(profile.collection).reduce((total, count) => total + count, 0),
    uniqueCards: Object.keys(profile.collection).length,
  };
}

function CreditMark() {
  return <span className="credit-mark" aria-hidden="true">CC</span>;
}

function PackArt({ booster, isCompact = false }: { booster: BoosterDefinition; isCompact?: boolean }) {
  const style = {
    '--pack-accent': booster.accent,
    '--pack-accent-soft': booster.accentSoft,
  } as CSSProperties;
  return (
    <div className={`foil-pack ${isCompact ? 'compact' : ''} set-${booster.id.toLowerCase()}`} style={style} aria-hidden="true">
      <span className="pack-crimp top" />
      <div className="pack-brand"><LogoGlyph size={isCompact ? 24 : 34} /><span>HYPERVERSE</span></div>
      <div className="pack-sigil"><i /><b>{booster.id === 'ORIG' ? 'O' : 'IV'}</b><i /></div>
      <strong>{booster.shortName}</strong>
      <small>{booster.id} · 10 CARDS</small>
      <span className="pack-crimp bottom" />
    </div>
  );
}

function BoosterProduct({
  booster,
  credits,
  onPurchase,
}: {
  booster: BoosterDefinition;
  credits: number;
  onPurchase: (booster: BoosterDefinition) => void;
}) {
  const canAfford = HAS_UNLIMITED_CELESTIAL_CREDITS || credits >= booster.price;
  const style = {
    '--pack-accent': booster.accent,
    '--pack-accent-soft': booster.accentSoft,
  } as CSSProperties;
  return (
    <article className={`booster-product set-${booster.id.toLowerCase()}`} style={style}>
      <div className="product-art"><span className="pack-aura" aria-hidden="true" /><PackArt booster={booster} isCompact /></div>
      <div className="product-copy">
        <span>{booster.id} SET</span>
        <h2>{booster.name}</h2>
        <p>{booster.description}</p>
        <dl>
          <div><dt>COMMON</dt><dd>6</dd></div>
          <div><dt>UNCOMMON</dt><dd>3</dd></div>
          <div><dt>PREMIUM</dt><dd>1</dd></div>
        </dl>
        <button type="button" disabled={!canAfford} onClick={() => onPurchase(booster)}>
          <span>{canAfford ? 'BUY BOOSTER' : `NEED ${booster.price - credits} MORE CC`}</span>
          <b><CreditMark /> {booster.price}</b>
        </button>
      </div>
    </article>
  );
}

function rarityLabel(rarity: BoosterCard['rarity']): string {
  if (rarity === 'alternative') return 'Alternative';
  if (rarity === 'ultra') return 'Ultra Rare';
  return rarity[0].toUpperCase() + rarity.slice(1);
}

function CurrentCard({
  reward,
  index,
  isFaceUp,
  onActivate,
}: {
  reward: BoosterCard;
  index: number;
  isFaceUp: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      className={`opening-card rarity-${reward.rarity} ${isFaceUp ? 'face-up' : ''} ${index === 9 ? 'premium-card' : ''}`}
      type="button"
      onClick={onActivate}
      aria-label={isFaceUp
        ? `${reward.card.name}, ${rarityLabel(reward.rarity)}. ${index === 9 ? 'Finish opening' : 'Continue to the next card'}`
        : `Flip card ${index + 1} of 10`}
    >
      <span className="opening-card-inner">
        <span className="opening-card-back">
          <i className="card-back-orbit" aria-hidden="true" />
          <LogoGlyph size={72} />
          <strong>{index === 9 ? 'PREMIUM CARD' : 'HYPERVERSE'}</strong>
          <small>{index === 9 ? 'RARITY HIDDEN' : `CARD ${String(index + 1).padStart(2, '0')} OF 10`}</small>
        </span>
        <span className="opening-card-front">
          <img src={reward.card.image} alt="" />
          <i className="card-foil-sweep" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

function HaulFan({ cards }: { cards: OpenedBooster['cards'] }) {
  return (
    <div className="haul-fan" aria-label="All 10 cards from this booster">
      {cards.map((reward, index) => {
        const distanceFromCenter = Math.abs(index - 4.5);
        const style = {
          '--fan-x': `${(index - 4.5) * 62}px`,
          '--fan-y': `${distanceFromCenter * 9}px`,
          '--fan-rotation': `${(index - 4.5) * 3.4}deg`,
          '--fan-order': index + 1,
        } as CSSProperties;
        return <img key={`${reward.card.id}-${index}`} src={reward.card.image} alt={`${reward.card.name}, ${rarityLabel(reward.rarity)}`} style={style} />;
      })}
    </div>
  );
}

function OpeningChamber({
  booster,
  openedBooster,
  onDone,
}: {
  booster: BoosterDefinition;
  openedBooster: OpenedBooster;
  onDone: () => void;
}) {
  const [hasTornSeal, setHasTornSeal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFaceUp, setIsFaceUp] = useState(false);
  const isComplete = currentIndex === openedBooster.cards.length;
  const currentReward = openedBooster.cards[Math.min(currentIndex, openedBooster.cards.length - 1)];
  const style = {
    '--pack-accent': booster.accent,
    '--pack-accent-soft': booster.accentSoft,
  } as CSSProperties;

  if (!hasTornSeal) {
    return (
      <main className="opening-chamber sealed" id="campaign-content" style={style}>
        <div className="opening-radiance" aria-hidden="true"><i /><i /><i /></div>
        <div className="sealed-copy"><span>BOOSTER PURCHASED</span><h1>Ready to<br />open.</h1><p>Open the pack to add all 10 cards to your collection.</p></div>
        <div className="sealed-pack"><PackArt booster={booster} /><span className="pack-shadow" /></div>
        <button className="tear-seal" type="button" onClick={() => setHasTornSeal(true)}><span>OPEN BOOSTER</span><small>{booster.name}</small><b aria-hidden="true">↗</b></button>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="opening-chamber haul-complete" id="campaign-content" style={style}>
        <div className="completion-burst" aria-hidden="true"><i /><i /><i /></div>
        <div className="completion-copy"><span>ALL 10 CARDS ADDED</span><h1>Booster<br />opened.</h1><p>The cards are now in your collection.</p></div>
        <HaulFan cards={openedBooster.cards} />
        <div className={`premium-summary rarity-${openedBooster.premiumRarity}`}>
          <span>PREMIUM CARD · {rarityLabel(openedBooster.premiumRarity)}</span>
          <strong>{openedBooster.cards[9].card.name}</strong>
        </div>
        <button className="return-vault" type="button" onClick={onDone}>BACK TO BOOSTERS <span aria-hidden="true">→</span></button>
      </main>
    );
  }

  const secureCard = () => {
    if (!isFaceUp) return;
    setCurrentIndex((index) => Math.min(index + 1, openedBooster.cards.length));
    setIsFaceUp(false);
  };

  return (
    <main className={`opening-chamber ritual rarity-${currentReward.rarity} ${isFaceUp ? 'showing-result' : 'awaiting-flip'} ${currentIndex === 9 ? 'premium-turn' : ''}`} id="campaign-content" style={style}>
      <header className="ritual-heading">
        <div><span>{booster.name} · CARD {currentIndex + 1} OF 10</span><h1>{currentIndex === 9 && !isFaceUp ? 'Premium card.' : isFaceUp ? currentReward.card.name : 'Flip the next card.'}</h1></div>
        <div className="ritual-counter"><strong>{String(currentIndex + 1).padStart(2, '0')}</strong><span>/ 10</span></div>
      </header>

      <section className="ritual-stage" aria-label={`Opening card ${currentIndex + 1} of 10`}>
        <div className="opened-pack-source" aria-hidden="true"><PackArt booster={booster} isCompact /><span>OPENED PACK</span></div>
        <div className="secured-cards" aria-label={`${currentIndex} cards revealed`}>
          <span>REVEALED</span>
          <div>
            {openedBooster.cards.slice(0, currentIndex).map((reward, index) => (
              <img key={`${reward.card.id}-${index}`} src={reward.card.image} alt="" style={{ '--secured-index': index } as CSSProperties} />
            ))}
          </div>
          <strong>{currentIndex}<small> / 10</small></strong>
        </div>

        <div className="card-altar">
          <span className="altar-ring" aria-hidden="true"><i /><i /><i /></span>
          <CurrentCard
            reward={currentReward}
            index={currentIndex}
            isFaceUp={isFaceUp}
            onActivate={() => isFaceUp ? secureCard() : setIsFaceUp(true)}
          />
          <span className={`flip-instruction ${isFaceUp ? 'continue' : ''}`}>
            {isFaceUp ? (currentIndex === 9 ? 'CLICK CARD TO FINISH' : 'CLICK CARD FOR NEXT') : 'CLICK CARD TO REVEAL'} <kbd>↵</kbd>
          </span>
        </div>

        <aside className={`card-discovery ${isFaceUp ? 'visible' : ''}`} aria-live="polite">
          {isFaceUp ? (
            <>
              <span>{rarityLabel(currentReward.rarity)} · {booster.id}</span>
              <h2>{currentReward.card.name}</h2>
              <p>{currentReward.card.subtitle || currentReward.card.type || 'Hyperverse card'}</p>
              <dl><div><dt>SET</dt><dd>{booster.id}</dd></div><div><dt>NUMBER</dt><dd>{String(currentReward.card.number).padStart(3, '0')}</dd></div><div><dt>RARITY</dt><dd>{rarityLabel(currentReward.rarity)}</dd></div></dl>
              <div className="discovery-control-hint"><span>NEXT STEP</span><strong>Click the center card again</strong></div>
            </>
          ) : (
            <><span>FACE DOWN</span><h2>Card hidden</h2><p>Click the center card to reveal it.</p><div className="decoder-lines" aria-hidden="true"><i /><i /><i /><i /></div></>
          )}
        </aside>
      </section>

      <footer className="ritual-progress" aria-label={`${currentIndex} of 10 cards revealed`}>
        <span>CARDS IN THIS BOOSTER</span>
        <ol>{openedBooster.cards.map((reward, index) => <li key={index} className={`${index < currentIndex ? 'secured' : ''} ${index === currentIndex ? 'current' : ''} rarity-${reward.rarity}`}><span>{String(index + 1).padStart(2, '0')}</span></li>)}</ol>
        <b>{currentIndex === 9 ? 'PREMIUM CARD' : `${10 - currentIndex} CARDS LEFT`}</b>
      </footer>
    </main>
  );
}

export function CampaignMode({ onExit }: CampaignModeProps) {
  const [profile, setProfile] = useState(loadCampaignProfile);
  const [activeBooster, setActiveBooster] = useState<BoosterDefinition | null>(null);
  const [openedBooster, setOpenedBooster] = useState<OpenedBooster | null>(null);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const stats = useMemo(() => campaignStats(profile), [profile]);

  const buyBooster = (booster: BoosterDefinition) => {
    if (!canPurchaseBooster(profile, booster.price)) return;
    const opened = openBooster(booster.id);
    const nextProfile = purchaseBooster(profile, opened, booster.price);
    saveCampaignProfile(nextProfile);
    setProfile(nextProfile);
    setActiveBooster(booster);
    setOpenedBooster(opened);
  };

  if (activeBooster && openedBooster) {
    return (
      <div className="campaign-shell opening-shell">
        <a className="skip-link" href="#campaign-content">Skip to booster opening</a>
        <OpeningChamber booster={activeBooster} openedBooster={openedBooster} onDone={() => { setActiveBooster(null); setOpenedBooster(null); }} />
      </div>
    );
  }

  if (isCollectionOpen) {
    return <CampaignCollection profile={profile} onProfileChange={setProfile} onExit={() => setIsCollectionOpen(false)} />;
  }

  return (
    <div className="campaign-shell">
      <a className="skip-link" href="#campaign-content">Skip to booster shop</a>
      <div className="campaign-cosmos" aria-hidden="true"><span className="vault-orbit one" /><span className="vault-orbit two" /><span className="vault-stars" /></div>
      <header className="campaign-topbar">
        <button className="campaign-back" type="button" onClick={onExit} aria-label="Return to main menu">← <span>MAIN MENU</span></button>
        <div className="brand"><LogoGlyph size={36} /><div><span>HYPERVERSE</span><small>CAMPAIGN</small></div></div>
        <div className="credit-balance" aria-label={HAS_UNLIMITED_CELESTIAL_CREDITS ? 'Unlimited Celestial Credits' : `${profile.celestialCredits} Celestial Credits`}><div><small>CELESTIAL CREDITS</small><strong>{HAS_UNLIMITED_CELESTIAL_CREDITS ? '∞' : profile.celestialCredits.toLocaleString()}</strong></div><CreditMark /></div>
      </header>

      <main className="campaign-main" id="campaign-content">
        <section className="vault-heading">
          <div><span className="campaign-kicker">BOOSTER SHOP</span><h1>Card<br /><em>packs.</em></h1></div>
          <p>Buy a booster to add ten cards to your collection.</p>
          <div className="collection-readout glass">
            <div><small>COLLECTION</small><strong>{stats.totalCards}</strong><span>total cards</span></div>
            <div><small>UNIQUE</small><strong>{stats.uniqueCards}</strong><span>unique cards</span></div>
            <div><small>OPENED</small><strong>{profile.packsOpened}</strong><span>boosters</span></div>
          </div>
          <button className="collection-entry" type="button" onClick={() => setIsCollectionOpen(true)}><span>OPEN COLLECTION</span><small>View cards · Send to SGS</small><b aria-hidden="true">→</b></button>
        </section>

        <section className="booster-shelf" aria-labelledby="available-boosters-title">
          <header><div><span>AVAILABLE SETS</span><h2 id="available-boosters-title">Available boosters</h2></div><b>02 <small>SETS</small></b></header>
          <div className="booster-products">
            {BOOSTER_DEFINITIONS.map((booster) => <BoosterProduct key={booster.id} booster={booster} credits={profile.celestialCredits} onPurchase={buyBooster} />)}
          </div>
          <footer className="odds-strip">
            <span>PREMIUM CARD ODDS</span>
            <div><b>84%</b> Rare</div><div><b>15.83%</b> Ultra Rare</div><div><b>0.17%</b> Alternative</div>
          </footer>
        </section>
      </main>
      <footer className="campaign-footer"><span>SAVED LOCALLY</span><b>YOUR COLLECTION IS STORED ON THIS DEVICE</b></footer>
    </div>
  );
}
