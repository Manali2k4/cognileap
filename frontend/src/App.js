import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '@/App.css';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import GamesPage from '@/pages/GamesPage';
import DashboardPage from '@/pages/DashboardPage';
import FAQPage from '@/pages/FAQPage';
import ReviewsPage from '@/pages/ReviewsPage';
import MemoryGame from '@/pages/games/MemoryGame';
import PuzzleGame from '@/pages/games/PuzzleGame';
import AttentionGame from '@/pages/games/AttentionGame';
import { Toaster } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/children`);
      setChildren(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setChildren([]);
    setSelectedChild(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, children, setChildren, selectedChild, setSelectedChild }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/memory" element={<MemoryGame />} />
            <Route path="/games/puzzle" element={<PuzzleGame />} />
            <Route path="/games/attention" element={<AttentionGame />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
    </AuthContext.Provider>
  );
}

export default App;