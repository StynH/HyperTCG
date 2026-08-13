import { getCard } from '../data/catalog';
import type { CardInstance } from '../game/types';
import { CardTile } from './CardTile';

export function Hand({ cards, selectedId, disabled, onHover, onSelect }: {
  cards: CardInstance[];
  selectedId?: string;
  disabled: boolean;
  onHover: (card: CardInstance) => void;
  onSelect: (card: CardInstance) => void;
}) {
  return (
    <section className="hand-zone" aria-labelledby="hand-title">
      <div className="hand-title"><span id="hand-title">Your hand</span><b>{cards.length}</b></div>
      <div className="hand-fan">
        {cards.map((card, index) => (
          <div className="hand-card" style={{ '--card-index': index, '--card-count': cards.length } as React.CSSProperties} key={card.instanceId}>
            <CardTile
              instance={card}
              isSelected={selectedId === card.instanceId}
              onHover={onHover}
              onClick={() => !disabled && onSelect(card)}
            />
            <span className={`kind-dot ${getCard(card.cardId).kind}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function OpponentHand({ count }: { count: number }) {
  return <div className="opponent-hand" aria-label={`Opponent has ${count} cards in hand`}>
    {Array.from({ length: Math.min(count, 8) }, (_, index) => <span className="card-back" style={{ '--back-index': index } as React.CSSProperties} key={index} />)}
    <b>{count}</b>
  </div>;
}
