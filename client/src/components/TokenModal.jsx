import React from 'react';

export const TokenModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="cart-drawer-overlay open" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="token-slip-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460, width: '100%', background: 'rgba(12, 14, 36, 0.96)', border: '1px solid rgba(139, 92, 246, 0.45)', borderRadius: 'var(--radius-xl)', padding: '2.4rem 2rem', textAlign: 'center', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 50px rgba(139, 92, 246, 0.3)' }}>
        
        <div style={{ fontSize: '3.2rem', marginBottom: '0.5rem', animation: 'heartPulse 1.2s infinite' }}>🎉</div>
        <span className="footer-dev-badge-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#34d399', marginBottom: '0.8rem', display: 'inline-block' }}>
          Payment Verified • Token Generated
        </span>

        <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.4rem' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Present this token slip or scan the QR at the pickup counter when your number is called.
        </p>

        {/* Live Token Slip Box */}
        <div style={{ background: 'rgba(0, 0, 0, 0.45)', border: '2px dashed rgba(139, 92, 246, 0.4)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-subtle)', fontWeight: 700 }}>
            Pickup Counter {order.pickupCounter || 2}
          </span>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#67e8f9', margin: '0.4rem 0', fontFamily: 'Syne, sans-serif', textShadow: '0 0 20px rgba(6, 182, 212, 0.6)' }}>
            {order.tokenNumber}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>
            Estimated Prep: 6-8 Mins
          </span>

          {/* SVG QR Code Simulation */}
          <div style={{ margin: '1.2rem auto 0.6rem', width: 110, height: 110, background: '#fff', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="94" height="94" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="1" fill="#060713" />
              <rect x="4" y="4" width="4" height="4" fill="#fff" />
              <rect x="14" y="2" width="8" height="8" rx="1" fill="#060713" />
              <rect x="16" y="4" width="4" height="4" fill="#fff" />
              <rect x="2" y="14" width="8" height="8" rx="1" fill="#060713" />
              <rect x="4" y="16" width="4" height="4" fill="#fff" />
              <rect x="12" y="12" width="3" height="3" fill="#060713" />
              <rect x="16" y="14" width="4" height="2" fill="#060713" />
              <rect x="14" y="18" width="6" height="4" fill="#060713" />
            </svg>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Order ID: {order.orderId}</span>
        </div>

        {/* Order Items Preview */}
        <div style={{ textAlign: 'left', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem' }}>
            Items ({order.items?.length || 0}):
          </div>
          {order.items?.map((it, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#f8fafc', padding: '0.2rem 0' }}>
              <span>{it.quantity}x {it.name}</span>
              <span style={{ fontWeight: 700 }}>₹{it.price * it.quantity}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#fbbf24', fontWeight: 800, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
            <span>Total Paid (Meal Wallet)</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <button
          type="button"
          className="search-cta-btn"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onClose}
        >
          Track on Live Queue Board
        </button>
      </div>
    </div>
  );
};
