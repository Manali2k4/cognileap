import React from 'react';
import Navigation from '@/components/Navigation';
import { Target, Heart, Lightbulb, Users } from 'lucide-react';

const AboutPage = () => {
  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Clinical Psychologist', avatar: '👩‍⚕️' },
    { name: 'Dr. Michael Chen', role: 'AI Researcher', avatar: '👨‍💻' },
    { name: 'Emily Rodriguez', role: 'Education Specialist', avatar: '👩‍🏫' },
    { name: 'David Kim', role: 'UX Designer', avatar: '👨‍🎨' }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F7F7 0%, #E8F5F7 100%)' }}>
      <Navigation />
      
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 fade-in" data-testid="about-header">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: '#6EC1E4' }}>
              About CogniLeap
            </h1>
            <p className="text-lg text-gray-600">
              Transforming cognitive training through technology and compassion
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="card fade-in" style={{ animationDelay: '0.2s' }} data-testid="mission-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#6EC1E420' }}>
                  <Target size={24} style={{ color: '#6EC1E4' }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#333' }}>Our Mission</h2>
              </div>
              <p className="text-gray-600">
                To provide accessible, engaging, and effective cognitive training tools that empower children with disabilities to reach their full potential through the power of play and AI-driven personalization.
              </p>
            </div>

            <div className="card fade-in" style={{ animationDelay: '0.3s' }} data-testid="vision-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#A8E6CF20' }}>
                  <Lightbulb size={24} style={{ color: '#A8E6CF' }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#333' }}>Our Vision</h2>
              </div>
              <p className="text-gray-600">
                A world where every child, regardless of their abilities, has access to cutting-edge cognitive training that adapts to their unique needs and celebrates their progress.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="card mb-16 fade-in" style={{ animationDelay: '0.4s' }} data-testid="story-section">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FFD16620' }}>
                <Heart size={24} style={{ color: '#FFD166' }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#333' }}>Our Story</h2>
            </div>
            <p className="text-gray-600 mb-4">
              CogniLeap was born from a simple observation: traditional cognitive training methods weren't engaging enough for children, especially those with learning disabilities. We knew there had to be a better way.
            </p>
            <p className="text-gray-600 mb-4">
              Our multidisciplinary team of psychologists, educators, AI researchers, and designers came together to create a platform that combines the latest advances in reinforcement learning with child-friendly game design.
            </p>
            <p className="text-gray-600">
              The result? A system that not only tracks progress but actively adapts to each child's learning style, celebrates small victories, and turns cognitive training into an adventure they look forward to every day.
            </p>
          </div>

          {/* Team */}
          <div className="fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#CBAACB20' }}>
                <Users size={24} style={{ color: '#CBAACB' }} />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: '#333' }}>Meet Our Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="team-section">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="card hover-lift text-center"
                  data-testid={`team-member-${index}`}
                >
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#333' }}>{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;