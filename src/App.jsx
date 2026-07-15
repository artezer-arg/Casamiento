import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Invitation from './pages/Invitation';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function AppContent() {
  const { currentUser } = useAppContext();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Monitor URL pathname changes (SPA routing)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    
    // Custom event listener for programmatic router navigation
    window.addEventListener('navigate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('navigate', handleLocationChange);
    };
  }, []);

  // Simple SPA routing
  if (currentPath === '/admin') {
    return currentUser ? <AdminPanel /> : <AdminLogin />;
  }

  return <Invitation />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
