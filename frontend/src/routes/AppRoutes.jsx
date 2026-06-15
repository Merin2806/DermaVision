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
}) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route 
        path="/screen" 
        element={
          <Screen 
            tempImage={tempImage}
            setTempImage={setTempImage}
            onAnalyze={onAnalyze}
          />
        } 
      />
      
      <Route path="/loading" element={<Loading />} />
      
      <Route 
        path="/result" 
        element={
          <Result 
            currentScan={currentScan}
            onReset={onReset}
          />
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <Dashboard 
            user={user}
            history={history}
            onDeleteScan={onDeleteScan}
            onSelectScan={onSelectScan}
          />
        } 
      />
      
      <Route 
        path="/login" 
        element={<Login onLogin={onLogin} />} 
      />
      
      <Route 
        path="/signup" 
        element={<Signup onSignup={onSignup} />} 
      />
      
      <Route path="/about" element={<About />} />
      
      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
