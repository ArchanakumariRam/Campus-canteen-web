import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QueueTicker } from './components/QueueTicker';
import { MenuSection } from './components/MenuSection';
import { CartDrawer } from './components/CartDrawer';
import { TokenModal } from './components/TokenModal';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { api } from './services/api';

export function App() {
  const [dishes, setDishes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [myOrdersModal, setMyOrdersModal] = useState(false);
  const [pastOrders, setPastOrders] = useState([]);
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'signin' });

  // Fetch Dishes from Express REST API
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await api.getMenu();
        if (res.success && res.data) {
          setDishes(res.data);
        }
      } catch (err) {
        console.warn('API error, using default catalog');
      }
    };
    fetchDishes();
  }, []);

  const handleOpenMyOrders = async () => {
    try {
      const res = await api.getOrders();
      if (res.success) setPastOrders(res.data);
    } catch {
      //
    }
    setMyOrdersModal(true);
  };

  return (
    <div className="site-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenOrders={handleOpenMyOrders}
        onOpenAuth={(tab) => setAuthModal({ isOpen: true, tab: tab || 'signin' })}
      />

      <main style={{ flex: 1 }}>
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={() => {
            const menuEl = document.getElementById('menu-controls');
            if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <QueueTicker />

        <MenuSection
          dishes={dishes}
          searchQuery={searchQuery}
        />
      </main>

      <Footer />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        onOrderPlaced={(order) => {
          setPlacedOrder(order);
        }}
        onRequireAuth={() => setAuthModal({ isOpen: true, tab: 'signin' })}
      />

      {/* Auth Modal for Sign In & Sign Up */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialTab={authModal.tab}
        onClose={() => setAuthModal({ isOpen: false, tab: 'signin' })}
      />

      {/* Token Slip Modal */}
      {placedOrder && (
        <TokenModal
          order={placedOrder}
          onClose={() => setPlacedOrder(null)}
        />
      )}

      {/* My Orders Modal */}
      {myOrdersModal && (
        <div className="cart-drawer-overlay open" onClick={() => setMyOrdersModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.6)' }}>
          <div className="token-slip-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540, width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '2rem', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.8rem' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 800 }}>📋 My Recent Orders</h2>
              <button type="button" className="cart-close-btn" onClick={() => setMyOrdersModal(false)}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {pastOrders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No recent orders found on your account.</p>
              ) : (
                pastOrders.map((ord, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#dc2626', fontFamily: 'Syne, sans-serif' }}>{ord.tokenNumber}</span>
                      <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 99, background: ord.status === 'ready' ? '#dcfce7' : '#fef3c7', color: ord.status === 'ready' ? '#16a34a' : '#d97706' }}>
                        {ord.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.4rem' }}>
                      {ord.items?.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
                      <span>Counter {ord.pickupCounter || 2}</span>
                      <strong style={{ color: '#dc2626', fontWeight: 800 }}>₹{ord.totalAmount}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
