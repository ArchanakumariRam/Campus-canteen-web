import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CartDrawer = ({ onOrderPlaced, onRequireAuth }) => {
  const {
    cart,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    cookingNotes,
    setCookingNotes,
    pickupCounter,
    setPickupCounter,
    tableNumber,
    setTableNumber
  } = useCart();

  const { currentUser, deductWallet, topupWallet } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isDrawerOpen) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setErrorMsg('');

    if (!currentUser) {
      setErrorMsg('Please sign in to your campus account to complete your order.');
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if ((currentUser.walletBalance || 0) < totalPrice) {
      setErrorMsg(`Insufficient wallet balance (Available: ₹${currentUser.walletBalance || 0}). Please top up your wallet.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          userId: currentUser.userId,
          name: currentUser.name,
          role: currentUser.role,
          studentId: currentUser.studentId
        },
        items: cart.map(i => ({
          itemId: i.itemId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          veg: i.veg
        })),
        totalAmount: totalPrice,
        cookingNotes,
        tableNumber,
        pickupCounter
      };

      const res = await api.placeOrder(orderPayload);
      if (res.success && res.data) {
        deductWallet(totalPrice);
        clearCart();
        setIsDrawerOpen(false);
        onOrderPlaced(res.data);
      } else {
        setErrorMsg(res.message || 'Error placing order');
      }
    } catch {
      // Offline fallback order placement
      const mockOrder = {
        orderId: `ord-${Date.now()}`,
        tokenNumber: `#TK-${Math.floor(100 + Math.random() * 900)}`,
        items: cart,
        totalAmount: totalPrice,
        status: 'pending',
        pickupCounter,
        tableNumber,
        createdAt: new Date()
      };
      deductWallet(totalPrice);
      clearCart();
      setIsDrawerOpen(false);
      onOrderPlaced(mockOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`cart-drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🍽️</span>
            <div>
              <h2 className="cart-drawer-title">Your Food Plate</h2>
              <span className="cart-drawer-subtitle">{cart.length} unique items selected</span>
            </div>
          </div>
          <button type="button" className="cart-drawer-close-btn" onClick={() => setIsDrawerOpen(false)}>✕</button>
        </div>

        <div className="cart-items-scroll">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛒</span>
              <h3>Your plate is currently empty</h3>
              <p style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>Add some delicious food from today's menu to skip the queue!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.itemId} className="cart-item-row">
                <img src={item.image} alt={item.name} className="cart-item-thumb" />
                <div className="cart-item-info">
                  <div className="cart-item-title-row">
                    <span className="cart-item-title">{item.name}</span>
                    <button type="button" className="cart-item-del-btn" onClick={() => removeFromCart(item.itemId)}>🗑️</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                    <div className="food-qty-stepper" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                      <button type="button" className="stepper-btn" onClick={() => updateQuantity(item.itemId, -1)}>−</button>
                      <span className="stepper-value">{item.quantity}</span>
                      <button type="button" className="stepper-btn" onClick={() => updateQuantity(item.itemId, 1)}>+</button>
                    </div>
                    <span className="cart-item-price">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Special Instructions & Pickup Counter */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                👨‍🍳 Kitchen Notes / Customizations:
              </label>
              <input
                type="text"
                placeholder="e.g. Extra spicy, less sugar, no onions..."
                value={cookingNotes}
                onChange={(e) => setCookingNotes(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 0.75rem',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  📍 Pickup Counter:
                </label>
                <select
                  value={pickupCounter}
                  onChange={(e) => setPickupCounter(Number(e.target.value))}
                  className="sort-dropdown"
                  style={{ width: '100%' }}
                >
                  <option value={1}>Counter 1 (Express & Snacks)</option>
                  <option value={2}>Counter 2 (Hot Meals & Kitchen)</option>
                  <option value={3}>Counter 3 (Beverages & Bakery)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  🪑 Dining Option:
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="sort-dropdown"
                  style={{ width: '100%' }}
                >
                  <option value="Counter Pickup">Counter Pickup</option>
                  <option value="Table 1">Dine-in (Table 1)</option>
                  <option value="Table 4">Dine-in (Table 4)</option>
                  <option value="Faculty Lounge">Faculty Lounge</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {errorMsg}
                <button
                  type="button"
                  style={{ display: 'block', marginTop: '0.4rem', color: '#fbbf24', background: 'transparent', border: 'underline', cursor: 'pointer', fontWeight: 700 }}
                  onClick={() => topupWallet(100)}
                >
                  + Add ₹100 to Wallet now
                </button>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="cart-bill-breakdown">
              <div className="bill-row">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span>Campus Subsidized Tax (0%)</span>
                <span style={{ color: '#10b981' }}>₹0.00</span>
              </div>
              <div className="bill-row total-row" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.6rem', marginTop: '0.4rem', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>Final Payable</span>
                <span style={{ color: '#fbbf24' }}>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Wallet Checkout Button */}
            <button
              type="button"
              className="checkout-submit-btn"
              disabled={isSubmitting}
              onClick={handleCheckout}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isSubmitting ? 'Generating Token...' : (!currentUser ? '🔐 Sign In to Order' : `Pay ₹${totalPrice.toFixed(2)} & Get Live Token`)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
