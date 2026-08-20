import type { PlayerState } from '../game/types';

export function PlayerBanner({ player, active, opponent }: { player: PlayerState; active: boolean; opponent?: boolean }) {
  return (
    <section className={`player-banner glass ${active ? 'active' : ''}`} aria-label={`${player.name} status`}>
      <div className={`avatar ${opponent ? 'opponent' : ''}`} aria-hidden="true">{opponent ? 'RA' : 'HV'}</div>
      <div className="player-identity">
        <span className="eyebrow">{opponent ? 'Computer opponent' : 'Player'}</span>
        <strong>{player.name}</strong>
      </div>
      <div className="player-stat hp"><span>HP</span><b>{player.hp}</b></div>
      <div className="player-stat"><span>Deck</span><b>{player.deck.length}</b></div>
      <div className="player-stat vanquished-stat"><span>Vanquished</span><b>{player.vanquished.length}</b></div>
      <div className={`turn-lamp ${active ? 'on' : ''}`}><span />{active ? 'Active' : 'Waiting'}</div>
    </section>
  );
}
