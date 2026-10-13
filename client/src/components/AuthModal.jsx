import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, initialTab = 'signin' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'signin' | 'signup'
  const { login, register } = useAuth();

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sign Up State
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [role, setRole] = useState('student');
  const [regNo, setRegNo] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [signupError, setSignupError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        onClose();
      } else {
        setLoginError(res.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setLoginError('Authentication service is currently unavailable.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setIsSigningUp(true);
    try {
      const res = await register({
        name,
        email: signupEmail,
        password: signupPassword,
        role,
        regNo,
        department
      });
      if (res.success) {
        onClose();
      } else {
        setSignupError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setSignupError('Registration service is currently unavailable.');
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="cart-drawer-overlay open" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 1200 }}>
      <div
        className="auth-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeInModal 0.25s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ background: '#d9232d', color: '#ffffff', padding: '1.25rem 1.5rem', position: 'relative' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '1rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 800
            }}
          >
            ✕
          </button>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fca5a5' }}>
            Rajarambapu Institute of Technology
          </div>
          <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.45rem', fontWeight: 900, color: '#ffffff' }}>
            {activeTab === 'signin' ? 'Sign In to Canteen' : 'Create Student / Faculty Account'}
          </h2>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setLoginError(''); }}
            style={{
              flex: 1,
              padding: '0.9rem',
              border: 'none',
              borderBottom: activeTab === 'signin' ? '3px solid #d9232d' : '3px solid transparent',
              background: activeTab === 'signin' ? '#ffffff' : 'transparent',
              color: activeTab === 'signin' ? '#d9232d' : '#64748b',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🔐 Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setSignupError(''); }}
            style={{
              flex: 1,
              padding: '0.9rem',
              border: 'none',
              borderBottom: activeTab === 'signup' ? '3px solid #d9232d' : '3px solid transparent',
              background: activeTab === 'signup' ? '#ffffff' : 'transparent',
              color: activeTab === 'signup' ? '#d9232d' : '#64748b',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ✨ Sign Up
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {activeTab === 'signin' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loginError && (
                <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚠️ {loginError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Campus Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@campus.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.9rem',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#d9232d')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.9rem',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#d9232d')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                style={{
                  background: '#d9232d',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                  marginTop: '0.5rem',
                  transition: 'background 0.2s',
                  boxShadow: '0 4px 12px rgba(217, 35, 45, 0.3)'
                }}
              >
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.88rem', color: '#64748b' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setLoginError(''); }}
                  style={{ color: '#d9232d', background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {signupError && (
                <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚠️ {signupError}
                </div>
              )}

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                🎁 Bonus: New accounts receive ₹250 instant digital meal wallet credit!
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Campus Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.patil@campus.edu"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty / Staff</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                    {role === 'student' ? 'PRN / Roll No' : 'Employee ID'}
                  </label>
                  <input
                    type="text"
                    placeholder={role === 'student' ? 'e.g. 2024CS099' : 'e.g. EMP-204'}
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Department / Branch
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science / Mechanical"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                style={{
                  background: '#d9232d',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: isSigningUp ? 'not-allowed' : 'pointer',
                  marginTop: '0.4rem',
                  transition: 'background 0.2s',
                  boxShadow: '0 4px 12px rgba(217, 35, 45, 0.3)'
                }}
              >
                {isSigningUp ? 'Creating Account...' : 'Complete Sign Up'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.4rem', fontSize: '0.88rem', color: '#64748b' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setSignupError(''); }}
                  style={{ color: '#d9232d', background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                >
                  Sign In instead
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
