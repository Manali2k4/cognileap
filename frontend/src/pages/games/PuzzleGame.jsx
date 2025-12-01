import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Shuffle } from 'lucide-react';
import { toast } from 'sonner';

const PuzzleGame = () => {
  const navigate = useNavigate();
  const { selectedChild } = useContext(AuthContext);
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  const colors = [
    { id: 1, color: '#6EC1E4' },
    { id: 2, color: '#A8E6CF' },
    { id: 3, color: '#FFD166' },
    { id: 4, color: '#CBAACB' },
    { id: 5, color: '#FF6B9D' },
    { id: 6, color: '#95E1D3' },
    { id: 7, color: '#FFA07A' },
    { id: 8, color: '#DDA0DD' },
    { id: 0, color: 'transparent' }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameStarted && tiles.length > 0) {
      checkWin();
    }
  }, [tiles]);

  const initializeGame = () => {
    const shuffled = shuffleArray([...Array(9).keys()]);
    setTiles(shuffled);
    setMoves(0);
    setGameStarted(false);
    setStartTime(null);
    setGameComplete(false);
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleTileClick = (index) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    const emptyIndex = tiles.indexOf(0);
    const validMoves = [
      emptyIndex - 1, // left
      emptyIndex + 1, // right
      emptyIndex - 3, // top
      emptyIndex + 3  // bottom
    ];

    // Prevent wrapping
    if (emptyIndex % 3 === 0) validMoves[0] = -1;
    if (emptyIndex % 3 === 2) validMoves[1] = -1;

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);
    }
  };

  const checkWin = () => {
    const isWin = tiles.every((tile, index) => tile === index);
    if (isWin && !gameComplete) {
      handleGameComplete();
    }
  };

  const createConfetti = () => {
    const confettiColors = ['#6EC1E4', '#A8E6CF', '#FFD166', '#CBAACB'];
    for (let i = 0; i < 10; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  const handleGameComplete = async () => {
    setGameComplete(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = Math.max(0, 100 - (moves - 20));

    for (let i = 0; i < 50; i++) {
      setTimeout(() => createConfetti(), i * 50);
    }

    toast.success('🎉 Puzzle solved! Great job!');

    if (selectedChild) {
      try {
        await axios.post(`${API}/games/session`, {
          child_id: selectedChild.id,
          game_type: 'puzzle',
          score: Math.max(0, 100 - moves),
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
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#A8E6CF' }}>Sliding Puzzle</h1>
            <p className="text-lg text-gray-600 mb-4">Arrange the tiles in order from 1 to 8!</p>
            <div className="inline-block px-6 py-3 rounded-full" style={{ background: '#A8E6CF20' }}>
              <p className="text-sm text-gray-600">Moves</p>
              <p className="text-2xl font-bold" style={{ color: '#A8E6CF' }} data-testid="moves-count">{moves}</p>
            </div>
          </div>

          <div 
            className="max-w-md mx-auto fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl" style={{ background: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} data-testid="game-board">
              {tiles.map((tile, index) => (
                <div
                  key={index}
                  onClick={() => handleTileClick(index)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-4xl font-bold cursor-pointer transition-all ${
                    tile === 0 ? '' : 'hover-lift'
                  }`}
                  style={{
                    background: tile === 0 ? 'transparent' : colors[tile].color,
                    color: 'white',
                    boxShadow: tile === 0 ? 'none' : '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  data-testid={`tile-${index}`}
                >
                  {tile === 0 ? '' : tile}
                </div>
              ))}
            </div>
          </div>

          {gameComplete && (
            <div className="mt-8 card text-center fade-in" style={{ background: 'linear-gradient(135deg, #A8E6CF 0%, #6EC1E4 100%)' }} data-testid="game-complete">
              <h2 className="text-3xl font-bold text-white mb-4">🎉 Puzzle Solved!</h2>
              <p className="text-white text-lg mb-4">You completed it in {moves} moves!</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={initializeGame}
                  className="bg-white px-8 py-3 rounded-full font-bold hover-scale"
                  style={{ color: '#A8E6CF' }}
                  data-testid="play-again-btn"
                >
                  Play Again
                </Button>
                <Button
                  onClick={() => navigate('/games')}
                  variant="outline"
                  className="bg-white px-8 py-3 rounded-full font-bold hover-scale"
                  style={{ color: '#A8E6CF' }}
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

export default PuzzleGame;