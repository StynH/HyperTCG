/// <reference lib="webworker" />

import { seededRandom } from './random';
import { chooseStrategicOpponentAction } from './strategicOpponent';
import type { AiSearchRequest, AiSearchResponse } from './workerProtocol';

self.onmessage = (event: MessageEvent<AiSearchRequest>) => {
  const { requestId, state, options, seed } = event.data;
  try {
    const decision = chooseStrategicOpponentAction(state, options, seededRandom(seed));
    const response: AiSearchResponse = { requestId, action: decision?.action ?? null };
    self.postMessage(response);
  } catch (error) {
    const response: AiSearchResponse = {
      requestId,
      action: null,
      error: error instanceof Error ? error.message : String(error),
    };
    self.postMessage(response);
  }
};
