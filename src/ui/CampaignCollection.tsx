import {
  useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent,
} from 'react';
import type { OwnedCampaignCard } from '../campaign/cardCondition';
import { getSgsLabelTier, getSgsSubgrades, type SgsLabelTier } from '../campaign/grading';
import {
  formatCelestialCredits, getGradingFeeCc, getMarketRarity, getOwnedCardValueCc,
  getRawPriceTreatmentLabels,
} from '../campaign/cardPricing';
import {
  BOOSTER_DEFINITIONS, type BoosterRarity, type BoosterSetId,
} from '../campaign/boosters';
import {
  gradeCampaignCard, HAS_UNLIMITED_CELESTIAL_CREDITS, saveCampaignProfile,
  wipeCampaignCollection, type CampaignProfile,
} from '../campaign/profile';
import { getCard } from '../data/catalog';
import type { CardDefinition } from '../game/types';
import { LogoGlyph } from './MakerGraphics';
import { CardDisplay } from './SetStamp';

interface CampaignCollectionProps {
  profile: CampaignProfile;
  onProfileChange: (profile: CampaignProfile) => void;
  onExit: () => void;
}

type GradingFilter = 'all' | 'ungraded' | 'graded';
type SetFilter = 'all' | BoosterSetId;
type RarityFilter = 'all' | BoosterRarity;
type CollectionSort = 'collector-number' | 'rarity' | 'value' | 'name' | 'newest';

interface CollectionEntry {
  ownedCard: OwnedCampaignCard;
  card: CardDefinition;
  setId: BoosterSetId;
  rarity: BoosterRarity;
  acquiredIndex: number;
  valueCc: number;
  gradingFeeCc: number;
}

const SET_IDS: readonly BoosterSetId[] = ['ORIG', 'FOUR'];
const RARITIES: readonly BoosterRarity[] = ['common', 'uncommon', 'rare', 'ultra', 'alternative'];
const RARITY_LABELS: Record<BoosterRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  ultra: 'Ultra Rare',
  alternative: 'Alternative',
};
const RARITY_ORDER: Record<BoosterRarity, number> = {
  alternative: 0,
  ultra: 1,
  rare: 2,
  uncommon: 3,
  common: 4,
};

function getBoosterSetId(card: CardDefinition): BoosterSetId {
  if (card.setId === 'ORIG' || card.setId === 'FOUR') return card.setId;
  throw new Error(`Campaign collection card ${card.id} has unsupported set ${card.setId}.`);
}

function getSetDefinition(setId: BoosterSetId) {
  return BOOSTER_DEFINITIONS.find((set) => set.id === setId)!;
}

function getSetName(setId: BoosterSetId): string {
  return getSetDefinition(setId).name;
}

function getSetShortName(setId: BoosterSetId): string {
  return getSetDefinition(setId).shortName;
}

function compareCollectorOrder(left: CollectionEntry, right: CollectionEntry): number {
  const setDifference = SET_IDS.indexOf(left.setId) - SET_IDS.indexOf(right.setId);
  return setDifference || left.card.number - right.card.number || right.acquiredIndex - left.acquiredIndex;
}

function compareCollectionEntries(left: CollectionEntry, right: CollectionEntry, sort: CollectionSort): number {
  if (sort === 'newest') return right.acquiredIndex - left.acquiredIndex;
  if (sort === 'name') return left.card.name.localeCompare(right.card.name) || compareCollectorOrder(left, right);
  if (sort === 'rarity') return RARITY_ORDER[left.rarity] - RARITY_ORDER[right.rarity] || compareCollectorOrder(left, right);
  if (sort === 'value') return right.valueCc - left.valueCc || compareCollectorOrder(left, right);
  return compareCollectorOrder(left, right);
}

function SgsMark() {
  return <span className="sgs-mark" aria-hidden="true"><b>SGS</b><small>GRADED</small></span>;
}

function getSgsGradeName(ownedCard: OwnedCampaignCard): string {
  const grade = ownedCard.grading!.grade;
  if (grade >= 9.9) return 'PRISTINE';
  if (grade >= 9.5) return 'GEM MINT';
  if (grade >= 9) return 'MINT';
  return 'NEAR MINT';
}

const SGS_LABEL_NAMES: Record<SgsLabelTier, string> = {
  diamond: 'DIAMOND',
  platinum: 'PLATINUM',
  'white-gold': 'WHITE GOLD',
  gold: 'GOLD',
  silver: 'SILVER',
  bronze: 'BRONZE',
};

const SGS_LABEL_PROOFS: Partial<Record<SgsLabelTier, string>> = {
  diamond: 'FOUR 10s',
  platinum: 'TRIPLE 10',
  'white-gold': 'PRISTINE',
};

function clearSlabTilt(slab: HTMLElement) {
  slab.style.removeProperty('--slab-rotate-x');
  slab.style.removeProperty('--slab-rotate-y');
  slab.style.removeProperty('--slab-light-x');
  slab.style.removeProperty('--slab-light-y');
}

function SgsSlab({ ownedCard }: { ownedCard: OwnedCampaignCard }) {
  const card = getCard(ownedCard.cardId);
  const grading = ownedCard.grading!;
  const labelTier = getSgsLabelTier(ownedCard);
  const rarity = getMarketRarity(card);
  const subgrades = getSgsSubgrades(ownedCard.condition);
  const labelProof = SGS_LABEL_PROOFS[labelTier];
  const slabRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const resetWhenPointerExits = (event: globalThis.PointerEvent) => {
      const slab = slabRef.current;
      if (!slab) return;
      const bounds = slab.getBoundingClientRect();
      const isInside = event.clientX >= bounds.left && event.clientX <= bounds.right
        && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!isInside) clearSlabTilt(slab);
    };
    window.addEventListener('pointermove', resetWhenPointerExits);
    return () => window.removeEventListener('pointermove', resetWhenPointerExits);
  }, []);

  const tiltSlab = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--slab-rotate-x', `${pointerY * -13}deg`);
    event.currentTarget.style.setProperty('--slab-rotate-y', `${pointerX * 17}deg`);
    event.currentTarget.style.setProperty('--slab-light-x', `${50 + pointerX * 72}%`);
    event.currentTarget.style.setProperty('--slab-light-y', `${50 + pointerY * 72}%`);
  };

  const resetSlabTilt = (event: ReactPointerEvent<HTMLElement>) => clearSlabTilt(event.currentTarget);

  return (
    <figure ref={slabRef} className="sgs-slab" data-tier={labelTier} aria-label={`${card.name}, SGS graded ${grading.grade}`} onPointerMove={tiltSlab} onPointerLeave={resetSlabTilt} onPointerCancel={resetSlabTilt}>
      <span className="slab-back" aria-hidden="true" />
      <span className="slab-edge slab-edge-left" aria-hidden="true" /><span className="slab-edge slab-edge-right" aria-hidden="true" />
      <span className="slab-edge slab-edge-top" aria-hidden="true" /><span className="slab-edge slab-edge-bottom" aria-hidden="true" />
      <span className="slab-screw screw-one" aria-hidden="true" /><span className="slab-screw screw-two" aria-hidden="true" />
      <span className="slab-screw screw-three" aria-hidden="true" /><span className="slab-screw screw-four" aria-hidden="true" />
      <div className="slab-label" data-tier={labelTier}>
        <i className="slab-label-security" aria-hidden="true" />
        <div className="slab-label-brand"><SgsMark /><span>{SGS_LABEL_NAMES[labelTier]}</span>{labelProof && <small className="slab-tier-proof">{labelProof}</small>}{ownedCard.stamped && <em>STAMPED</em>}</div>
        <div className="slab-identity">
          <div className="slab-identity-kicker">
            <small>{getSetName(getBoosterSetId(card))} · #{String(card.number).padStart(3, '0')}</small>
          </div>
          <strong>{card.name}</strong>
          <div className="slab-identity-meta">
            <span>HYPERVERSE TCG · {RARITY_LABELS[rarity]}</span>
            <b>CERT {grading.certificateNumber}</b>
          </div>
        </div>
        <dl className="slab-subgrades" aria-label="SGS subgrades">
          <div><dt>Centering</dt><dd>{subgrades.centering.toFixed(1)}</dd></div>
          <div><dt>Corners</dt><dd>{subgrades.corners.toFixed(1)}</dd></div>
          <div><dt>Edges</dt><dd>{subgrades.edges.toFixed(1)}</dd></div>
          <div><dt>Surface</dt><dd>{subgrades.surface.toFixed(1)}</dd></div>
        </dl>
        <div className="slab-grade"><small>SGS GRADE</small><strong>{grading.grade.toFixed(1)}</strong><span>{getSgsGradeName(ownedCard)}</span></div>
      </div>
      <div className="slab-card-well">
        <CardDisplay image={card.image} alt={card.name} setId={card.setId} isStamped={ownedCard.stamped} className="slab-card-display" />
        <i className="slab-reflection" aria-hidden="true" />
      </div>
      <i className="slab-prismatic" aria-hidden="true" />
      <figcaption><span>STYN'S GRADING SERVICE</span><b>SEALED · TAMPER EVIDENT</b></figcaption>
    </figure>
  );
}

function GradingReturn({
  ownedCard,
  isNewGrade,
  onDismiss,
}: {
  ownedCard: OwnedCampaignCard;
  isNewGrade: boolean;
  onDismiss: () => void;
}) {
  const [isInTransit, setIsInTransit] = useState(isNewGrade);
  const card = getCard(ownedCard.cardId);
  const marketValueCc = getOwnedCardValueCc(card, ownedCard);
  // The copy as it was before SGS sealed it, so the reveal can show what
  // grading bought rather than only where the card landed.
  const rawCard: OwnedCampaignCard = { ...ownedCard, grading: undefined };
  const feeCc = getGradingFeeCc(card, rawCard);
  const rawValueCc = getOwnedCardValueCc(card, rawCard);
  const netCc = marketValueCc - feeCc - rawValueCc;
  const gainMultiple = marketValueCc / Math.max(1, rawValueCc);

  useEffect(() => {
    if (!isInTransit) return undefined;
    const timer = window.setTimeout(() => setIsInTransit(false), 1_150);
    return () => window.clearTimeout(timer);
  }, [isInTransit]);

  if (isInTransit) {
    return (
      <main className="grading-return transit" aria-live="polite">
        <div className="grading-scan" aria-hidden="true"><span /><i /><LogoGlyph size={64} /></div>
        <div><span>SGS GRADING</span><h1>Grading<br />in progress.</h1><p>{card.name} is being graded and sealed.</p></div>
        <strong>STYN'S GRADING SERVICE</strong>
      </main>
    );
  }

  return (
    <main className="grading-return returned" aria-live="polite">
      <div className="slab-radiance" aria-hidden="true"><i /><i /><i /></div>
      <section className="slab-reveal-copy">
        <span>SGS GRADE</span>
        <h1>Grading<br />complete.</h1>
        <p>{card.name} received a grade of {ownedCard.grading!.grade.toFixed(1)} and is now valued at {formatCelestialCredits(marketValueCc)}.</p>
        <div><small>MARKET VALUE</small><strong>{marketValueCc.toLocaleString()}</strong><span>{ownedCard.grading!.certificateNumber}</span></div>
        <dl className="slab-payout" data-positive={netCc > 0}>
          <div><dt>WAS WORTH</dt><dd>{rawValueCc.toLocaleString()}</dd></div>
          <div className="payout-op"><dt>SGS FEE</dt><dd>&minus;{feeCc.toLocaleString()}</dd></div>
          <div className="payout-total"><dt>NET GAIN</dt><dd>{netCc > 0 ? '+' : ''}{netCc.toLocaleString()}</dd></div>
        </dl>
        <p className="slab-payout-verdict" data-positive={netCc > 0}>
          <b>{gainMultiple.toFixed(1)}&times;</b>
          <span>{netCc > 0 ? 'more valuable than this copy was raw' : 'this copy was worth more raw'}</span>
        </p>
      </section>
      <div className="slab-stage"><SgsSlab ownedCard={ownedCard} /><span className="slab-shadow" aria-hidden="true" /></div>
      <button className="slab-done" type="button" onClick={onDismiss}><span>BACK TO COLLECTION</span><small>Grade saved</small><b aria-hidden="true">→</b></button>
    </main>
  );
}

function CollectionCard({
  entry,
  credits,
  onGrade,
  onViewSlab,
}: {
  entry: CollectionEntry;
  credits: number;
  onGrade: (instanceId: string) => void;
  onViewSlab: (ownedCard: OwnedCampaignCard) => void;
}) {
  const { card, ownedCard, rarity, setId } = entry;
  const canAfford = HAS_UNLIMITED_CELESTIAL_CREDITS || credits >= entry.gradingFeeCc;
  const treatmentLabels = getRawPriceTreatmentLabels(card, ownedCard.stamped);
  const rawDescription = treatmentLabels.length > 0
    ? `${treatmentLabels.join(' · ')} · Raw · eligible for SGS`
    : 'Raw · eligible for SGS';
  const valueLabel = ownedCard.grading
    ? 'GRADED VALUE'
    : ownedCard.stamped ? 'STAMPED RAW VALUE' : 'RAW VALUE';
  return (
    <article className={`collection-card ${ownedCard.grading ? 'graded' : 'raw'}`}>
      <div className="collection-card-art">
        <div className="collection-card-tags"><span>{setId}</span><span data-rarity={rarity}>{RARITY_LABELS[rarity]}</span></div>
        <CardDisplay image={card.image} alt={card.name} setId={setId} isStamped={ownedCard.stamped} loading="lazy" className="collection-card-display" />
        {ownedCard.grading && <span className="collection-grade-badge"><SgsMark /><b>{ownedCard.grading.grade.toFixed(1)}</b></span>}
      </div>
      <div className="collection-card-copy">
        <div className="collection-card-index"><span>{getSetShortName(setId)}</span><b>#{String(card.number).padStart(3, '0')}</b></div>
        <h2>{card.name}</h2>
        <p><strong>{RARITY_LABELS[rarity]}</strong> · {ownedCard.grading ? `${treatmentLabels.length > 0 ? `${treatmentLabels.join(' · ')} · ` : ''}SGS ${ownedCard.grading.grade.toFixed(1)} · ${ownedCard.grading.certificateNumber}` : rawDescription}</p>
        <div className="collection-market-value" aria-label={`Market value ${formatCelestialCredits(entry.valueCc)}`}>
          <span>{valueLabel}</span><strong>{formatCelestialCredits(entry.valueCc)}</strong>
        </div>
        {ownedCard.grading ? (
          <button type="button" onClick={() => onViewSlab(ownedCard)}>VIEW SGS SLAB <span aria-hidden="true">↗</span></button>
        ) : (
          <button type="button" disabled={!canAfford} onClick={() => onGrade(ownedCard.instanceId)}>
            {canAfford ? <>SEND TO SGS · {formatCelestialCredits(entry.gradingFeeCc)} <span aria-hidden="true">→</span></> : `NEED ${formatCelestialCredits(entry.gradingFeeCc - credits)} MORE`}
          </button>
        )}
      </div>
    </article>
  );
}

function WipeCollectionDialog({
  cardCount,
  onCancel,
  onConfirm,
}: {
  cardCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog ref={dialogRef} className="wipe-collection-dialog" aria-labelledby="wipe-collection-title" aria-describedby="wipe-collection-description" onCancel={onCancel}>
      <span>IRREVERSIBLE ACTION</span>
      <h2 id="wipe-collection-title">Wipe collection?</h2>
      <p id="wipe-collection-description">This permanently deletes all {cardCount} cards, including SGS-graded slabs. Your Celestial Credits and lifetime booster count will stay.</p>
      <div>
        <button type="button" onClick={onCancel}>KEEP COLLECTION</button>
        <button className="confirm-wipe" type="button" onClick={onConfirm}>WIPE {cardCount} CARDS</button>
      </div>
    </dialog>
  );
}

export function CampaignCollection({ profile, onProfileChange, onExit }: CampaignCollectionProps) {
  const [gradingFilter, setGradingFilter] = useState<GradingFilter>('all');
  const [setFilter, setSetFilter] = useState<SetFilter>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [sort, setSort] = useState<CollectionSort>('collector-number');
  const [searchQuery, setSearchQuery] = useState('');
  const [slabView, setSlabView] = useState<{ card: OwnedCampaignCard; isNewGrade: boolean } | null>(null);
  const [isWipeConfirmationOpen, setIsWipeConfirmationOpen] = useState(false);
  const entries = useMemo(() => profile.ownedCards.map((ownedCard, acquiredIndex): CollectionEntry => {
    const card = getCard(ownedCard.cardId);
    return {
      ownedCard,
      card,
      setId: getBoosterSetId(card),
      rarity: getMarketRarity(card),
      acquiredIndex,
      valueCc: getOwnedCardValueCc(card, ownedCard),
      gradingFeeCc: getGradingFeeCc(card, ownedCard),
    };
  }), [profile.ownedCards]);
  const gradedCount = entries.filter((entry) => entry.ownedCard.grading).length;
  const collectionValueCc = entries.reduce((total, entry) => total + entry.valueCc, 0);
  const setCounts = Object.fromEntries(SET_IDS.map((setId) => [
    setId,
    entries.filter((entry) => entry.setId === setId).length,
  ])) as Record<BoosterSetId, number>;
  const visibleEntries = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
    return entries.filter((entry) => {
      const matchesGrading = gradingFilter === 'all'
        || (gradingFilter === 'graded' ? !!entry.ownedCard.grading : !entry.ownedCard.grading);
      const matchesSet = setFilter === 'all' || entry.setId === setFilter;
      const matchesRarity = rarityFilter === 'all' || entry.rarity === rarityFilter;
      const searchableCardText = `${entry.card.name} ${entry.card.subtitle} ${entry.card.type} ${entry.setId} ${entry.card.number}`.toLocaleLowerCase();
      return matchesGrading && matchesSet && matchesRarity && searchableCardText.includes(normalizedSearch);
    }).sort((left, right) => compareCollectionEntries(left, right, sort));
  }, [entries, gradingFilter, rarityFilter, searchQuery, setFilter, sort]);
  const hasActiveFilters = gradingFilter !== 'all' || setFilter !== 'all' || rarityFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setGradingFilter('all');
    setSetFilter('all');
    setRarityFilter('all');
    setSearchQuery('');
  };

  const sendToSgs = (instanceId: string) => {
    const nextProfile = gradeCampaignCard(profile, instanceId);
    const gradedCard = nextProfile.ownedCards.find((card) => card.instanceId === instanceId)!;
    saveCampaignProfile(nextProfile);
    onProfileChange(nextProfile);
    setSlabView({ card: gradedCard, isNewGrade: true });
  };

  const wipeCollection = () => {
    const nextProfile = wipeCampaignCollection(profile);
    saveCampaignProfile(nextProfile);
    onProfileChange(nextProfile);
    clearFilters();
    setIsWipeConfirmationOpen(false);
  };

  if (slabView) return <GradingReturn ownedCard={slabView.card} isNewGrade={slabView.isNewGrade} onDismiss={() => setSlabView(null)} />;

  return (
    <div className="collection-shell">
      <a className="skip-link" href="#collection-content">Skip to collection</a>
      <div className="collection-cosmos" aria-hidden="true"><span /><span /><i /></div>
      <header className="campaign-topbar collection-topbar">
        <button className="campaign-back" type="button" onClick={onExit} aria-label="Return to booster shop">← <span>BOOSTERS</span></button>
        <div className="brand"><LogoGlyph size={36} /><div><span>HYPERVERSE</span><small>COLLECTION</small></div></div>
        <div className="sgs-partner"><SgsMark /><span>CARD<br />GRADING</span></div>
      </header>
      <main className="collection-main" id="collection-content">
        <header className="collection-heading">
          <div><span>YOUR CARDS</span><h1>Card <em>collection.</em></h1><p>Browse by set, rarity, and grading status. Duplicate copies are listed separately.</p></div>
          <dl>
            <div><dt>ALL CARDS</dt><dd>{entries.length}</dd></div>
            <div><dt>ORIGIN</dt><dd>{setCounts.ORIG}</dd></div>
            <div><dt>FOUR EMPERORS</dt><dd>{setCounts.FOUR}</dd></div>
            <div><dt>SGS GRADED</dt><dd>{gradedCount}</dd></div>
            <div className="collection-value-total"><dt>MARKET VALUE</dt><dd>{formatCelestialCredits(collectionValueCc)}</dd></div>
          </dl>
        </header>

        <section className="collection-archive" aria-labelledby="collection-title">
          <header className="collection-archive-header"><div><span>COLLECTION</span><h2 id="collection-title">All cards</h2></div><div className="collection-results"><strong aria-live="polite">{visibleEntries.length} / {entries.length} CARDS</strong>{hasActiveFilters && <button className="collection-clear" type="button" onClick={clearFilters}>CLEAR FILTERS ×</button>}<button className="collection-wipe" type="button" disabled={entries.length === 0} onClick={() => setIsWipeConfirmationOpen(true)}>WIPE COLLECTION</button></div></header>

          <div className="collection-controls">
            <label className="collection-search"><span>SEARCH COLLECTION</span><div><i aria-hidden="true">⌕</i><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Name, type, set, number…" /></div></label>
            <label className="collection-sort"><span>SORT BY</span><select value={sort} onChange={(event) => setSort(event.target.value as CollectionSort)}><option value="collector-number">Set & collector number</option><option value="rarity">Rarity: premium first</option><option value="value">Market value: high to low</option><option value="name">Card name: A–Z</option><option value="newest">Newest acquired</option></select></label>
          </div>

          <div className="collection-filter-deck">
            <div className="collection-filter-row"><span>SET</span><div className="collection-filters set-filters" role="group" aria-label="Filter by set"><button type="button" className={setFilter === 'all' ? 'selected' : ''} aria-pressed={setFilter === 'all'} onClick={() => setSetFilter('all')}>All sets</button>{SET_IDS.map((setId) => <button key={setId} type="button" className={setFilter === setId ? 'selected' : ''} aria-pressed={setFilter === setId} onClick={() => setSetFilter(setId)}><b>{setId}</b><small>{getSetShortName(setId)}</small></button>)}</div></div>
            <div className="collection-filter-row"><span>RARITY</span><div className="collection-filters rarity-filters" role="group" aria-label="Filter by rarity"><button type="button" className={rarityFilter === 'all' ? 'selected' : ''} aria-pressed={rarityFilter === 'all'} onClick={() => setRarityFilter('all')}>All</button>{RARITIES.map((rarity) => <button key={rarity} type="button" data-rarity={rarity} className={rarityFilter === rarity ? 'selected' : ''} aria-pressed={rarityFilter === rarity} onClick={() => setRarityFilter(rarity)}>{RARITY_LABELS[rarity]}</button>)}</div></div>
            <div className="collection-filter-row status-filter-row"><span>STATUS</span><div className="collection-filters" role="group" aria-label="Filter by grading status">{(['all', 'ungraded', 'graded'] as const).map((value) => <button key={value} type="button" className={gradingFilter === value ? 'selected' : ''} aria-pressed={gradingFilter === value} onClick={() => setGradingFilter(value)}>{value === 'all' ? 'Any status' : value}</button>)}</div></div>
          </div>

          {visibleEntries.length > 0 ? (
            <div className="collection-grid">{visibleEntries.map((entry) => <CollectionCard key={entry.ownedCard.instanceId} entry={entry} credits={profile.celestialCredits} onGrade={sendToSgs} onViewSlab={(card) => setSlabView({ card, isNewGrade: false })} />)}</div>
          ) : (
            <div className="collection-empty"><LogoGlyph size={52} /><h2>No matching cards</h2><p>{entries.length === 0 ? 'Open a booster to start your collection.' : 'Try another set, rarity, status, or search.'}</p>{entries.length > 0 && <button type="button" onClick={clearFilters}>CLEAR FILTERS</button>}</div>
          )}
        </section>
      </main>
      {isWipeConfirmationOpen && <WipeCollectionDialog cardCount={entries.length} onCancel={() => setIsWipeConfirmationOpen(false)} onConfirm={wipeCollection} />}
    </div>
  );
}
