
import React, { useState, useCallback, useMemo } from 'react';
import type { GameState, AvatarUpgrade } from './types';
import { GameView, UpgradeType } from './types';
import { LEVELS, AVATAR_UPGRADES } from './constants';
import GameScreen from './components/GameScreen';
import LevelView from './components/LevelView';
import QuizView from './components/QuizView';
import CertificateView from './components/CertificateView';
import UpgradeModal from './components/UpgradeModal';
import DragAndDropView from './components/DragAndDropView';

const INITIAL_GAME_STATE: GameState = {
  unlockedLevels: [1],
  completedLevels: [],
  avatarUpgrades: [],
  earnedUpgrades: [],
  playerName: '',
  currentView: 'name_entry',
  activeLevelId: null,
  score: 0,
};

const NameEntryView: React.FC<{ onNameSubmit: (name: string) => void }> = ({ onNameSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onNameSubmit(name.trim());
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl text-center">
                <h1 className="text-4xl font-bold text-gray-800">Welcome to the</h1>
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">Legislative Adventure!</h2>
                <p className="text-lg text-gray-600">Enter your name to begin your journey to become a civics master!</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name Here"
                        className="w-full px-4 py-3 text-lg text-center text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
                    />
                    <button type="submit" className="w-full px-6 py-4 text-xl font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 transition">
                        Start Adventure!
                    </button>
                </form>
            </div>
        </div>
    );
};


function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [showUpgrade, setShowUpgrade] = useState<AvatarUpgrade | null>(null);

  const handleNameSubmit = (name: string) => {
    setGameState(prev => ({ ...prev, playerName: name, currentView: 'game_screen' }));
  };
  
  const handleStartLevel = (levelId: number) => {
    setGameState(prev => ({...prev, currentView: 'level', activeLevelId: levelId}));
  };
  
  const handleCompleteLevel = (levelId: number) => {
    const nextLevelId = levelId + 1;
    const newUpgrade = AVATAR_UPGRADES[gameState.completedLevels.length % AVATAR_UPGRADES.length];

    setGameState(prev => {
        const completed = [...prev.completedLevels, levelId];
        const unlocked = prev.unlockedLevels;
        if (LEVELS.find(l => l.id === nextLevelId) && !unlocked.includes(nextLevelId)) {
            unlocked.push(nextLevelId);
        }
        
        return {
            ...prev,
            completedLevels: completed,
            unlockedLevels: unlocked,
            earnedUpgrades: newUpgrade ? [...prev.earnedUpgrades, newUpgrade.id] : prev.earnedUpgrades,
            currentView: 'game_screen',
            activeLevelId: null,
        }
    });
    
    if (newUpgrade) {
        setShowUpgrade(newUpgrade);
    }
  };

  const handleToggleUpgrade = (upgradeId: string) => {
    const upgradeToToggle = AVATAR_UPGRADES.find(u => u.id === upgradeId);
    if (!upgradeToToggle) return;

    setGameState(prev => {
        const currentlyEquipped = prev.avatarUpgrades;
        const isEquipped = currentlyEquipped.includes(upgradeId);

        if (isEquipped) {
            // Unequip
            return {
                ...prev,
                avatarUpgrades: currentlyEquipped.filter(id => id !== upgradeId)
            };
        } else {
            // Equip
            // First, remove any other item of the same type
            const filteredUpgrades = currentlyEquipped.filter(id => {
                const item = AVATAR_UPGRADES.find(u => u.id === id);
                return item?.type !== upgradeToToggle.type;
            });

            return {
                ...prev,
                avatarUpgrades: [...filteredUpgrades, upgradeId]
            };
        }
    });
  };
  
  const handleStartQuiz = () => {
    setGameState(prev => ({...prev, currentView: 'drag_and_drop_review'}));
  };
  
  const handleCompleteDragDrop = () => {
    setGameState(prev => ({...prev, currentView: 'quiz'}));
  }

  const handleCompleteQuiz = (finalScore: number) => {
    setGameState(prev => ({...prev, score: finalScore, currentView: 'certificate'}));
  };

  const handlePlayAgain = () => {
    const playerName = gameState.playerName;
    setGameState({
      ...INITIAL_GAME_STATE,
      playerName: playerName,
      currentView: 'game_screen',
    });
  };

  const activeLevel = useMemo(() => {
    if (gameState.activeLevelId === null) return null;
    return LEVELS.find(l => l.id === gameState.activeLevelId) || null;
  }, [gameState.activeLevelId]);

  const renderView = () => {
    switch(gameState.currentView) {
      case 'name_entry':
        return <NameEntryView onNameSubmit={handleNameSubmit} />;
      case 'game_screen':
        return <GameScreen gameState={gameState} onStartLevel={handleStartLevel} onStartQuiz={handleStartQuiz} onToggleUpgrade={handleToggleUpgrade} />;
      case 'level':
        if (!activeLevel) return <div>Error: Level not found</div>;
        return <LevelView level={activeLevel} onComplete={() => handleCompleteLevel(activeLevel.id)} />;
      case 'drag_and_drop_review':
        return <DragAndDropView onComplete={handleCompleteDragDrop} />;
      case 'quiz':
        return <QuizView onComplete={handleCompleteQuiz} />;
      case 'certificate':
        return <CertificateView playerName={gameState.playerName} score={gameState.score} onPlayAgain={handlePlayAgain} avatarUpgrades={gameState.avatarUpgrades} />;
      default:
        return <div>Loading...</div>;
    }
  }

  return (
    <div className="font-sans">
      {renderView()}
      {showUpgrade && (
          <UpgradeModal 
              upgrade={showUpgrade}
              onClose={() => setShowUpgrade(null)}
          />
      )}
    </div>
  );
}

export default App;
