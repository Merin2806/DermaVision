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
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Restore user session and fetch scan history on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('derma_token');
      if (token) {
        try {
          // Fetch authenticated user details
          const userResp = await api.get('/auth/me');
          setUser(userResp.data);

          // Fetch user's saved scans
          const histResp = await api.get('/history');
          setHistory(histResp.data);
        } catch (err) {
          console.error('Failed to restore session:', err);
          // Clear invalid token
          localStorage.removeItem('derma_token');
          setUser(null);
        }
      }
      setLoadingSession(false);
    };

    restoreSession();
  }, []);

  // Sync scroll to top on path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogin = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, id, name } = response.data;
    localStorage.setItem('derma_token', token);
    setUser({ id, name, email });
    
    // Reload history after user login to refresh state
    const histResp = await api.get('/history');
    setHistory(histResp.data);
  };

  const handleSignup = async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    const { token, id } = response.data;
    localStorage.setItem('derma_token', token);
    setUser({ id, name, email });
    setHistory([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('derma_token');
    setUser(null);
    setHistory([]);
    navigate('/');
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

  const handleDeleteScan = async (scanId) => {
    try {
      await api.delete(`/history/${scanId}`);
      const updated = history.filter(s => s.id !== scanId);
      setHistory(updated);
    } catch (err) {
      console.error('Failed to delete scan:', err);
    }
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
          loadingSession={loadingSession}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;
