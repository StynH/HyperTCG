import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';
export default defineGameplayCardTest({ cardId: 'energy-muon', scenarios: [s.energy({ expect: [s.zone('source', 'energies')] })] });
