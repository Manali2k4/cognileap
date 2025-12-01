import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, X } from 'lucide-react';

const Navigation = () => {
  const { token, logout, user, selectedChild } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/games', label: 'Games' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/faq', label: 'FAQ' },
    { to: '/reviews', label: 'Reviews' }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
      data-testid="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover-scale" data-testid="logo-link">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl"
              style={{ background: 'linear-gradient(135deg, #6EC1E4 0%, #A8E6CF 100%)', color: 'white' }}
            >
              CL
            </div>
            <span className="text-2xl font-bold" style={{ color: '#6EC1E4', fontFamily: 'Nunito' }}>
              CogniLeap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-semibold hover:scale-105 transition-transform"
                style={{ color: '#333' }}
                data-testid={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Info & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <>
                {selectedChild && (
                  <div 
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: '#A8E6CF20', color: '#A8E6CF' }}
                    data-testid="selected-child-badge"
                  >
                    {selectedChild.name}
                  </div>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2"
                  data-testid="logout-btn"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#6EC1E420' }}>
                <User size={20} style={{ color: '#6EC1E4' }} />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3" data-testid="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-semibold"
                style={{ color: '#333' }}
                data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
            {token && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                data-testid="mobile-logout-btn"
              >
                <LogOut size={16} />
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;