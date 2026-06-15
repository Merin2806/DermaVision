import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import api from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentScan, setCurrentScan] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user and history on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('derma_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const fetchHistory = async () => {
      try {
        const response = await api.get('/history');
        setHistory(response.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    fetchHistory();
  }, []);

  // Sync scroll to top on path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogin = async (email, password) => {
    const response = await api.post('/login', { email, password });
    setUser(response.data);
    // Reload history after user login to refresh state
    const histResp = await api.get('/history');
    setHistory(histResp.data);
  };

  const handleSignup = async (name, email, password) => {
    const response = await api.post('/signup', { name, email, password });
    setUser(response.data);
    const histResp = await api.get('/history');
    setHistory(histResp.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('derma_user');
    setUser(null);
  };

  const handleAnalyze = async (imageObj) => {
    try {
      const response = await api.post('/analyze', {
        imageName: imageObj.name,
        imageSize: imageObj.size,
        imageData: imageObj.data
      });
      setCurrentScan(response.data);
      // Pre-add to history list locally immediately
      setHistory(prev => [response.data, ...prev]);
      setTempImage(null);
      // Wait a tiny moment and route to result
      setTimeout(() => {
        navigate('/result');
      }, 500);
    } catch (err) {
      console.error('Analysis failed:', err);
      throw err;
    }
  };

  const handleDeleteScan = (scanId) => {
    const updated = history.filter(s => s.id !== scanId);
    setHistory(updated);
    localStorage.setItem('derma_history', JSON.stringify(updated));
  };

  const handleSelectScan = (scan) => {
    setCurrentScan(scan);
  };

  const handleReset = () => {
    setCurrentScan(null);
    setTempImage(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FBFF]">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-grow pb-16">
        <AppRoutes
          user={user}
          history={history}
          currentScan={currentScan}
          tempImage={tempImage}
          setTempImage={setTempImage}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onAnalyze={handleAnalyze}
          onDeleteScan={handleDeleteScan}
          onSelectScan={handleSelectScan}
          onReset={handleReset}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;
