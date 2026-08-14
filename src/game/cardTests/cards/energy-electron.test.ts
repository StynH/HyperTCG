import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';
export default defineGameplayCardTest({ cardId: 'energy-electron', scenarios: [s.energy({ expect: [s.zone('source', 'energies')] })] });
