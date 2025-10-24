
import React, { useState, useEffect, useCallback } from 'react';
import type { Level, Question } from '../types';
import { generateLevelContent } from '../services/geminiService';

interface LevelViewProps {
  level: Level;
  onComplete: () => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let listItems: React.ReactElement[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-none space-y-2 my-4 pl-5">
                    {listItems}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        if (line.startsWith('* ')) {
            listItems.push(
                <li key={index} className="text-lg text-gray-800 leading-relaxed">{line.substring(2)}</li>
            );
        } else {
            flushList();
            if (line.startsWith('### ')) {
                elements.push(<h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-indigo-700">{line.substring(4)}</h3>);
            } else if (line.startsWith('## ')) {
                elements.push(<h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-blue-800">{line.substring(3)}</h2>);
            } else if (line.startsWith('# ')) {
                elements.push(<h1 key={index} className="text-3xl font-extrabold mt-8 mb-4 text-gray-900">{line.substring(2)}</h1>);
            } else if (line.trim() !== '') {
                elements.push(<p key={index} className="my-2 text-lg text-gray-800 leading-relaxed">{line}</p>);
            }
        }
    });

    flushList(); 
    return <>{elements}</>;
};


const LevelView: React.FC<LevelViewProps> = ({ level, onComplete }) => {
  const [levelData, setLevelData] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [levelScore, setLevelScore] = useState(0);
  const [quizFailed, setQuizFailed] = useState(false);

  const fetchLevelData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generateLevelContent(level.topic, level.title);
      setLevelData({ ...level, ...data });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [level.topic, level.title]);

  useEffect(() => {
    fetchLevelData();
  }, [fetchLevelData]);

  const handleAnswerSubmit = () => {
    if (!question || !selectedAnswer) return;
    if (selectedAnswer === question.correctAnswer) {
      setIsCorrect(true);
      setLevelScore(prev => prev + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const handleRetryQuiz = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setLevelScore(0);
      setQuizFailed(false);
  }

  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === (levelData?.task?.questions.length ?? 0) - 1;

    if (isLastQuestion) {
        if (levelScore >= 2) {
            onComplete();
        } else {
            setQuizFailed(true);
        }
    } else {
      setIsCorrect(null);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const question = levelData?.task?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-6">{level.title}</h1>
          {loading && <LoadingSpinner />}
          {error && <div className="text-center text-red-500 font-semibold p-4 bg-red-100 rounded-lg">{error}</div>}
          {levelData && !loading && (
            <div>
              <div className="prose lg:prose-xl max-w-none">
                 <MarkdownRenderer content={levelData.content || ''} />
              </div>
              
              {quizFailed ? (
                 <div className="mt-12 p-6 bg-red-50 rounded-lg border-2 border-red-200 text-center">
                    <h3 className="text-2xl font-bold text-red-800">Keep Studying!</h3>
                    <p className="text-lg text-gray-700 my-4">You need to score at least 2 out of 3 to pass. Don't worry, you can try again!</p>
                    <button onClick={handleRetryQuiz} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                        Retry Quiz
                    </button>
                </div>
              ) : question && (
                <div className="mt-12 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-blue-800">Check your knowledge!</h3>
                    {levelData.task && <span className="text-sm font-semibold text-gray-500">Question {currentQuestionIndex + 1} of {levelData.task.questions.length}</span>}
                  </div>
                  <p className="text-lg font-semibold text-gray-700 mb-4">{question.question}</p>
                  <div className="space-y-3">
                    {question.options.map(option => {
                      const isSelected = selectedAnswer === option;
                      let buttonClass = 'bg-white hover:bg-blue-100';
                      if (isCorrect !== null) {
                          if (option === question.correctAnswer) {
                              buttonClass = 'bg-green-200 border-green-500';
                          } else if (isSelected) {
                              buttonClass = 'bg-red-200 border-red-500';
                          }
                      } else if (isSelected) {
                          buttonClass = 'bg-blue-200 border-blue-500 ring-2 ring-blue-500';
                      }

                      return (
                          <button key={option} 
                            onClick={() => isCorrect === null && setSelectedAnswer(option)}
                            disabled={isCorrect !== null}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all text-gray-800 text-lg ${buttonClass}`}>
                            {option}
                          </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 text-center">
                    {isCorrect === null ? (
                      <button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-transform transform hover:scale-105">Submit</button>
                    ) : isCorrect ? (
                      <div>
                          <p className="text-xl font-bold text-green-600">Correct! Well done!</p>
                          <button onClick={handleNext} className="mt-4 px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105">
                            {currentQuestionIndex === (levelData?.task?.questions.length ?? 0) - 1 ? 'Finish Quiz' : 'Next Question'}
                          </button>
                      </div>
                    ) : (
                      <div>
                           <p className="text-xl font-bold text-red-600">Not quite. The correct answer was "{question.correctAnswer}".</p>
                           <button onClick={handleNext} className="mt-4 px-8 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-transform transform hover:scale-105">
                            {currentQuestionIndex === (levelData?.task?.questions.length ?? 0) - 1 ? 'Finish Quiz' : 'Next Question'}
                           </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelView;
