
export enum UpgradeType {
  HAT = 'HAT',
  GLASSES = 'GLASSES',
  ACCESSORY = 'ACCESSORY',
}

export interface AvatarUpgrade {
  id: string;
  name: string;
  type: UpgradeType;
  asset: React.FC<{ className?: string }>;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Level {
  id: number;
  title: string;
  topic: string; 
  content?: string; 
  task?: {
    type: 'quiz';
    questions: Question[];
  };
}

export type GameView = 'name_entry' | 'game_screen' | 'level' | 'quiz' | 'certificate' | 'drag_and_drop_review';

export interface GameState {
  unlockedLevels: number[];
  completedLevels: number[];
  avatarUpgrades: string[]; // This now represents EQUIPPED upgrades
  earnedUpgrades: string[]; // This represents ALL unlocked upgrades
  playerName: string;
  currentView: GameView;
  activeLevelId: number | null;
  score: number;
}
