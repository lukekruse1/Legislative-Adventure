
import React from 'react';
import type { AvatarUpgrade } from '../types';

interface UpgradeModalProps {
    upgrade: AvatarUpgrade;
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ upgrade, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full transform transition-all scale-100 animate-in fade-in zoom-in-95">
                <h2 className="text-3xl font-bold text-yellow-500">Upgrade Unlocked!</h2>
                <p className="text-gray-600 mt-2">You've earned a new item for your avatar:</p>
                <div className="my-8 flex justify-center">
                    <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                        <upgrade.asset className="w-32 h-32" />
                    </div>
                </div>
                <p className="text-2xl font-semibold text-gray-800">{upgrade.name}</p>
                <button 
                    onClick={onClose}
                    className="mt-8 w-full px-6 py-3 bg-green-500 text-white font-bold text-lg rounded-lg hover:bg-green-600 transform hover:scale-105 transition"
                >
                    Awesome!
                </button>
            </div>
        </div>
    );
};

export default UpgradeModal;
