import { useState } from 'react';
import { DEFAULT_DECK_ID, getOpponentDeckId } from '../game/deck';
import { GameApp } from './GameApp';
import { MainMenu } from './MainMenu';

export function App() {
  const [selectedDeckId, setSelectedDeckId] = useState(DEFAULT_DECK_ID);
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <GameApp
        playerDeckId={selectedDeckId}
        opponentDeckId={getOpponentDeckId(selectedDeckId)}
        onExit={() => setIsPlaying(false)}
      />
    );
  }

  return (
    <MainMenu
      selectedDeckId={selectedDeckId}
      onSelectDeck={setSelectedDeckId}
      onStart={() => setIsPlaying(true)}
    />
  );
}
