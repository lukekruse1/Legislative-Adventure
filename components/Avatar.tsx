
import React from 'react';
import { AVATAR_UPGRADES } from '../constants';
import { UpgradeType } from '../types';

interface AvatarProps {
  upgrades: string[];
}

const Avatar: React.FC<AvatarProps> = ({ upgrades }) => {
  const appliedUpgrades = AVATAR_UPGRADES.filter(u => upgrades.includes(u.id));

  const hat = appliedUpgrades.find(u => u.type === UpgradeType.HAT);
  const glasses = appliedUpgrades.find(u => u.type === UpgradeType.GLASSES);
  const accessory = appliedUpgrades.find(u => u.type === UpgradeType.ACCESSORY);

  return (
    <div className="relative w-24 h-24 bg-yellow-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
      {/* Base Face */}
      <div className="absolute w-full h-full">
         <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-gray-800 rounded-full"></div>
         <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-800 rounded-full"></div>
         <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-8 h-4 border-t-4 border-transparent border-b-4 border-b-gray-800 rounded-b-full"></div>
      </div>

      {/* Upgrades */}
      {hat && <hat.asset className="absolute -top-8 w-24 h-24" />}
      {glasses && <glasses.asset className="absolute top-1/3 left-1/2 w-20 -translate-x-1/2 -translate-y-1/2" />}
      {accessory && <accessory.asset className="absolute -bottom-3 left-1/2 w-16 -translate-x-1/2" />}
    </div>
  );
};

export default Avatar;
