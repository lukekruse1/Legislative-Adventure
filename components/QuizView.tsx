
import React, { useState, useEffect, useCallback } from 'react';
import type { Question } from '../types';
import { generateFinalQuiz } from '../services/geminiService';

interface QuizViewProps {
  onComplete: (score: number) => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
  </div>
);

const QuizView: React.FC<QuizViewProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const quizQuestions = await generateFinalQuiz();
      setQuestions(quizQuestions);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowResult(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete(isCorrect ? score + 1 : score);
    }
  };
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
  };
  
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-indigo-100"><LoadingSpinner /></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-600 font-bold text-xl">{error}</div>;
  if (questions.length === 0) return <div className="flex items-center justify-center min-h-screen bg-gray-100">No questions found.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h2>
        <div className="space-y-4">
          {currentQuestion.options.map(option => {
            let buttonClass = 'bg-white hover:bg-gray-100';
            if (showResult) {
                if(option === currentQuestion.correctAnswer) {
                    buttonClass = 'bg-green-200 border-green-500';
                } else if (option === selectedAnswer) {
                    buttonClass = 'bg-red-200 border-red-500';
                }
            } else if (option === selectedAnswer) {
                buttonClass = 'bg-blue-200 border-blue-500';
            }

            return (
              <button 
                key={option}
                onClick={() => !showResult && handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 text-lg text-gray-800 transition-all ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {showResult && (
            <div className="text-center mt-8">
                <button onClick={handleNextQuestion} className="px-10 py-4 bg-indigo-600 text-white font-bold text-xl rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition">
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
