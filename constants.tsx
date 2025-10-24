
import React from 'react';
import type { AvatarUpgrade, Level } from './types';
import { UpgradeType } from './types';

// SVG components for avatar upgrades
const TopHat: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -90)"><path d="M25 150h50v5h-50z" fill="#333" /><path d="M20 145h60v5h-60z" fill="#d9534f" /><path d="M30 110h40v40h-40z" fill="#333" /></g></svg>
);

const Sunglasses: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg"><g><rect x="10" y="15" width="35" height="20" rx="10" fill="#222" /><rect x="55" y="15" width="35" height="20" rx="10" fill="#222" /><path d="M45 25h10" stroke="#222" strokeWidth="3" /></g></svg>
);

const Bowtie: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg"><path d="M50 25 L20 10 L20 40 Z" fill="#d9534f" /><path d="M50 25 L80 10 L80 40 Z" fill="#d9534f" /><circle cx="50" cy="25" r="5" fill="#333" /></svg>
);

const Monocle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="50" r="15" stroke="#DAA520" strokeWidth="3" fill="none" /><path d="M50 50 L70 30" stroke="#DAA520" strokeWidth="2" /></svg>
);

const GraduationCap: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -20)"><path d="M5 60 L50 80 L95 60 L50 40 Z" fill="#333" /><rect x="25" y="80" width="50" height="10" fill="#333" /><path d="M75 62 L75 80 L80 80 L80 62 Z" transform="rotate(15 77.5 71)" fill="#F0C419"/><path d="M80 78 L80 85" stroke="#F0C419" strokeWidth="2" /></g></svg>
);


export const AVATAR_UPGRADES: AvatarUpgrade[] = [
  { id: 'top_hat', name: 'Top Hat', type: UpgradeType.HAT, asset: TopHat },
  { id: 'sunglasses', name: 'Cool Shades', type: UpgradeType.GLASSES, asset: Sunglasses },
  { id: 'bowtie', name: 'Snazzy Bowtie', type: UpgradeType.ACCESSORY, asset: Bowtie },
  { id: 'monocle', name: 'Fancy Monocle', type: UpgradeType.GLASSES, asset: Monocle },
  { id: 'grad_cap', name: 'Graduation Cap', type: UpgradeType.HAT, asset: GraduationCap },
];

export const LEVELS: Level[] = [
  { id: 1, title: "The Great Compromise", topic: "The bicameral structure of Congress and the Great Compromise." },
  { id: 2, title: "The People's House", topic: "The House of Representatives: qualifications, terms, and representation." },
  { id: 3, title: "The Senate", topic: "The Senate: qualifications, terms, and equal representation." },
  { id: 4, title: "Powers of Congress", topic: "The enumerated powers of Congress in Article I, Section 8 of the Constitution." },
  { id: 5, title: "Congressional Leadership", topic: "The leadership roles in the House and Senate, such as Speaker of the House, Majority/Minority Leaders, and Whips." },
  { id: 6, title: "Bill to Law", topic: "The process of how a bill becomes a law, from introduction to presidential signature." },
];
