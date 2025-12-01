import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Target } from 'lucide-react';
import { toast } from 'sonner';

const AttentionGame = () => {
  const navigate = useNavigate();
  const { selectedChild } = useContext(AuthContext);
  const [gameState, setGameState] = useState('ready'); // ready, playing, complete
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState(null);
  const [clicks, setClicks] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);

  const emojis = ['⭐', '🎯', '💎', '🔥', '⚡', '🌟'];
  const distractors = ['⚪', '⬜', '🔘', '◻️', '▫️', '○'];
  const targetEmoji = '⭐';

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleGameComplete();
    }
  }, [timeLeft, gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setRound(1);
    setTimeLeft(30);
    setStartTime(Date.now());
    setClicks(0);
    setCorrectClicks(0);
    spawnTargets();
  };

  const spawnTargets = () => {
    const newTargets = [];
    const numTargets = 3 + Math.floor(Math.random() * 3);
    const numDistractors = 8 + Math.floor(Math.random() * 4);

    for (let i = 0; i < numTargets; i++) {
      newTargets.push({
        id: `target-${i}`,
        emoji: targetEmoji,
        isTarget: true,
        x: Math.random() * 80 + 5,
        y: Math.random() * 70 + 10,
        size: 40 + Math.random() * 20
      });
    }

    for (let i = 0; i < numDistractors; i++) {
      newTargets.push({
        id: `distractor-${i}`,
        emoji: distractors[Math.floor(Math.random() * distractors.length)],
        isTarget: false,
        x: Math.random() * 80 + 5,
        y: Math.random() * 70 + 10,
        size: 40 + Math.random() * 20
      });
    }

    setTargets(newTargets);
  };

  const handleTargetClick = (target) => {
    setClicks(clicks + 1);
    
    if (target.isTarget) {
      setCorrectClicks(correctClicks + 1);
      setScore(score + 10);
      setTargets(targets.filter(t => t.id !== target.id));
      createSparkle(target);
      
      if (targets.filter(t => t.isTarget).length === 1) {
        setTimeout(() => {
          setRound(round + 1);
          spawnTargets();
        }, 500);
      }
    } else {
      setScore(Math.max(0, score - 5));
      toast.error('Wrong target! -5 points');
    }
  };

  const createSparkle = (target) => {
    const sparkle = document.createElement('div');
    sparkle.textContent = '+10';
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${target.x}%`;
    sparkle.style.top = `${target.y + 20}%`;
    sparkle.style.fontSize = '24px';
    sparkle.style.fontWeight = 'bold';
    sparkle.style.color = '#6EC1E4';
    sparkle.style.animation = 'fadeIn 0.5s ease-out forwards';
    sparkle.style.zIndex = '9999';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
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
    setGameState('complete');
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = clicks > 0 ? (correctClicks / clicks) * 100 : 0;

    for (let i = 0; i < 50; i++) {
      setTimeout(() => createConfetti(), i * 50);
    }

    toast.success(`🎯 Time's up! Final score: ${score}`);

    if (selectedChild) {
      try {
        await axios.post(`${API}/games/session`, {
          child_id: selectedChild.id,
          game_type: 'attention',
          score: score,
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
        <div className="max-w-6xl mx-auto">
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
            {gameState !== 'ready' && (
              <Button
                onClick={startGame}
                variant="outline"
                className="flex items-center gap-2"
                data-testid="restart-game-btn"
              >
                <RotateCcw size={16} />
                Restart
              </Button>
            )}
          </div>

          <div className="text-center mb-8 fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#FFD166' }}>Attention Challenge</h1>
            <p className="text-lg text-gray-600 mb-4">Click only on the ⭐ stars! Avoid other shapes!</p>
          </div>

          {gameState === 'ready' && (
            <div className="card max-w-2xl mx-auto text-center fade-in" style={{ animationDelay: '0.4s' }} data-testid="ready-screen">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#FFD16620' }}>
                <Target size={40} style={{ color: '#FFD166' }} />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#333' }}>Ready to Play?</h2>
              <p className="text-gray-600 mb-6">
                Find and click all the ⭐ stars as quickly as possible!
                <br />Be careful not to click on other shapes or you'll lose points.
              </p>
              <Button
                onClick={startGame}
                className="btn-primary text-lg px-12 py-4"
                data-testid="start-game-btn"
              >
                Start Game
              </Button>
            </div>
          )}

          {gameState === 'playing' && (
            <>
              <div className="flex justify-center gap-8 mb-8 fade-in">
                <div className="px-6 py-3 rounded-full" style={{ background: '#FFD16620' }}>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-2xl font-bold" style={{ color: '#FFD166' }} data-testid="score-count">{score}</p>
                </div>
                <div className="px-6 py-3 rounded-full" style={{ background: '#6EC1E420' }}>
                  <p className="text-sm text-gray-600">Time Left</p>
                  <p className="text-2xl font-bold" style={{ color: '#6EC1E4' }} data-testid="time-left">{timeLeft}s</p>
                </div>
                <div className="px-6 py-3 rounded-full" style={{ background: '#CBAACB20' }}>
                  <p className="text-sm text-gray-600">Round</p>
                  <p className="text-2xl font-bold" style={{ color: '#CBAACB' }} data-testid="round-count">{round}</p>
                </div>
              </div>

              <div 
                className="relative rounded-3xl mx-auto"
                style={{ 
                  width: '100%',
                  height: '500px',
                  background: 'white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}
                data-testid="game-area"
              >
                {targets.map((target) => (
                  <div
                    key={target.id}
                    onClick={() => handleTargetClick(target)}
                    className="absolute cursor-pointer hover-scale"
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      fontSize: `${target.size}px`,
                      transition: 'transform 0.2s ease'
                    }}
                    data-testid={target.isTarget ? 'target-item' : 'distractor-item'}
                  >
                    {target.emoji}
                  </div>
                ))}
              </div>
            </>
          )}

          {gameState === 'complete' && (
            <div className="card max-w-2xl mx-auto text-center fade-in" style={{ background: 'linear-gradient(135deg, #FFD166 0%, #CBAACB 100%)' }} data-testid="game-complete">
              <h2 className="text-3xl font-bold text-white mb-4">🎯 Great Focus!</h2>
              <p className="text-white text-lg mb-2">Final Score: {score}</p>
              <p className="text-white text-lg mb-2">Rounds Completed: {round - 1}</p>
              <p className="text-white text-lg mb-6">Accuracy: {clicks > 0 ? Math.round((correctClicks / clicks) * 100) : 0}%</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={startGame}
                  className="bg-white px-8 py-3 rounded-full font-bold hover-scale"
                  style={{ color: '#FFD166' }}
                  data-testid="play-again-btn"
                >
                  Play Again
                </Button>
                <Button
                  onClick={() => navigate('/games')}
                  variant="outline"
                  className="bg-white px-8 py-3 rounded-full font-bold hover-scale"
                  style={{ color: '#FFD166' }}
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

export default AttentionGame;