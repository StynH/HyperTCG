import { getCard } from '../data/catalog';
import type { CardInstance, UnitInPlay } from '../game/types';
import { Cost } from './EnergyOrb';

function cleanText(text: string) {
  return text.replace(/\*\*/g, '').replace(/\[(DR|PR)\]/g, '$1');
}

export function DetailPanel({ instance }: { instance: CardInstance | UnitInPlay | null }) {
  if (!instance) {
    return (
      <aside className="detail-panel glass empty-detail" aria-label="Card detail">
        <div className="detail-reticle" aria-hidden="true"><span /></div>
        <h2>Card telemetry</h2>
        <p>Hover or focus any visible card to inspect its full artwork, costs, stats, and printed text.</p>
      </aside>
    );
  }
  const card = getCard(instance.cardId);
  const unit = 'currentHp' in instance ? instance as UnitInPlay : null;
  return (
    <aside className="detail-panel glass" aria-label={`${card.name} card detail`}>
      <div className="detail-image-wrap">
        <img src={card.image} alt={`Full card: ${card.name}`} className="detail-image" />
        <span className={`rarity rarity-${card.rarity}`}>{card.rarity}</span>
      </div>
      <div className="detail-content">
        <span className="eyebrow">{card.type} · {card.subtitle}</span>
        <h2>{card.name}</h2>
        <div className="detail-meta">
          <Cost cost={card.cost} isGenericCostVariable={card.isGenericCostVariable} />
          {card.kind === 'unit' && <><span><small>HP</small>{unit ? `${Math.max(0, unit.currentHp)} / ${card.hp}` : card.hp}</span><span><small>DEF</small>{card.defense}</span></>}
        </div>
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
        {unit?.conditions.length ? <section className="rule-block"><h3>Conditions</h3><p>{unit.conditions.map(({ name, amount }) => `${name}${amount ? ` ${amount}` : ''}`).join(', ')}</p></section> : null}
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
