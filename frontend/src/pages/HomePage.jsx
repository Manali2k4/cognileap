import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/App';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import { Gamepad2, TrendingUp, Users, Globe } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: <Gamepad2 size={48} />,
      title: 'Cognitive Games',
      description: 'Fun and engaging games designed to enhance memory, attention, and problem-solving skills',
      color: '#6EC1E4',
      delay: '0s'
    },
    {
      icon: <TrendingUp size={48} />,
      title: 'Progress Tracking',
      description: 'AI-powered reinforcement learning tracks improvement and adapts difficulty levels',
      color: '#A8E6CF',
      delay: '0.1s'
    },
    {
      icon: <Users size={48} />,
      title: 'Parental Guidance',
      description: 'Comprehensive dashboard for parents to monitor and support their child\'s journey',
      color: '#FFD166',
      delay: '0.2s'
    },
    {
      icon: <Globe size={48} />,
      title: 'Accessibility',
      description: 'Designed with inclusivity in mind, supporting children with diverse learning needs',
      color: '#CBAACB',
      delay: '0.3s'
    }
  ];

  const handleStartTraining = () => {
    if (token) {
      navigate('/games');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleDashboard = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F7F7 0%, #E8F5F7 100%)' }}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4" data-testid="hero-section">
        <div className="max-w-6xl mx-auto text-center">
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 fade-in"
            style={{ color: '#6EC1E4', animationDelay: '0.2s' }}
            data-testid="hero-title"
          >
            Learning Through Play,<br />Growing Through Fun!
          </h1>
          <p 
            className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto fade-in"
            style={{ animationDelay: '0.4s' }}
            data-testid="hero-subtitle"
          >
            Empowering children with disabilities through engaging cognitive training games backed by AI and reinforcement learning.
          </p>
          <div className="flex flex-wrap gap-4 justify-center fade-in" style={{ animationDelay: '0.6s' }}>
            <button 
              onClick={handleStartTraining}
              className="btn-primary"
              data-testid="start-training-btn"
            >
              Start Training
            </button>
            <button 
              onClick={handleDashboard}
              className="btn-secondary"
              data-testid="parent-dashboard-btn"
            >
              Parent Dashboard
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20" 
             style={{ background: '#A8E6CF', animation: 'float 3s ease-in-out infinite' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full opacity-20" 
             style={{ background: '#FFD166', animation: 'float 4s ease-in-out infinite', animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 rounded-full opacity-20" 
             style={{ background: '#CBAACB', animation: 'float 5s ease-in-out infinite', animationDelay: '2s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" data-testid="features-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16" style={{ color: '#333' }}>
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover-lift fade-in"
                style={{ animationDelay: feature.delay }}
                data-testid={`feature-card-${index}`}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                  style={{ background: `${feature.color}20`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#333' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center card" style={{ background: 'linear-gradient(135deg, #6EC1E4 0%, #A8E6CF 100%)' }}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Ready to Begin the Journey?
          </h2>
          <p className="text-lg text-white mb-8 opacity-90">
            Join thousands of families already using our platform to support their children's cognitive development.
          </p>
          <button 
            onClick={handleStartTraining}
            className="bg-white px-8 py-4 rounded-full font-bold text-lg hover-scale"
            style={{ color: '#6EC1E4', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            data-testid="cta-button"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default HomePage;