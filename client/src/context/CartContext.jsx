import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('rit_canteen_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cookingNotes, setCookingNotes] = useState('');
  const [pickupCounter, setPickupCounter] = useState(1);
  const [tableNumber, setTableNumber] = useState('Counter Pickup');

  useEffect(() => {
    localStorage.setItem('rit_canteen_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.itemId === dish.itemId);
      if (existing) {
        return prev.map(item =>
          item.itemId === dish.itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, change) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.itemId === itemId) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.itemId !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setCookingNotes('');
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        totalPrice,
        cookingNotes,
        setCookingNotes,
        pickupCounter,
        setPickupCounter,
        tableNumber,
        setTableNumber
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
