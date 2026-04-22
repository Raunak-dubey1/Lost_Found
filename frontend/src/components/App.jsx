import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import UploadItem from './UploadItem';
import ClaimItem from './ClaimItem';
import Login from './Login';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleItemUploaded = () => {
    setRefreshTrigger(prev => prev + 1);
    setCurrentView('dashboard');
  };

  const handleViewUpload = () => {
    setCurrentView('upload');
  };

  const handleViewClaim = () => {
    setCurrentView('claim');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // If no user is logged in, show login screen
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="nav-left">
          <div className="brand-mark">Lost & Found</div>
          <div className="header-nav">
            <button
              className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={handleBackToDashboard}
            >
              Dashboard
            </button>
            <button
              className={`nav-link ${currentView === 'upload' ? 'active' : ''}`}
              onClick={handleViewUpload}
            >
              Report Item
            </button>
            <button
              className={`nav-link ${currentView === 'claim' ? 'active' : ''}`}
              onClick={handleViewClaim}
            >
              Browse Items
            </button>
          </div>
        </div>

        <div className="header-actions">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard onViewUpload={handleViewUpload} onViewClaim={handleViewClaim} user={user} />
        )}
        {currentView === 'upload' && (
          <UploadItem onItemUploaded={handleItemUploaded} user={user} />
        )}
        {currentView === 'claim' && (
          <ClaimItem refreshTrigger={refreshTrigger} user={user} />
        )}
      </div>

      <footer className="app-footer">
        <p>&copy; 2026 Lost & Found. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
