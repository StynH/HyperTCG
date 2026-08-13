import { getCard } from '../data/catalog';
import type { AttackDefinition, BoardAddress, CardInstance, UnitInPlay } from '../game/types';
import { Cost } from './EnergyOrb';
import { ApertureIcon, CrosshairIcon } from './MakerGraphics';

interface ActionDockProps {
  notice: string;
  handSelection: CardInstance | null;
  unitSelection: { address: BoardAddress; unit: UnitInPlay } | null;
  pendingAttack: number | null;
  canAct: boolean;
  onRotate: () => void;
  onAttack: (index: number) => void;
  onCancel: () => void;
  onEndTurn: () => void;
}

function AttackButton({ attack, selected, onClick }: { attack: AttackDefinition; selected: boolean; onClick: () => void }) {
  return <button className={`attack-button ${selected ? 'selected' : ''}`} type="button" onClick={onClick}>
    <CrosshairIcon size={20} /><span><b>{attack.name}</b><small>{attack.damage} damage</small></span><Cost cost={attack.cost} />
  </button>;
}

export function ActionDock(props: ActionDockProps) {
  const selected = props.handSelection ? getCard(props.handSelection.cardId) : props.unitSelection ? getCard(props.unitSelection.unit.cardId) : null;
  return (
    <section className="action-dock glass" aria-live="polite">
      <div className="action-prompt"><ApertureIcon size={24} /><div><small>COMMAND</small><p>{props.pendingAttack !== null ? 'Choose a highlighted opposing Vanguard target.' : props.notice}</p></div></div>
      <div className="action-options">
        {props.handSelection && selected?.kind === 'unit' && <span className="placement-help">Choose a highlighted Vanguard or Backguard slot</span>}
        {props.unitSelection && selected?.kind === 'unit' && <>
          <button className="secondary-action" type="button" disabled={!props.canAct || !props.unitSelection.unit.isReady} onClick={props.onRotate}>Rotate Unit</button>
          {selected.attacks.map((attack, index) => <AttackButton key={attack.id} attack={attack} selected={props.pendingAttack === index} onClick={() => props.onAttack(index)} />)}
        </>}
        {(props.handSelection || props.unitSelection || props.pendingAttack !== null) && <button className="cancel-action" type="button" onClick={props.onCancel}>Cancel</button>}
      </div>
      <button className="end-turn" type="button" disabled={!props.canAct} onClick={props.onEndTurn}><span>End turn</span><small>Pass priority</small><i>→</i></button>
    </section>
  );
}
