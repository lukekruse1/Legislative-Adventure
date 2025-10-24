
import React from 'react';
import type { GameState } from '../types';
import Avatar from './Avatar';

interface HeaderProps {
    gameState: GameState;
}

const Header: React.FC<HeaderProps> = ({ gameState }) => {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center rounded-b-xl sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                Legislative Adventure
            </h1>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <div className="text-sm text-gray-500">Player</div>
                    <div className="text-lg font-semibold text-gray-800">{gameState.playerName}</div>
                </div>
                <Avatar upgrades={gameState.avatarUpgrades} />
            </div>
        </header>
    );
};

export default Header;
