import { getCard } from '../data/catalog';
import type { AvailableAttack } from '../game/engine';
import type { AttackDefinition, BoardAddress, CardInstance, UnitInPlay } from '../game/types';
import { Cost } from './EnergyOrb';
import { ApertureIcon, CrosshairIcon } from './MakerGraphics';

interface ActionDockProps {
  notice: string;
  handSelection: CardInstance | null;
  unitSelection: { address: BoardAddress; unit: UnitInPlay } | null;
  utilitySelection: CardInstance | null;
  pendingAttack: number | null;
  canAct: boolean;
  canPlayHand: boolean;
  canRotate: boolean;
  construction: { completion: number; target: number; isDone: boolean; canAdvance: boolean } | null;
  attacks: AvailableAttack[];
  attackErrors: Array<string | null>;
  abilities: Array<{ sourceInstanceId: string; cardId: string; abilityId: string; name: string }>;
  onRotate: () => void;
  onAttack: (index: number) => void;
  onPlayHand: () => void;
  onAbility: (sourceInstanceId: string, abilityId: string) => void;
  onAdvanceConstruction: () => void;
  onCancel: () => void;
  onEndTurn: () => void;
}

function AttackButton({ attack, selected, unavailableReason, onClick }: { attack: AttackDefinition; selected: boolean; unavailableReason: string | null; onClick: () => void }) {
  return <button className={`attack-button ${selected ? 'selected' : ''}`} type="button" disabled={Boolean(unavailableReason)} aria-label={unavailableReason ? `${attack.name}: unavailable. ${unavailableReason}` : undefined} onClick={onClick}>
    <CrosshairIcon size={20} /><span><b>{attack.name}</b><small>{attack.damage} damage</small></span><Cost cost={attack.cost} isGenericCostVariable={attack.isGenericCostVariable} />
  </button>;
}

export function ActionDock(props: ActionDockProps) {
  const selected = props.handSelection
    ? getCard(props.handSelection.cardId)
    : props.unitSelection
      ? getCard(props.unitSelection.unit.cardId)
      : props.utilitySelection
        ? getCard(props.utilitySelection.cardId)
        : null;
  return (
    <section className="action-dock glass" aria-live="polite">
      <div className="action-prompt"><ApertureIcon size={24} /><div><small>ACTION</small><p>{props.pendingAttack !== null ? 'Choose a highlighted opposing Vanguard target.' : props.notice}</p></div></div>
      <div className="action-options">
        {props.handSelection && selected?.kind === 'unit' && <span className="placement-help">Choose a highlighted Vanguard or Backguard slot</span>}
        {props.handSelection && selected && selected.kind !== 'unit' && (
          <button className={`play-card-action play-${selected.kind}`} type="button" disabled={!props.canPlayHand} onClick={props.onPlayHand}>
            <span><b>Play {selected.kind === 'energy' ? 'Energy' : 'Utility'}</b><small>{selected.name}</small></span>
            {selected.kind === 'utility' && <Cost cost={selected.cost} isGenericCostVariable={selected.isGenericCostVariable} />}
          </button>
        )}
        {props.unitSelection?.address.player === 0 && selected?.kind === 'unit' && <>
          <button className="secondary-action" type="button" disabled={!props.canRotate} onClick={props.onRotate}>Rotate Unit</button>
          {props.attacks.map(({ attack, providerCardId }, index) => <AttackButton key={providerCardId + attack.id} attack={attack} selected={props.pendingAttack === index} unavailableReason={props.attackErrors[index] ?? null} onClick={() => props.onAttack(index)} />)}
        </>}
        {props.construction && (
          props.construction.isDone ? (
            <span className="placement-help">Construction complete ({props.construction.target}/{props.construction.target}). Its Completed Effect is active.</span>
          ) : (
            <button className="secondary-action" type="button" disabled={!props.construction.canAdvance} onClick={props.onAdvanceConstruction}>
              Advance Construction <small>{props.construction.completion}/{props.construction.target} — pay cost</small>
            </button>
          )
        )}
        {props.abilities.map((ability) => (
          <button className="secondary-action" type="button" key={ability.sourceInstanceId + ability.abilityId} disabled={!props.canAct} onClick={() => props.onAbility(ability.sourceInstanceId, ability.abilityId)}>
            {ability.name}
          </button>
        ))}
        {(props.handSelection || props.unitSelection || props.utilitySelection || props.pendingAttack !== null) && <button className="cancel-action" type="button" onClick={props.onCancel}>Cancel</button>}
      </div>
      <button className="end-turn" type="button" disabled={!props.canAct} onClick={props.onEndTurn}><span>End turn</span><small>Opponent plays next</small><i>→</i></button>
    </section>
  );
}
