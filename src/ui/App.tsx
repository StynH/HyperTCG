import { useState } from 'react';
import type { AiDifficulty } from '../game/ai/types';
import { DEFAULT_DECK_ID, getOpponentDeckId } from '../game/deck';
import { GameApp } from './GameApp';
import { CampaignMode } from './CampaignMode';
import { MainMenu } from './MainMenu';

export function App() {
  const [selectedDeckId, setSelectedDeckId] = useState(DEFAULT_DECK_ID);
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>('challenger');
  const [view, setView] = useState<'menu' | 'game' | 'campaign'>('menu');

  if (view === 'game') {
    return (
      <GameApp
        playerDeckId={selectedDeckId}
        opponentDeckId={getOpponentDeckId(selectedDeckId)}
        aiDifficulty={aiDifficulty}
        onExit={() => setView('menu')}
      />
    );
  }

  if (view === 'campaign') return <CampaignMode onExit={() => setView('menu')} />;

  return (
    <MainMenu
      selectedDeckId={selectedDeckId}
      aiDifficulty={aiDifficulty}
      onSelectDeck={setSelectedDeckId}
      onSelectAiDifficulty={setAiDifficulty}
      onStart={() => setView('game')}
      onOpenCampaign={() => setView('campaign')}
    />
  );
}
