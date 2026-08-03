import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Invitation from './pages/Invitation';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function AppContent() {
  const { currentUser } = useAppContext();

  // Helper to extract clean path supporting both browser pathnames and hash fallbacks
  const getRoutePath = () => {
    const hash = window.location.hash; // e.g. '#/admin' or '#admin'
    const pathname = window.location.pathname; // e.g. '/admin'
    
    if (hash === '#/admin' || hash === '#admin') {
      return '/admin';
    }
    return pathname;
  };

  const [currentPath, setCurrentPath] = useState(getRoutePath());

  // Monitor URL pathname and hash changes (SPA routing)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getRoutePath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('navigate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
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
