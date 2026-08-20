import { useState } from 'react';
import { DEFAULT_DECK_ID, getOpponentDeckId } from '../game/deck';
import { GameApp } from './GameApp';
import { CampaignMode } from './CampaignMode';
import { MainMenu } from './MainMenu';

export function App() {
  const [selectedDeckId, setSelectedDeckId] = useState(DEFAULT_DECK_ID);
  const [view, setView] = useState<'menu' | 'game' | 'campaign'>('menu');

  if (view === 'game') {
    return (
      <GameApp
        playerDeckId={selectedDeckId}
        opponentDeckId={getOpponentDeckId(selectedDeckId)}
        onExit={() => setView('menu')}
      />
    );
  }

  if (view === 'campaign') return <CampaignMode onExit={() => setView('menu')} />;

  return (
    <MainMenu
      selectedDeckId={selectedDeckId}
      onSelectDeck={setSelectedDeckId}
      onStart={() => setView('game')}
      onOpenCampaign={() => setView('campaign')}
    />
  );
}
