import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TraderList from './pages/TraderList';
import TraderDetail from './pages/TraderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TraderList />} />
        <Route path="/trader/:id" element={<TraderDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
