
import React from 'react';
import type { GameState } from '../types';
import Header from './Header';
import { LEVELS, AVATAR_UPGRADES } from '../constants';

interface GameScreenProps {
  gameState: GameState;
  onStartLevel: (levelId: number) => void;
  onStartQuiz: () => void;
  onToggleUpgrade: (upgradeId: string) => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const Wardrobe: React.FC<{ gameState: GameState, onToggleUpgrade: (upgradeId: string) => void}> = ({ gameState, onToggleUpgrade }) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">Your Wardrobe</h3>
            {gameState.earnedUpgrades.length === 0 ? (
                <p className="text-center text-gray-500">Complete levels to earn upgrades!</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {AVATAR_UPGRADES.filter(u => gameState.earnedUpgrades.includes(u.id)).map(upgrade => {
                        const isEquipped = gameState.avatarUpgrades.includes(upgrade.id);
                        return (
                            <button
                                key={upgrade.id}
                                onClick={() => onToggleUpgrade(upgrade.id)}
                                title={`Click to ${isEquipped ? 'unequip' : 'equip'} ${upgrade.name}`}
                                className={`p-2 rounded-lg border-2 transition-all transform hover:scale-110 ${isEquipped ? 'bg-blue-200 border-blue-500 ring-2 ring-blue-500' : 'bg-gray-100 hover:bg-blue-100 border-gray-200'}`}
                            >
                                <upgrade.asset className="w-full h-16" />
                                <span className="text-xs font-semibold text-gray-700 truncate block mt-1">{upgrade.name}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


const GameScreen: React.FC<GameScreenProps> = ({ gameState, onStartLevel, onStartQuiz, onToggleUpgrade }) => {
    const allLevelsCompleted = LEVELS.every(level => gameState.completedLevels.includes(level.id));
    const totalLevels = LEVELS.length;
    const completedCount = gameState.completedLevels.length;
    const progressPercentage = totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200">
            <Header gameState={gameState} />
            <main className="container mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800">Your Learning Path</h2>
                    <p className="text-lg text-gray-600 mt-2">Complete each level to unlock the next and customize your avatar!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                         <div className="mb-8 max-w-2xl mx-auto">
                            <div className="flex justify-between items-center mb-1 text-gray-700 font-semibold">
                                <span>Progress</span>
                                <span>{completedCount} / {totalLevels} Levels</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                                <div 
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out" 
                                    style={{ width: `${progressPercentage}%` }}>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex flex-col items-center">
                           {LEVELS.map((level, index) => {
                               const isUnlocked = gameState.unlockedLevels.includes(level.id);
                               const isCompleted = gameState.completedLevels.includes(level.id);
                               return(
                                   <div key={level.id} className="flex items-center w-full my-4 md:w-3/4">
                                       <div className="flex-1 flex justify-end pr-4 text-right">
                                           {index % 2 === 0 && (
                                               <div className="w-full">
                                                   <h3 className="text-xl font-bold text-indigo-700">{level.title}</h3>
                                               </div>
                                           )}
                                       </div>
                                       <button 
                                           onClick={() => isUnlocked && !isCompleted && onStartLevel(level.id)}
                                           disabled={!isUnlocked || isCompleted}
                                           className={`w-24 h-24 rounded-full flex items-center justify-center transition transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-400 z-10 
                                           ${isCompleted ? 'bg-green-500 cursor-default' : ''}
                                           ${isUnlocked && !isCompleted ? 'bg-blue-500 hover:bg-blue-600' : ''}
                                           ${!isUnlocked ? 'bg-gray-300 cursor-not-allowed' : ''}
                                       `}>
                                           {isCompleted ? <CheckIcon/> : (isUnlocked ? <span className="text-white text-4xl font-bold">{level.id}</span> : <LockIcon/>)}
                                       </button>
                                       <div className="flex-1 pl-4">
                                           {index % 2 !== 0 && (
                                               <div className="w-full">
                                                   <h3 className="text-xl font-bold text-indigo-700">{level.title}</h3>
                                               </div>
                                           )}
                                       </div>
                                   </div>
                               );
                           })}
                           <div className="absolute top-0 left-1/2 -ml-0.5 w-1 h-full bg-gray-300 z-0"/>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <Wardrobe gameState={gameState} onToggleUpgrade={onToggleUpgrade} />
                    </div>
                </div>

                <div className="text-center mt-12">
                    <button
                        onClick={onStartQuiz}
                        disabled={!allLevelsCompleted}
                        className="px-12 py-6 text-2xl font-bold text-white rounded-xl shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 bg-gradient-to-r from-purple-600 to-pink-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none">
                        Final Challenge!
                    </button>
                    {!allLevelsCompleted && <p className="text-gray-500 mt-2">Complete all levels to unlock the final challenge.</p>}
                </div>
            </main>
        </div>
    );
};

export default GameScreen;
