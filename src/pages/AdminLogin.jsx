import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { AlertCircle, Lock, Mail, Loader } from 'lucide-react';

export default function AdminLogin() {
  const { login, currentUser, loading } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor, completá todos los campos.');
      return;
    }

    setIsLoggingIn(true);
    setError('');

    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Error de inicio de sesión. Verificá tus datos.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="admin-login-layout">
      <div className="admin-login-box animate-fade-in-up">
        {/* Gold lock icon */}
        <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <Lock size={36} strokeWidth={1.5} />
        </div>

        <div>
          <h2 className="admin-login-logo">Panel de Control</h2>
          <p className="admin-login-subtitle">Acceso Administrador</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label className="admin-label" htmlFor="login-email">Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                id="login-email" 
                className="admin-input" 
                style={{ width: '100%', paddingLeft: '2.5rem' }} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label className="admin-label" htmlFor="login-password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                id="login-password" 
                className="admin-input" 
                style={{ width: '100%', paddingLeft: '2.5rem' }} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader size={18} className="animate-spin-slow" style={{ marginRight: '0.5rem' }} />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
        
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem' }}>
          Solo los novios Nestor y Pame tienen acceso de edición a esta invitación.
        </p>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
