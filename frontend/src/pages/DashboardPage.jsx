import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import ChildSelector from '@/components/ChildSelector';
import { TrendingUp, Clock, Flame, Target, Brain, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DashboardPage = () => {
  const { token, selectedChild } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowAuthModal(true);
    } else if (selectedChild) {
      fetchProgress();
    } else {
      setShowChildSelector(true);
    }
  }, [token, selectedChild]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/games/progress/${selectedChild.id}`);
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const suggestions = [
    'Encourage consistent daily practice for better retention',
    'Celebrate small victories to boost confidence',
    'Take breaks between games to prevent fatigue',
    'Try games at different times of day to find peak performance hours',
    'Mix different game types for balanced cognitive development'
  ];

  if (!token || !selectedChild) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F7F7 0%, #E8F5F7 100%)' }}>
        <Navigation />
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        {showChildSelector && <ChildSelector onClose={() => setShowChildSelector(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F7F7 0%, #E8F5F7 100%)' }}>
      <Navigation />
      
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in" data-testid="dashboard-header">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#6EC1E4' }}>
              {selectedChild?.name}'s Progress Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Track growth and celebrate achievements
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="spinner"></div>
            </div>
          ) : progress ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12" data-testid="stats-cards">
                <div className="card hover-lift fade-in" style={{ animationDelay: '0.1s' }} data-testid="overall-progress-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#6EC1E420' }}>
                      <TrendingUp size={20} style={{ color: '#6EC1E4' }} />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-600">Overall Progress</h3>
                  </div>
                  <p className="text-3xl font-bold mb-2" style={{ color: '#6EC1E4' }}>
                    {Math.round(progress.overall_progress)}%
                  </p>
                  <Progress value={progress.overall_progress} className="h-2" />
                </div>

                <div className="card hover-lift fade-in" style={{ animationDelay: '0.2s' }} data-testid="time-spent-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#A8E6CF20' }}>
                      <Clock size={20} style={{ color: '#A8E6CF' }} />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-600">Time Spent</h3>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#A8E6CF' }}>
                    {formatTime(progress.total_time)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Total training time</p>
                </div>

                <div className="card hover-lift fade-in" style={{ animationDelay: '0.3s' }} data-testid="streak-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFD16620' }}>
                      <Flame size={20} style={{ color: '#FFD166' }} />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-600">Streak</h3>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#FFD166' }}>
                    {progress.streak} {progress.streak === 1 ? 'day' : 'days'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Keep it going!</p>
                </div>

                <div className="card hover-lift fade-in" style={{ animationDelay: '0.4s' }} data-testid="games-played-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#CBAACB20' }}>
                      <Target size={20} style={{ color: '#CBAACB' }} />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-600">Games Played</h3>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#CBAACB' }}>
                    {progress.games_played}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Total sessions</p>
                </div>
              </div>

              {/* Accuracy & Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                <div className="card fade-in" style={{ animationDelay: '0.5s' }} data-testid="accuracy-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#6EC1E420' }}>
                      <Brain size={20} style={{ color: '#6EC1E4' }} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#333' }}>Average Accuracy</h3>
                  </div>
                  <div className="flex items-center justify-center py-8">
                    <div className="relative">
                      <svg width="200" height="200" viewBox="0 0 200 200">
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="16"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#6EC1E4"
                          strokeWidth="16"
                          strokeDasharray={`${2 * Math.PI * 80 * (progress.avg_accuracy / 100)} ${2 * Math.PI * 80}`}
                          strokeLinecap="round"
                          transform="rotate(-90 100 100)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <p className="text-4xl font-bold" style={{ color: '#6EC1E4' }}>
                          {Math.round(progress.avg_accuracy)}%
                        </p>
                        <p className="text-sm text-gray-600">Accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card fade-in" style={{ animationDelay: '0.6s' }} data-testid="chart-placeholder">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#A8E6CF20' }}>
                      <TrendingUp size={20} style={{ color: '#A8E6CF' }} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#333' }}>Progress Over Time</h3>
                  </div>
                  <div 
                    className="flex items-center justify-center py-8 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #6EC1E410 0%, #A8E6CF10 100%)', minHeight: '200px' }}
                  >
                    <p className="text-gray-500">Chart visualization coming soon</p>
                  </div>
                </div>
              </div>

              {/* Parent Suggestions */}
              <div className="card fade-in" style={{ animationDelay: '0.7s' }} data-testid="suggestions-section">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFD16620' }}>
                    <Sparkles size={20} style={{ color: '#FFD166' }} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: '#333' }}>Parent Suggestions</h3>
                </div>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-xl hover-lift cursor-pointer"
                      style={{ background: '#F9FAFB' }}
                      data-testid={`suggestion-${index}`}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" 
                           style={{ background: '#6EC1E4', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 card">
              <p className="text-gray-600 text-lg">No progress data available yet. Start playing games to see your progress!</p>
            </div>
          )}
        </div>
      </div>

      {showChildSelector && <ChildSelector onClose={() => setShowChildSelector(false)} />}
    </div>
  );
};

export default DashboardPage;