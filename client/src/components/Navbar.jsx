import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export const Navbar = ({ onOpenOrders, onOpenAuth }) => {
  const { currentUser, logout } = useAuth();
  const { totalCount, setIsDrawerOpen } = useCart();
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [queueData, setQueueData] = useState({ callingToken: '#TK-101 (Counter 2)', waitingCount: 2, estWaitTime: '~6-10 Mins' });

  // Poll live queue metrics periodically
  useEffect(() => {
    let isMounted = true;
    const fetchQueue = async () => {
      try {
        const res = await api.getLiveQueue();
        if (isMounted && res.success && res.data) {
          setQueueData(res.data);
        }
      } catch {
        // quiet fallback
      }
    };
    fetchQueue();
    const interval = setInterval(fetchQueue, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Top Campus Info Bar */}
      <aside className="top-info-banner" aria-label="Campus Information & Customer Preview">
        <div className="top-info-inner">
          <div className="top-info-left">
            <span className="campus-loc-icon">📍</span>
            <span className="top-campus-text"><strong>Rajarambapu Institute of Technology</strong> • Cafeteria</span>
            <span className="top-divider">|</span>
            <span className="top-time-text">⏰ 7:30 AM – 9:00 PM</span>
          </div>

          <div className="top-info-right" style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            {/* Live Waiting Queue Indicator in Top Banner */}
            <div
              className="nav-live-queue-pill"
              onClick={() => {
                const el = document.getElementById('queue-ticker-section') || document.getElementById('menu-controls');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Live Queue status - click to inspect queue board"
            >
              <span className="nav-live-queue-dot"></span>
              <span>Calling: <strong style={{ color: '#d9232d' }}>{queueData?.callingToken || '#TK-101'}</strong></span>
              <span style={{ opacity: 0.6 }}>|</span>
              <span>{queueData?.waitingCount || 0} Waiting ({queueData?.estWaitTime || '8m'})</span>
            </div>

            <div className="top-helpline">
              <span>Helpline:</span>
              <strong>+91 2342 220 329</strong>
            </div>

            {/* Link to Dedicated Separate Admin / Staff Portal */}
            <a
              href="/admin.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(217, 35, 45, 0.1)',
                border: '1px solid rgba(217, 35, 45, 0.3)',
                color: '#d9232d',
                borderRadius: '6px',
                padding: '0.22rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              title="Open Separate Staff Operations & Kitchen KDS Portal in new tab"
            >
              ⚙️ Staff Portal ↗
            </a>
          </div>
        </div>
      </aside>

      {/* Main Header (Brand, Wallet, Cart, Profile) */}
      <header className="header-main-bar">
        <div className="header-inner">
          <div
            className="header-brand-box"
            style={{ cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Click to go to top"
          >
            <div className="brand-red-badge">
              <span className="brand-badge-main">RIT CANTEEN</span>
            </div>
            <span className="brand-institution">RAJARAMBAPU INSTITUTE OF TECHNOLOGY</span>
          </div>

          {/* Centered Live Queue Ticker in Header Bar */}
          <div
            className="header-live-queue-center"
            onClick={() => {
              const el = document.getElementById('queue-ticker-section') || document.getElementById('menu-controls');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Live Dining Hall Queue - Click to inspect active queue"
          >
            <span className="header-queue-dot"></span>
            <div className="header-queue-info">
              <span className="header-queue-sub">LIVE KITCHEN DISPATCH</span>
              <div className="header-queue-tokens">
                <span className="header-queue-call">Calling: <strong>{queueData?.callingToken || '#TK-101'}</strong></span>
                <span className="header-queue-divider">•</span>
                <span className="header-queue-wait">{queueData?.waitingCount || 0} Waiting ({queueData?.estWaitTime || '8m'})</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            {/* Cart / Plate Drawer Trigger */}
            <button
              type="button"
              className="cart-toggle-btn"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="View Cart"
            >
              <span className="cart-icon-graphic">🛒</span>
              <div className="cart-info-col">
                <span className="cart-label-text">My Plate</span>
                <span className="cart-badge-count">{totalCount}</span>
              </div>
            </button>

            {/* User Profile or Guest Actions */}
            {currentUser ? (
              <div className="user-profile-wrapper">
                <div className="user-profile-menu">
                  <img src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Avatar" className="user-avatar-img" />
                  <div className="user-profile-info">
                    <span className="user-profile-name">{currentUser.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="user-profile-role-badge">{currentUser.role?.toUpperCase()}</span>
                      <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 800 }}>₹{currentUser.walletBalance ?? 0}</span>
                    </div>
                  </div>
                </div>
                <button type="button" className="user-logout-btn" onClick={logout} title="Log out">
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="guest-auth-actions">
                <button
                  type="button"
                  className="nav-guest-btn nav-signin-btn"
                  onClick={() => onOpenAuth && onOpenAuth('signin')}
                >
                  🔐 Sign In
                </button>
                <button
                  type="button"
                  className="nav-guest-btn nav-signup-btn"
                  onClick={() => onOpenAuth && onOpenAuth('signup')}
                >
                  ✨ Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Crimson Red Navigation Bar */}
      <nav className="crimson-navbar">
        <div className="crimson-nav-inner">
          {/* Left: Category Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              className="nav-cat-dropdown-btn"
              onClick={() => {
                setIsCatOpen(!isCatOpen);
                const el = document.getElementById('menu-controls');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Click to browse food categories"
            >
              <span className="nav-hamburger">☰</span>
              <span className="nav-cat-text">Categories</span>
              <span className="nav-caret">{isCatOpen ? '▲' : '▼'}</span>
            </div>

            {/* Quick Categories Floating Dropdown */}
            {isCatOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '0.4rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  padding: '0.5rem',
                  minWidth: '220px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
              >
                {[
                  { id: 'all', label: '🍽️ All Dishes' },
                  { id: 'breakfast', label: '🍳 Breakfast Specials' },
                  { id: 'snacks', label: '🥟 Snacks & Chaat' },
                  { id: 'meals', label: '🍛 Lunch & Thalis' },
                  { id: 'fastfood', label: '🍔 Burgers & Pizzas' },
                  { id: 'beverages', label: '☕ Hot & Cold Drinks' },
                  { id: 'desserts', label: '🍯 Desserts & Sweets' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => {
                      setIsCatOpen(false);
                      const el = document.getElementById('menu-controls');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Middle: Centered Navigation Links */}
          <div className="crimson-nav-links">
            <button
              type="button"
              className="crimson-nav-btn active"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Return to top of page"
            >
              Home
            </button>
            <a href="#about-canteen" className="crimson-nav-link">About Us</a>
            <a href="#menu-controls" className="crimson-nav-link">Products</a>
            <a href="#special-offers" className="crimson-nav-link">Special Offers</a>
            <button type="button" className="crimson-nav-btn" onClick={onOpenOrders}>
              📋 My Orders
            </button>
            <a href="#site-footer" className="crimson-nav-link">Contact Us</a>
          </div>

          {/* Right: Live Queue Pill + My Plate Sticky Button */}
          <div className="crimson-nav-right">
            {/* Live Queue Chip inside Crimson Navbar */}
            <div
              className="crimson-live-queue-chip"
              onClick={() => {
                const el = document.getElementById('queue-ticker-section') || document.getElementById('menu-controls');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Live Counter & Kitchen Queue - Click to inspect"
            >
              <span className="queue-chip-indicator"></span>
              <div className="queue-chip-content">
                <span className="queue-chip-lbl">LIVE QUEUE</span>
                <strong className="queue-chip-tok">{queueData?.callingToken || '#TK-101'}</strong>
                <span className="queue-chip-wait">({queueData?.waitingCount || 0} waiting)</span>
              </div>
            </div>

            {/* Sticky Navbar Plate / Cart Button */}
            <button
              type="button"
              className="nav-plate-sticky-btn"
              onClick={() => setIsDrawerOpen(true)}
              title="View Food Plate / Cart"
            >
              <span className="plate-icon-anim">🍽️</span>
              <span className="plate-text-label">My Plate</span>
              <span className="plate-count-badge">{totalCount}</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
