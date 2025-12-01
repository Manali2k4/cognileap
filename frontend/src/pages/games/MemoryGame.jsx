import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const MemoryGame = () => {
  const navigate = useNavigate();
  const { selectedChild } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  const emojis = ['🌟', '🎈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸'];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      handleGameComplete();
    }
  }, [matched]);

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(false);
    setStartTime(null);
    setGameComplete(false);
  };

  const handleCardClick = (index) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        createConfetti();
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const createConfetti = () => {
    const colors = ['#6EC1E4', '#A8E6CF', '#FFD166', '#CBAACB'];
    for (let i = 0; i < 10; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  const handleGameComplete = async () => {
    setGameComplete(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = ((cards.length / 2) / moves) * 100;

    // Show confetti
    for (let i = 0; i < 50; i++) {
      setTimeout(() => createConfetti(), i * 50);
    }

    toast.success('🎉 Congratulations! You completed the game!');

    if (selectedChild) {
      try {
        await axios.post(`${API}/games/session`, {
          child_id: selectedChild.id,
          game_type: 'memory',
          score: Math.max(0, 100 - moves * 5),
          accuracy: Math.min(100, accuracy),
          time_spent: timeSpent,
          difficulty_level: 1
        });
      } catch (error) {
        console.error('Error saving game session:', error);
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F7F7 0%, #E8F5F7 100%)' }}>
      <Navigation />
      
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 fade-in" data-testid="game-header">
            <Button
              onClick={() => navigate('/games')}
              variant="outline"
              className="flex items-center gap-2"
              data-testid="back-to-games-btn"
            >
              <ArrowLeft size={16} />
              Back to Games
            </Button>
            <Button
              onClick={initializeGame}
              variant="outline"
              className="flex items-center gap-2"
              data-testid="restart-game-btn"
            >
              <RotateCcw size={16} />
              Restart
            </Button>
          </div>

          <div className="text-center mb-8 fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#6EC1E4' }}>Memory Match</h1>
            <p className="text-lg text-gray-600 mb-4">Find all the matching pairs!</p>
            <div className="flex justify-center gap-8">
              <div className="px-6 py-3 rounded-full" style={{ background: '#6EC1E420' }}>
                <p className="text-sm text-gray-600">Moves</p>
                <p className="text-2xl font-bold" style={{ color: '#6EC1E4' }} data-testid="moves-count">{moves}</p>
              </div>
              <div className="px-6 py-3 rounded-full" style={{ background: '#A8E6CF20' }}>
                <p className="text-sm text-gray-600">Matched</p>
                <p className="text-2xl font-bold" style={{ color: '#A8E6CF' }} data-testid="matched-count">{matched.length / 2}/{cards.length / 2}</p>
              </div>
            </div>
          </div>

          <div 
            className="grid grid-cols-4 gap-4 fade-in"
            style={{ animationDelay: '0.4s' }}
            data-testid="game-board"
          >
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-5xl cursor-pointer transition-all duration-300 ${
                  flipped.includes(index) || matched.includes(index) ? 'hover-scale' : 'hover-lift'
                }`}
                style={{
                  background: flipped.includes(index) || matched.includes(index)
                    ? 'linear-gradient(135deg, #6EC1E4 0%, #A8E6CF 100%)'
                    : 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: flipped.includes(index) || matched.includes(index) ? 'rotateY(0deg)' : 'rotateY(0deg)',
                  opacity: matched.includes(index) ? 0.7 : 1
                }}
                data-testid={`card-${index}`}
              >
                {(flipped.includes(index) || matched.includes(index)) ? card.emoji : '?'}
              </div>
            ))}
          </div>

          {gameComplete && (
            <div className="mt-8 card text-center fade-in" style={{ background: 'linear-gradient(135deg, #6EC1E4 0%, #A8E6CF 100%)' }} data-testid="game-complete">
              <h2 className="text-3xl font-bold text-white mb-4">🎉 Amazing Job!</h2>
              <p className="text-white text-lg mb-4">You completed the game in {moves} moves!</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={initializeGame}
                  className="bg-white px-8 py-3 rounded-full font-bold hover-scale"
                  style={{ color: '#6EC1E4' }}
                  data-testid="play-again-btn"
                >
                  Play Again
                </Button>
                <Button
                  onClick={() => navigate('/games')}
                  variant="outline"
                  className="bg-white px-8 py-3 rounded-full font-bold hover-scale"
                  style={{ color: '#6EC1E4' }}
                  data-testid="back-to-games-complete-btn"
                >
                  Back to Games
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;