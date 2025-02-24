// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TraderList from './pages/TraderList';
import TraderDetail from './pages/TraderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Navbar from './components/Navbar';
import { getTheme } from './theme';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');
  const theme = getTheme(mode);

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return (
    <Router>
      <Navbar toggleMode={toggleMode} mode={mode} />
      <Routes>
        <Route path="/" element={<TraderList />} />
        <Route path="/trader/:id" element={<TraderDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
