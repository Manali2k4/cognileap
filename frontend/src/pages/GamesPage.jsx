import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/App';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import ChildSelector from '@/components/ChildSelector';
import { Brain, Puzzle, Target, Zap } from 'lucide-react';

const GamesPage = () => {
  const navigate = useNavigate();
  const { token, selectedChild } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [warmupAnswers, setWarmupAnswers] = useState({ q1: '', q2: '' });

  useEffect(() => {
    if (!token) {
      setShowAuthModal(true);
    }
  }, [token]);

  const games = [
    {
      id: 'memory',
      title: 'Memory Game',
      description: 'Match pairs of cards to improve memory and concentration',
      icon: <Brain size={48} />,
      color: '#6EC1E4',
      path: '/games/memory'
    },
    {
      id: 'puzzle',
      title: 'Puzzle Challenge',
      description: 'Solve colorful puzzles to enhance problem-solving skills',
      icon: <Puzzle size={48} />,
      color: '#A8E6CF',
      path: '/games/puzzle'
    },
    {
      id: 'attention',
      title: 'Attention Task',
      description: 'Find and click target objects to boost focus and reaction time',
      icon: <Target size={48} />,
      color: '#FFD166',
      path: '/games/attention'
    }
  ];

  const warmupQuestions = [
    { q: 'What color is the sky?', options: ['Blue', 'Green', 'Red'] },
    { q: 'How many fingers do you have on one hand?', options: ['3', '5', '7'] }
  ];

  const handleGameClick = (gamePath) => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    if (!selectedChild) {
      setShowChildSelector(true);
      return;
    }
    navigate(gamePath);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F7F7 0%, #E8F5F7 100%)' }}>
      <Navigation />
      
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in" data-testid="games-header">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#6EC1E4' }}>
              Choose Your Adventure!
            </h1>
            <p className="text-lg text-gray-600">
              Select a game to start training your brain
            </p>
          </div>

          {/* Warmup Quick Revision */}
          <div className="card mb-12 fade-in" style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, #CBAACB20 0%, #FFD16620 100%)' }} data-testid="warmup-section">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#CBAACB' }}>
                <Zap size={24} color="white" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#333' }}>Warm-up Quick Revision</h2>
            </div>
            <p className="text-gray-600 mb-6">Let's warm up with some easy questions before the games!</p>
            <div className="space-y-6">
              {warmupQuestions.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-xl" data-testid={`warmup-question-${index}`}>
                  <p className="font-semibold mb-3" style={{ color: '#333' }}>{item.q}</p>
                  <div className="flex flex-wrap gap-3">
                    {item.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => setWarmupAnswers({ ...warmupAnswers, [`q${index + 1}`]: option })}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                          warmupAnswers[`q${index + 1}`] === option ? 'scale-105' : 'hover:scale-105'
                        }`}
                        style={{
                          background: warmupAnswers[`q${index + 1}`] === option ? '#6EC1E4' : 'white',
                          color: warmupAnswers[`q${index + 1}`] === option ? 'white' : '#333',
                          border: `2px solid ${warmupAnswers[`q${index + 1}`] === option ? '#6EC1E4' : '#E5E7EB'}`
                        }}
                        data-testid={`warmup-option-${index}-${optIndex}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="games-grid">
            {games.map((game, index) => (
              <div
                key={game.id}
                onClick={() => handleGameClick(game.path)}
                className="card hover-lift cursor-pointer fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                data-testid={`game-card-${game.id}`}
              >
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                  style={{ background: `${game.color}20`, color: game.color }}
                >
                  {game.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-center" style={{ color: '#333' }}>
                  {game.title}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {game.description}
                </p>
                <button
                  className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105"
                  style={{ background: game.color, color: 'white' }}
                  data-testid={`play-${game.id}-btn`}
                >
                  Play Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showChildSelector && <ChildSelector onClose={() => setShowChildSelector(false)} />}
    </div>
  );
};

export default GamesPage;