import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import ChildSelector from '@/components/ChildSelector';
import { TrendingUp, Clock, Flame, Target, Brain, Sparkles, Trophy, Zap, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

const DashboardPage = () => {
  const { token, selectedChild } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [progress, setProgress] = useState(null);
  const [gameSessions, setGameSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (!token) {
      setShowAuthModal(true);
    } else if (selectedChild) {
      fetchProgress();
      fetchGameSessions();
    } else {
      setShowChildSelector(true);
    }
  }, [token, selectedChild]);

  useEffect(() => {
    if (progress && progress.overall_progress > 0) {
      let current = 0;
      const target = progress.overall_progress;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedProgress(target);
          clearInterval(timer);
        } else {
          setAnimatedProgress(current);
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [progress]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/games/progress/${selectedChild.id}`);
      setProgress(response.data);
      
      if (response.data.overall_progress >= 80) {
        triggerCelebration();
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameSessions = async () => {
    try {
      const response = await axios.get(`${API}/games/sessions/${selectedChild.id}`);
      setGameSessions(response.data || []);
    } catch (error) {
      console.error('Error fetching game sessions:', error);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getGameTypeLabel = (type) => {
    const labels = {
      memory: 'Memory Match',
      puzzle: 'Sliding Puzzle',
      attention: 'Attention Challenge'
    };
    return labels[type] || type;
  };

  const prepareChartData = () => {
    if (!gameSessions || gameSessions.length === 0) return [];
    
    const last7Sessions = gameSessions.slice(-7);
    return last7Sessions.map((session, index) => ({
      name: `Game ${index + 1}`,
      score: session.score,
      accuracy: session.accuracy,
      time: Math.floor(session.time_spent / 60)
    }));
  };

  const prepareRadarData = () => {
    if (!gameSessions || gameSessions.length === 0) return [];
    
    const gameTypes = ['memory', 'puzzle', 'attention'];
    return gameTypes.map(type => {
      const sessions = gameSessions.filter(s => s.game_type === type);
      const avgAccuracy = sessions.length > 0 
        ? sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length 
        : 0;
      return {
        subject: getGameTypeLabel(type),
        value: Math.round(avgAccuracy),
        fullMark: 100
      };
    });
  };

  const suggestions = [
    { icon: <Zap size={18} />, text: 'Encourage consistent daily practice for better retention', color: '#6EC1E4' },
    { icon: <Trophy size={18} />, text: 'Celebrate small victories to boost confidence', color: '#FFD166' },
    { icon: <Clock size={18} />, text: 'Take breaks between games to prevent fatigue', color: '#A8E6CF' },
    { icon: <Target size={18} />, text: 'Try games at different times to find peak performance hours', color: '#CBAACB' },
    { icon: <Brain size={18} />, text: 'Mix different game types for balanced cognitive development', color: '#6EC1E4' }
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 fade-in" data-testid="dashboard-header">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#6EC1E4' }}>
                {selectedChild?.name}'s Progress Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Track growth and celebrate achievements in real-time
              </p>
            </div>
            <Button
              onClick={() => {
                fetchProgress();
                fetchGameSessions();
              }}
              className="flex items-center gap-2 hover-scale"
              style={{ background: '#6EC1E4', color: 'white' }}
              data-testid="refresh-btn"
            >
              <RefreshCw size={18} />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="spinner"></div>
            </div>
          ) : progress ? (
            <>
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-testid="stats-cards">
                <div 
                  className="card hover-lift fade-in relative overflow-hidden" 
                  style={{ animationDelay: '0.1s', background: 'linear-gradient(135deg, #6EC1E420 0%, #6EC1E410 100%)' }} 
                  data-testid="overall-progress-card"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#6EC1E4' }}>
                      <TrendingUp size={24} color="white" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-700">Overall Progress</h3>
                  </div>
                  <p className="text-4xl font-bold mb-3" style={{ color: '#6EC1E4' }}>
                    {Math.round(animatedProgress)}%
                  </p>
                  <Progress value={animatedProgress} className="h-2" style={{ background: '#E0E0E0' }} />
                  <div 
                    className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10"
                    style={{ background: '#6EC1E4' }}
                  ></div>
                </div>

                <div 
                  className="card hover-lift fade-in relative overflow-hidden" 
                  style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, #A8E6CF20 0%, #A8E6CF10 100%)' }} 
                  data-testid="time-spent-card"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#A8E6CF' }}>
                      <Clock size={24} color="white" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-700">Time Spent</h3>
                  </div>
                  <p className="text-4xl font-bold" style={{ color: '#A8E6CF' }}>
                    {formatTime(progress.total_time)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Total training time</p>
                  <div 
                    className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10"
                    style={{ background: '#A8E6CF' }}
                  ></div>
                </div>

                <div 
                  className="card hover-lift fade-in relative overflow-hidden" 
                  style={{ animationDelay: '0.3s', background: 'linear-gradient(135deg, #FFD16620 0%, #FFD16610 100%)' }} 
                  data-testid="streak-card"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FFD166' }}>
                      <Flame size={24} color="white" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-700">Streak</h3>
                  </div>
                  <p className="text-4xl font-bold" style={{ color: '#FFD166' }}>
                    {progress.streak}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{progress.streak === 1 ? 'day' : 'days'} - Keep it going!</p>
                  <div 
                    className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10"
                    style={{ background: '#FFD166' }}
                  ></div>
                </div>

                <div 
                  className="card hover-lift fade-in relative overflow-hidden" 
                  style={{ animationDelay: '0.4s', background: 'linear-gradient(135deg, #CBAACB20 0%, #CBAACB10 100%)' }} 
                  data-testid="games-played-card"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#CBAACB' }}>
                      <Target size={24} color="white" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-700">Games Played</h3>
                  </div>
                  <p className="text-4xl font-bold" style={{ color: '#CBAACB' }}>
                    {progress.games_played}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Total sessions completed</p>
                  <div 
                    className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10"
                    style={{ background: '#CBAACB' }}
                  ></div>
                </div>
              </div>

              {/* Interactive Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {/* Performance Trend Chart */}
                <div className="card fade-in" style={{ animationDelay: '0.5s' }} data-testid="performance-chart">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#6EC1E420' }}>
                      <TrendingUp size={20} style={{ color: '#6EC1E4' }} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#333' }}>Performance Trend</h3>
                  </div>
                  {prepareChartData().length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={prepareChartData()}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6EC1E4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6EC1E4" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#A8E6CF" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#A8E6CF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ background: 'white', border: '2px solid #6EC1E4', borderRadius: '12px' }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#6EC1E4" 
                          fillOpacity={1} 
                          fill="url(#colorScore)" 
                          strokeWidth={3}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="accuracy" 
                          stroke="#A8E6CF" 
                          fillOpacity={1} 
                          fill="url(#colorAccuracy)" 
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      No performance data yet. Play some games!
                    </div>
                  )}
                </div>

                {/* Game Type Performance Radar */}
                <div className="card fade-in" style={{ animationDelay: '0.6s' }} data-testid="radar-chart">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFD16620' }}>
                      <Brain size={20} style={{ color: '#FFD166' }} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#333' }}>Skills Analysis</h3>
                  </div>
                  {prepareRadarData().length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={prepareRadarData()}>
                        <PolarGrid stroke="#E0E0E0" />
                        <PolarAngleAxis dataKey="subject" stroke="#666" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
                        <Radar 
                          name="Accuracy" 
                          dataKey="value" 
                          stroke="#FFD166" 
                          fill="#FFD166" 
                          fillOpacity={0.6} 
                          strokeWidth={2}
                        />
                        <Tooltip 
                          contentStyle={{ background: 'white', border: '2px solid #FFD166', borderRadius: '12px' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      Play different game types to see analysis
                    </div>
                  )}
                </div>
              </div>

              {/* Accuracy Circle & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {/* Circular Accuracy Display */}
                <div className="card fade-in" style={{ animationDelay: '0.7s' }} data-testid="accuracy-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#CBAACB20' }}>
                      <Target size={20} style={{ color: '#CBAACB' }} />
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
                          stroke="url(#gradient)"
                          strokeWidth="16"
                          strokeDasharray={`${2 * Math.PI * 80 * (progress.avg_accuracy / 100)} ${2 * Math.PI * 80}`}
                          strokeLinecap="round"
                          transform="rotate(-90 100 100)"
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6EC1E4" />
                            <stop offset="100%" stopColor="#A8E6CF" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <p className="text-5xl font-bold" style={{ color: '#6EC1E4' }}>
                          {Math.round(progress.avg_accuracy)}%
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Game Sessions */}
                <div className="card fade-in" style={{ animationDelay: '0.8s' }} data-testid="recent-activity">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#A8E6CF20' }}>
                      <Trophy size={20} style={{ color: '#A8E6CF' }} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#333' }}>Recent Activity</h3>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {gameSessions && gameSessions.length > 0 ? (
                      gameSessions.slice(-5).reverse().map((session, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl hover-lift"
                          style={{ background: '#F9FAFB' }}
                          data-testid={`activity-${index}`}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ 
                                background: session.game_type === 'memory' ? '#6EC1E420' : 
                                           session.game_type === 'puzzle' ? '#A8E6CF20' : '#FFD16620',
                                color: session.game_type === 'memory' ? '#6EC1E4' : 
                                       session.game_type === 'puzzle' ? '#A8E6CF' : '#FFD166'
                              }}
                            >
                              <Brain size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm" style={{ color: '#333' }}>
                                {getGameTypeLabel(session.game_type)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Score: {session.score} | {Math.round(session.accuracy)}% accuracy
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{formatTime(session.time_spent)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No game sessions yet
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Parent Suggestions */}
              <div className="card fade-in" style={{ animationDelay: '0.9s' }} data-testid="suggestions-section">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFD16620' }}>
                    <Sparkles size={20} style={{ color: '#FFD166' }} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: '#333' }}>Personalized Tips</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 rounded-xl hover-lift cursor-pointer transition-all"
                      style={{ background: `${suggestion.color}10`, border: `2px solid ${suggestion.color}20` }}
                      data-testid={`suggestion-${index}`}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" 
                        style={{ background: suggestion.color, color: 'white' }}
                      >
                        {suggestion.icon}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{suggestion.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 card">
              <Brain size={64} className="mx-auto mb-4" style={{ color: '#6EC1E4', opacity: 0.5 }} />
              <p className="text-gray-600 text-lg">No progress data available yet.</p>
              <p className="text-gray-500 mt-2">Start playing games to see your progress!</p>
            </div>
          )}
        </div>
      </div>

      {showChildSelector && <ChildSelector onClose={() => setShowChildSelector(false)} />}
    </div>
  );
};

export default DashboardPage;