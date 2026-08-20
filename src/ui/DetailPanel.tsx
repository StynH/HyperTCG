import { getCard } from '../data/catalog';
import type { ConditionName } from '../game/effectTypes';
import type { CardModifierInfo } from '../game/effectRuntime';
import type { CardInstance, UnitInPlay } from '../game/types';
import alternativeTreatmentIcon from '../assets/card-treatments/alternative.png';
import superTreatmentIcon from '../assets/card-treatments/super.png';
import { durationLabel, presentModifier, signed } from './cardModifiers';
import { Cost } from './EnergyOrb';

function cleanText(text: string) {
  return text.replace(/\*\*/g, '').replace(/\[(DR|PR)\]/g, '$1');
}

const CONDITION_DETAILS: Record<ConditionName, (amount?: number, turns?: number) => string> = {
  paralyzed: (_amount, turns = 0) => `Cannot Attack or Rotate · ${Math.max(0, 2 - turns)} controller turn${2 - turns === 1 ? '' : 's'} remaining`,
  cowering: () => 'Cannot Attack · coin flip to recover at turn end',
  weakened: () => 'Cannot roll for a Critical Hit',
  infected: (amount = 0) => `Takes ${amount} Effect Damage at the start of its controller’s turn`,
  doomed: () => 'Vanquished at the start of its controller’s next turn',
  cursed: () => 'Another allied Unit takes 20 Effect Damage at turn end',
  tranquil: () => 'Negates and removes the next non-Tranquil Condition',
};

function conditionLabel(name: ConditionName, amount?: number) {
  const title = name.charAt(0).toUpperCase() + name.slice(1);
  return amount === undefined ? title : `${title} ${amount}`;
}

function CardTreatmentBadge({ treatment }: { treatment: 'super' | 'alternative' }) {
  const isSuper = treatment === 'super';

  return (
    <span
      className={`card-treatment-badge treatment-${treatment}`}
      role="img"
      aria-label={isSuper ? 'SUPER Unit' : 'Alternative Unit'}
    >
      <img
        src={isSuper ? superTreatmentIcon : alternativeTreatmentIcon}
        alt=""
        aria-hidden="true"
      />
    </span>
  );
}

export function DetailPanel({ instance, modifiers = [] }: { instance: CardInstance | UnitInPlay | null; modifiers?: readonly CardModifierInfo[] }) {
  if (!instance) {
    return (
      <aside className="detail-panel glass empty-detail" aria-label="Card detail">
        <div className="detail-reticle" aria-hidden="true"><span /></div>
        <h2>Card details</h2>
        <p>Hover or focus any visible card to inspect its full artwork, costs, stats, and printed text.</p>
      </aside>
    );
  }
  const card = getCard(instance.cardId);
  const unit = 'currentHp' in instance ? instance as UnitInPlay : null;
  const maxHpMod = modifiers.reduce((sum, mod) => mod.kind === 'max-hp' ? sum + (mod.amount ?? 0) : sum, 0);
  const defenseMod = modifiers.reduce((sum, mod) => mod.kind === 'defense' ? sum + (mod.amount ?? 0) : sum, 0);
  const effectiveMaxHp = card.hp + maxHpMod;
  const effectiveDef = card.defense + defenseMod;
  const statClass = (delta: number) => delta === 0 ? '' : delta > 0 ? 'stat-buffed' : 'stat-debuffed';
  return (
    <aside className="detail-panel glass" aria-label={`${card.name} card detail`}>
      <div className="detail-image-wrap">
        <img src={card.image} alt={`Full card: ${card.name}`} className="detail-image" />
      </div>
      <div className="detail-content">
        <span className="eyebrow">{card.type} · {card.subtitle}</span>
        <h2>{card.name}</h2>
        <div className="detail-badges" aria-label="Card classifications">
          {card.unitTreatment && card.unitTreatment !== 'standard' && (
            <CardTreatmentBadge treatment={card.unitTreatment} />
          )}
          <span className={`rarity rarity-${card.rarity}`}>{card.rarity}</span>
        </div>
        <div className="detail-meta">
          <Cost cost={card.cost} isGenericCostVariable={card.isGenericCostVariable} />
          {card.kind === 'unit' && <>
            <span className={statClass(maxHpMod)}><small>HP</small>{unit ? `${Math.max(0, unit.currentHp)} / ${effectiveMaxHp}` : effectiveMaxHp}</span>
            <span className={statClass(defenseMod)}><small>DEF</small>{effectiveDef}{defenseMod === 0 ? '' : ` (${signed(defenseMod)})`}</span>
          </>}
        </div>
        {modifiers.length > 0 && (
          <section className="active-modifiers" aria-labelledby="active-modifiers-title">
            <h3 id="active-modifiers-title">Active Effects</h3>
            <div>
              {modifiers.map((mod) => {
                const { label, polarity } = presentModifier(mod);
                return (
                  <article className={`modifier-readout polarity-${polarity}`} key={mod.id}>
                    <strong>{label}</strong>
                    <span>{mod.sourceName} · {durationLabel(mod)}</span>
                  </article>
                );
              })}
            </div>
          </section>
        )}
        {unit?.conditions.length ? (
          <section className="status-conditions" aria-labelledby="status-conditions-title">
            <h3 id="status-conditions-title">Status Conditions</h3>
            <div>
              {unit.conditions.map(({ name, amount, controllerTurns }) => (
                <article className={`condition-readout condition-${name}`} key={name}>
                  <strong>{conditionLabel(name, amount)}</strong>
                  <span>{CONDITION_DETAILS[name](amount, controllerTurns)}</span>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        {card.abilities.map((ability) => (
          <section className="rule-block" key={ability.id}><h3>{ability.name}</h3><p>{cleanText(ability.text)}</p></section>
        ))}
        {card.attacks.map((attack) => (
          <section className="rule-block attack-rule" key={attack.id}>
            <div><h3>{attack.name}</h3><Cost cost={attack.cost} isGenericCostVariable={attack.isGenericCostVariable} /></div>
            <b>{attack.damage}</b>
            {attack.effect && <p>{cleanText(attack.effect)}</p>}
          </section>
        ))}
        {card.utilityAttack?.name && (
          <section className="rule-block attack-rule">
            <div><h3>{card.utilityAttack.name}</h3><Cost cost={card.utilityAttack.cost} isGenericCostVariable={card.utilityAttack.isGenericCostVariable} /></div>
            <b>{card.utilityAttack.damage}</b>
            {card.utilityAttack.effect && <p>{cleanText(card.utilityAttack.effect)}</p>}
          </section>
        )}
        {card.kind === 'utility' && (
          <section className="rule-block"><h3>{card.utilityType} effect</h3><p>{cleanText(card.utilityEffect || card.utilityCondition)}</p></section>
        )}
        {card.kind === 'energy' && <section className="rule-block"><p>{card.utilityEffect}</p></section>}
        {card.flavor && <p className="flavor">“{card.flavor}”</p>}
        <footer><span>{card.setId} · {String(card.number).padStart(3, '0')}/{card.total}</span><span>{card.kind}</span></footer>
      </div>
    </aside>
  );
}
