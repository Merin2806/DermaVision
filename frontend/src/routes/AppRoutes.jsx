import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Screen from '../pages/Screen/Screen';
import Loading from '../pages/Loading/Loading';
import Result from '../pages/Result/Result';
import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import About from '../pages/About/About';
import Terms from '../pages/Terms/Terms';

const AppRoutes = ({
  user,
  history,
  currentScan,
  tempImage,
  setTempImage,
  onLogin,
  onSignup,
  onAnalyze,
  onDeleteScan,
  onSelectScan,
  onReset,
  loadingSession,
}) => {
  // Show spinner during session recovery
  if (loadingSession) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F7FBFF]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Helper for Route Protection
  const Protected = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  // Helper to redirect logged-in users away from Auth pages
  const PublicOnly = ({ children }) => {
    return !user ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route 
        path="/screen" 
        element={
          <Protected>
            <Screen 
              tempImage={tempImage}
              setTempImage={setTempImage}
              onAnalyze={onAnalyze}
            />
          </Protected>
        } 
      />
      
      <Route 
        path="/loading" 
        element={
          <Protected>
            <Loading />
          </Protected>
        } 
      />
      
      <Route 
        path="/result" 
        element={
          <Protected>
            <Result 
              currentScan={currentScan}
              onReset={onReset}
            />
          </Protected>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <Protected>
            <Dashboard 
              user={user}
              history={history}
              onDeleteScan={onDeleteScan}
              onSelectScan={onSelectScan}
            />
          </Protected>
        } 
      />
      
      <Route 
        path="/login" 
        element={
          <PublicOnly>
            <Login onLogin={onLogin} />
          </PublicOnly>
        } 
      />
      
      <Route 
        path="/signup" 
        element={
          <PublicOnly>
            <Signup onSignup={onSignup} />
          </PublicOnly>
        } 
      />
      
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
