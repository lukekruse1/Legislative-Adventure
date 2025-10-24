
import React from 'react';
import Avatar from './Avatar';

interface CertificateViewProps {
  playerName: string;
  score: number;
  onPlayAgain: () => void;
  avatarUpgrades: string[];
}

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div style={{ ...style, position: 'absolute', width: '10px', height: '20px', top: '-20px' }} />
);


const CertificateView: React.FC<CertificateViewProps> = ({ playerName, score, onPlayAgain, avatarUpgrades }) => {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const confetti = Array.from({ length: 50 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animation: `fall ${Math.random() * 3 + 2}s linear ${Math.random() * 3}s infinite`,
      backgroundColor: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'][i % 15],
      transform: `rotate(${Math.random() * 360}deg)`,
    };
    return <ConfettiPiece key={i} style={style} />;
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-teal-400 p-4 relative overflow-hidden">
       <style>
            {`
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            `}
        </style>
      {confetti}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 border-8 border-yellow-400 relative z-10">
        <div className="absolute -top-10 -right-10 hidden sm:block">
            <Avatar upgrades={avatarUpgrades} />
        </div>
        <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800" style={{fontFamily: 'serif'}}>Certificate of Completion</h1>
            <p className="text-xl text-gray-600 mt-4">This certificate is proudly presented to</p>
            <p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 my-8">
                {playerName}
            </p>
            <p className="text-xl text-gray-600">for successfully completing the</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">Legislative Branch Adventure</p>
            <p className="text-lg text-gray-500 mt-4">with a score of {score} out of 10!</p>
            <div className="flex justify-between items-center mt-12 text-gray-700">
                <div className="text-center">
                    <p className="font-bold border-t-2 border-gray-400 pt-2">Date</p>
                    <p>{date}</p>
                </div>
                <div className="text-center">
                     <p className="font-bold border-t-2 border-gray-400 pt-2">Signature</p>
                     <p className="font-cursive text-2xl">Civics Master</p>
                </div>
            </div>
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl text-white">🏆</div>
        </div>
        <div className="text-center mt-12">
            <button
                onClick={onPlayAgain}
                className="px-8 py-4 bg-blue-600 text-white font-bold text-xl rounded-lg hover:bg-blue-700 transform hover:scale-105 transition"
            >
                Play Again!
            </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
