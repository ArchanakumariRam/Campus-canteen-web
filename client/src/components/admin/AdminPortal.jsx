import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export const AdminPortal = () => {
  const STAFF_STORAGE_KEY = 'rit_staff_auth_user';

  // Dedicated isolated Staff Authentication session in localStorage
  const [staffUser, setStaffUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STAFF_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem(STAFF_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      return !!(parsed && (parsed.role === 'admin' || parsed.role === 'kitchen'));
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState('kds'); // 'kds', 'orders', 'users', 'menu', 'overview'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data states
  const [kpis, setKpis] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);

  // Login form states (for unauthenticated staff)
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Orders Tab filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Users Tab filters & creation modal
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('campus123');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserRegNo, setNewUserRegNo] = useState('');
  const [newUserDept, setNewUserDept] = useState('Computer Science & Engineering');
  const [newUserWallet, setNewUserWallet] = useState(500);
  const [addUserMsg, setAddUserMsg] = useState({ error: '', success: '' });

  // Menu Tab filters & creation modal
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('all');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('meals');
  const [newDishPrice, setNewDishPrice] = useState(120);
  const [newDishVeg, setNewDishVeg] = useState(true);
  const [newDishPrepTime, setNewDishPrepTime] = useState('8-10m');
  const [newDishImage, setNewDishImage] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [addDishMsg, setAddDishMsg] = useState({ error: '', success: '' });

  // Load all portal data
  const loadData = async () => {
    try {
      const [kpiRes, ordersRes, menuRes, usersRes] = await Promise.all([
        api.getKPIs(),
        api.getOrders(),
        api.getMenu(),
        api.getUsers()
      ]);
      if (kpiRes.success) setKpis(kpiRes.data);
      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (menuRes.success) setMenuItems(menuRes.data || []);
      if (usersRes.success) setUsers(usersRes.data || []);
    } catch {
      // quiet fallback
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await loadData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleStaffLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.login(emailInput, passwordInput);
      if (res.success && res.data) {
        if (res.data.role !== 'admin' && res.data.role !== 'kitchen') {
          setLoginError('Access denied: Staff or Kitchen management role required.');
          return;
        }
        setStaffUser(res.data);
        localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(res.data));
        setIsLoggedIn(true);
      } else {
        setLoginError(res.message || 'Invalid credentials.');
      }
    } catch {
      setLoginError('Authentication service is currently unavailable.');
    }
  };

  const handleStaffLogout = () => {
    setIsLoggedIn(false);
    setStaffUser(null);
    localStorage.removeItem(STAFF_STORAGE_KEY);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
    } catch {
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const handleToggleStock = async (itemId, currentStock) => {
    try {
      await api.toggleDishStock(itemId, !currentStock);
      setMenuItems(prev => prev.map(m => m.itemId === itemId ? { ...m, inStock: !currentStock } : m));
    } catch {
      setMenuItems(prev => prev.map(m => m.itemId === itemId ? { ...m, inStock: !currentStock } : m));
    }
  };

  const handleCreditWallet = async (userId, amount = 100) => {
    try {
      const res = await api.topupWallet(userId, amount);
      const newBal = res.walletBalance;
      setUsers(prev => prev.map(u => u.userId === userId ? { ...u, walletBalance: newBal !== undefined ? newBal : (u.walletBalance || 0) + amount } : u));
    } catch {
      setUsers(prev => prev.map(u => u.userId === userId ? { ...u, walletBalance: (u.walletBalance || 0) + amount } : u));
    }
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setAddUserMsg({ error: '', success: '' });
    try {
      const res = await api.addUser({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
        regNo: newUserRegNo,
        department: newUserDept,
        walletBalance: Number(newUserWallet)
      });
      if (res.success) {
        setAddUserMsg({ error: '', success: 'User registered successfully!' });
        loadData();
        setTimeout(() => {
          setIsAddUserModalOpen(false);
          setNewUserName('');
          setNewUserEmail('');
          setNewUserRegNo('');
          setAddUserMsg({ error: '', success: '' });
        }, 800);
      } else {
        setAddUserMsg({ error: res.message || 'Failed to add user', success: '' });
      }
    } catch {
      setAddUserMsg({ error: 'Server error adding user', success: '' });
    }
  };

  const handleAddDishSubmit = async (e) => {
    e.preventDefault();
    setAddDishMsg({ error: '', success: '' });
    try {
      const res = await api.addDish({
        name: newDishName,
        category: newDishCategory,
        price: Number(newDishPrice),
        veg: newDishVeg,
        prepTime: newDishPrepTime,
        image: newDishImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
        description: newDishDesc
      });
      if (res.success) {
        setAddDishMsg({ error: '', success: 'Dish added to menu catalog!' });
        loadData();
        setTimeout(() => {
          setIsAddDishModalOpen(false);
          setNewDishName('');
          setNewDishDesc('');
          setNewDishImage('');
          setAddDishMsg({ error: '', success: '' });
        }, 800);
      } else {
        setAddDishMsg({ error: res.message || 'Failed to add dish', success: '' });
      }
    } catch {
      setAddDishMsg({ error: 'Server error adding dish', success: '' });
    }
  };

  // If not logged in, render the Staff Login Card
  if (!isLoggedIn) {
    return (
      <main className="staff-auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0b0f19' }}>
        <div className="staff-login-card" style={{ maxWidth: 440, width: '100%', background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(217, 35, 45, 0.15)', border: '1px solid rgba(217, 35, 45, 0.4)', color: '#f87171', padding: '0.35rem 0.8rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.2rem' }}>
            🔒 Staff & Operations HQ
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#ffffff', fontWeight: 900 }}>Cafeteria Staff Login</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '1.8rem', lineHeight: 1.5 }}>
            Access the Live Kitchen Display (KDS), orders dispatch, registered campus users, and sales telemetry.
          </p>

          {loginError && (
            <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', color: '#fecaca', padding: '0.7rem 0.9rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem', textAlign: 'left', fontWeight: 600 }}>
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleStaffLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#d1d5db', display: 'block', marginBottom: '0.35rem', fontWeight: 700 }}>
                Staff Email:
              </label>
              <input
                type="email"
                required
                placeholder="e.g. admin@campus.edu or kitchen@campus.edu"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#d1d5db', display: 'block', marginBottom: '0.35rem', fontWeight: 700 }}>
                Password:
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              style={{ background: '#d9232d', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.85rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem', transition: 'background 0.2s' }}
            >
              🔑 Enter Management Portal
            </button>
          </form>

          <div style={{ marginTop: '1.8rem', borderTop: '1px solid #1f2937', paddingTop: '1.2rem' }}>
            <a
              href="/"
              style={{ color: '#93c5fd', fontSize: '0.88rem', textDecoration: 'underline', fontWeight: 600 }}
            >
              ← Back to Student Canteen Site
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Group orders for KDS
  const queueOrders = orders.filter(o => o.status === 'pending');
  const cookingOrders = orders.filter(o => o.status === 'cooking');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const completedOrders = orders.filter(o => o.status === 'completed');

  // Filtered Orders for the Orders Tab
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = !orderSearch ||
      (o.tokenNumber && o.tokenNumber.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.customer?.studentId && o.customer.studentId.toLowerCase().includes(orderSearch.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Filtered Users for the Users Tab
  const filteredUsers = users.filter(u => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesSearch = !userSearch ||
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.studentId && u.studentId.toLowerCase().includes(userSearch.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  // Filtered Dishes for Menu Tab
  const filteredMenuItems = menuItems.filter(m => {
    const matchesCat = menuCategoryFilter === 'all' || m.category === menuCategoryFilter;
    const matchesSearch = !menuSearch ||
      (m.name && m.name.toLowerCase().includes(menuSearch.toLowerCase())) ||
      (m.category && m.category.toLowerCase().includes(menuSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f3f4f6', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* ======================================================================
          EXECUTIVE ADMIN NAVBAR
          ====================================================================== */}
      <header
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid rgba(220, 38, 38, 0.3)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
        }}
      >
        <div
          style={{
            maxWidth: 1600,
            margin: '0 auto',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          {/* Left: Brand & Operations Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
            <a
              href="/"
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}
              title="Click to view Customer Website"
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #d9232d 0%, #991b1b 100%)',
                  color: '#ffffff',
                  fontWeight: 900,
                  borderRadius: '9px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '1rem',
                  letterSpacing: '0.04em',
                  boxShadow: '0 4px 14px rgba(217, 35, 45, 0.4)'
                }}
              >
                RIT CANTEEN
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                    Operations HQ
                  </span>
                  <span
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#fca5a5',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 4,
                      fontSize: '0.68rem',
                      fontWeight: 800
                    }}
                  >
                    ADMIN
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Rajarambapu Institute of Technology
                </span>
              </div>
            </a>
          </div>

          {/* Middle: Centered Navigation Tabs */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              margin: '0 auto',
              background: 'rgba(30, 41, 59, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '0.25rem 0.35rem',
              borderRadius: '99px',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
              flexShrink: 0
            }}
          >
            {/* Kitchen KDS Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('kds')}
              style={{
                background: activeTab === 'kds' ? 'linear-gradient(135deg, #d9232d 0%, #b91c1c 100%)' : 'transparent',
                color: activeTab === 'kds' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '99px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: activeTab === 'kds' ? '0 4px 14px rgba(217, 35, 45, 0.45)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>👨‍🍳 KDS</span>
              <span
                style={{
                  background: activeTab === 'kds' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  borderRadius: 99,
                  padding: '0.08rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}
              >
                {queueOrders.length + cookingOrders.length}
              </span>
            </button>

            {/* All Orders Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              style={{
                background: activeTab === 'orders' ? 'linear-gradient(135deg, #d9232d 0%, #b91c1c 100%)' : 'transparent',
                color: activeTab === 'orders' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '99px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: activeTab === 'orders' ? '0 4px 14px rgba(217, 35, 45, 0.45)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>📋 Orders</span>
              <span
                style={{
                  background: activeTab === 'orders' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  borderRadius: 99,
                  padding: '0.08rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}
              >
                {orders.length}
              </span>
            </button>

            {/* Users & Wallets Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              style={{
                background: activeTab === 'users' ? 'linear-gradient(135deg, #d9232d 0%, #b91c1c 100%)' : 'transparent',
                color: activeTab === 'users' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '99px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: activeTab === 'users' ? '0 4px 14px rgba(217, 35, 45, 0.45)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>👥 Users</span>
              <span
                style={{
                  background: activeTab === 'users' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  borderRadius: 99,
                  padding: '0.08rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}
              >
                {users.length}
              </span>
            </button>

            {/* Menu Stock Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              style={{
                background: activeTab === 'menu' ? 'linear-gradient(135deg, #d9232d 0%, #b91c1c 100%)' : 'transparent',
                color: activeTab === 'menu' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '99px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: activeTab === 'menu' ? '0 4px 14px rgba(217, 35, 45, 0.45)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>🍽️ Menu</span>
              <span
                style={{
                  background: activeTab === 'menu' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  borderRadius: 99,
                  padding: '0.08rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}
              >
                {menuItems.length}
              </span>
            </button>

            {/* Analytics & KPIs Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              style={{
                background: activeTab === 'overview' ? 'linear-gradient(135deg, #d9232d 0%, #b91c1c 100%)' : 'transparent',
                color: activeTab === 'overview' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '99px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: activeTab === 'overview' ? '0 4px 14px rgba(217, 35, 45, 0.45)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>📊 Analytics</span>
            </button>
          </nav>

          {/* Right: Live Queue Indicator & Staff Profile Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
            {/* Live Queue Indicator in Admin Navbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(220, 38, 38, 0.12)',
                border: '1px solid rgba(220, 38, 38, 0.35)',
                padding: '0.32rem 0.65rem',
                borderRadius: '99px',
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('kds')}
              title="Live Counter & Kitchen Queue - Click to inspect KDS"
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                  display: 'inline-block'
                }}
              ></span>
              <span style={{ color: '#cbd5e1', fontSize: '0.7rem', fontWeight: 800 }}>QUEUE:</span>
              <strong style={{ color: '#fef08a', fontWeight: 900 }}>
                {readyOrders[0]?.tokenNumber || queueOrders[0]?.tokenNumber || '#TK-101'}
              </strong>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                ({queueOrders.length} wait)
              </span>
            </div>

            {/* Quick Refresh Button */}
            <button
              type="button"
              onClick={handleRefreshClick}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s'
              }}
              title="Refresh all data"
            >
              <span style={{ display: 'inline-block', transform: isRefreshing ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s ease' }}>🔄</span>
              <span>Sync</span>
            </button>

            {/* Back to Customer Website Link */}
            <a
              href="/"
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                color: '#93c5fd',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Go to customer-facing ordering site"
            >
              <span>🌐 Student Site ↗</span>
            </a>

            {/* Staff User Badge & Logout */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                paddingLeft: '0.5rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d9232d 0%, #7f1d1d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                {staffUser?.name ? staffUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 800, lineHeight: 1.1 }}>
                  {staffUser?.name ? staffUser.name.split(' ')[0] : 'Staff'}
                </span>
                <span style={{ fontSize: '0.64rem', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>
                  {staffUser?.role || 'ADMIN'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleStaffLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                  borderRadius: '6px',
                  padding: '0.3rem 0.55rem',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
                title="Log out of staff shift"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: 1440, margin: '1.75rem auto', padding: '0 1.5rem' }}>
        {/* ======================================================================
            TAB 1: KITCHEN KDS KANBAN BOARD
            ====================================================================== */}
        {activeTab === 'kds' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>
                  Kitchen Display System (KDS) Live Board
                </h1>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                  Live visual workflow for cafeteria chefs and pickup counter staff. Advance tickets in 1 click.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{ background: '#1f2937', border: '1px solid #374151', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.82rem', color: '#fbbf24', fontWeight: 800 }}>
                  Calling: {readyOrders[0]?.tokenNumber || 'No Ticket Ready'}
                </span>
              </div>
            </div>

            {/* 4-Column Live Kanban Board */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Col 1: Pending (In Queue) */}
              <div style={{ background: '#111827', borderRadius: '12px', border: '1px solid #e11d48', padding: '1.2rem', minHeight: 480 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.6rem' }}>
                  <strong style={{ color: '#fb7185', fontSize: '0.95rem' }}>🔔 In Queue ({queueOrders.length})</strong>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(244, 63, 94, 0.2)', color: '#fda4af', padding: '0.2rem 0.5rem', borderRadius: 99, fontWeight: 700 }}>New</span>
                </div>
                {queueOrders.length === 0 ? (
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No pending orders in queue.</p>
                ) : (
                  queueOrders.map(order => (
                    <div key={order.orderId} style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#67e8f9' }}>{order.tokenNumber}</span>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', background: '#374151', padding: '0.15rem 0.45rem', borderRadius: 4 }}>Counter {order.pickupCounter || 1}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#f3f4f6', marginBottom: '0.6rem' }}>
                        <strong>{order.customer?.name}</strong> <span style={{ color: '#9ca3af', textTransform: 'capitalize' }}>({order.customer?.role})</span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.8rem', fontSize: '0.82rem', color: '#d1d5db' }}>
                        {order.items?.map((it, idx) => (
                          <li key={idx} style={{ padding: '0.2rem 0', borderBottom: '1px dashed #374151' }}>
                            • <strong>{it.quantity}x</strong> {it.name}
                          </li>
                        ))}
                      </ul>
                      {order.cookingNotes && (
                        <div style={{ fontSize: '0.78rem', background: 'rgba(251, 191, 36, 0.15)', color: '#fde047', padding: '0.35rem 0.6rem', borderRadius: 6, marginBottom: '0.8rem', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                          💬 Note: {order.cookingNotes}
                        </div>
                      )}
                      <button
                        type="button"
                        style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', fontWeight: 800, background: '#d9232d', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={() => handleStatusChange(order.orderId, 'cooking')}
                      >
                        🔥 Start Cooking
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Col 2: Cooking */}
              <div style={{ background: '#111827', borderRadius: '12px', border: '1px solid #d97706', padding: '1.2rem', minHeight: 480 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.6rem' }}>
                  <strong style={{ color: '#fbbf24', fontSize: '0.95rem' }}>🍳 On Fire ({cookingOrders.length})</strong>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(251, 191, 36, 0.2)', color: '#fde047', padding: '0.2rem 0.5rem', borderRadius: 99, fontWeight: 700 }}>Prep</span>
                </div>
                {cookingOrders.length === 0 ? (
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No tickets currently cooking.</p>
                ) : (
                  cookingOrders.map(order => (
                    <div key={order.orderId} style={{ background: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fbbf24' }}>{order.tokenNumber}</span>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', background: '#374151', padding: '0.15rem 0.45rem', borderRadius: 4 }}>Counter {order.pickupCounter || 1}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#f3f4f6', marginBottom: '0.6rem' }}>
                        <strong>{order.customer?.name}</strong>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.8rem', fontSize: '0.82rem', color: '#d1d5db' }}>
                        {order.items?.map((it, idx) => (
                          <li key={idx} style={{ padding: '0.2rem 0', borderBottom: '1px dashed #374151' }}>
                            • <strong>{it.quantity}x</strong> {it.name}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', fontWeight: 800, background: '#059669', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={() => handleStatusChange(order.orderId, 'ready')}
                      >
                        🔔 Mark Ready for Pickup
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Col 3: Ready for Pickup */}
              <div style={{ background: '#111827', borderRadius: '12px', border: '1px solid #059669', padding: '1.2rem', minHeight: 480 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.6rem' }}>
                  <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>📢 At Pickup Counter ({readyOrders.length})</strong>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '0.2rem 0.5rem', borderRadius: 99, fontWeight: 700 }}>Calling</span>
                </div>
                {readyOrders.length === 0 ? (
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No orders currently calling.</p>
                ) : (
                  readyOrders.map(order => (
                    <div key={order.orderId} style={{ background: '#1f2937', border: '1px solid #059669', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399' }}>{order.tokenNumber}</span>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>Counter {order.pickupCounter || 1}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#f3f4f6', marginBottom: '0.6rem' }}>
                        <strong>{order.customer?.name}</strong> <span style={{ color: '#9ca3af' }}>({order.customer?.studentId || 'Dine-In'})</span>
                      </div>
                      <button
                        type="button"
                        style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', fontWeight: 800, background: '#374151', color: '#f3f4f6', border: '1px solid #4b5563', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={() => handleStatusChange(order.orderId, 'completed')}
                      >
                        ✅ Customer Picked Up
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Col 4: Completed */}
              <div style={{ background: '#111827', borderRadius: '12px', border: '1px solid #374151', padding: '1.2rem', minHeight: 480 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.6rem' }}>
                  <strong style={{ color: '#9ca3af', fontSize: '0.95rem' }}>📦 Served ({completedOrders.length})</strong>
                  <span style={{ fontSize: '0.75rem', background: '#1f2937', color: '#9ca3af', padding: '0.2rem 0.5rem', borderRadius: 99, fontWeight: 700 }}>Done</span>
                </div>
                {completedOrders.slice(0, 7).map(order => (
                  <div key={order.orderId} style={{ background: '#1f2937', borderRadius: '6px', padding: '0.7rem 0.9rem', marginBottom: '0.6rem', fontSize: '0.82rem', color: '#9ca3af' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#e5e7eb' }}>
                      <span>{order.tokenNumber}</span>
                      <span style={{ color: '#fbbf24' }}>₹{order.totalAmount}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.customer?.name} • Counter {order.pickupCounter || 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================
            TAB 2: ALL ORDERS MANAGEMENT
            ====================================================================== */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>
                  All Customer Orders Management
                </h1>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                  Complete chronological order logs with live status transition controls.
                </p>
              </div>

              {/* Search & Status Filters */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="🔍 Search token or customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ padding: '0.5rem 0.8rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  style={{ padding: '0.5rem 0.8rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="pending">In Queue ({queueOrders.length})</option>
                  <option value="cooking">Cooking ({cookingOrders.length})</option>
                  <option value="ready">Ready ({readyOrders.length})</option>
                  <option value="completed">Completed ({completedOrders.length})</option>
                </select>
              </div>
            </div>

            <div style={{ background: '#111827', borderRadius: '12px', border: '1px solid #1f2937', overflowX: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#1f2937', borderBottom: '1px solid #374151', color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Token #</th>
                    <th style={{ padding: '1rem' }}>Customer</th>
                    <th style={{ padding: '1rem' }}>Items Ordered</th>
                    <th style={{ padding: '1rem' }}>Amount</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Counter / Table</th>
                    <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Advance Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        No orders matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => (
                      <tr key={o.orderId} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td style={{ padding: '1rem 1.2rem', fontWeight: 900, color: '#38bdf8', fontSize: '1.1rem' }}>
                          {o.tokenNumber}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <strong style={{ color: '#f3f4f6', display: 'block' }}>{o.customer?.name || 'Customer'}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'capitalize' }}>
                            {o.customer?.role || 'student'} • {o.customer?.studentId || 'ID'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#d1d5db', maxWidth: 280 }}>
                          {o.items?.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                          {o.cookingNotes && (
                            <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.2rem' }}>
                              💬 {o.cookingNotes}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem', color: '#fbbf24', fontWeight: 800 }}>
                          ₹{o.totalAmount}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span
                            style={{
                              textTransform: 'uppercase',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '0.25rem 0.6rem',
                              borderRadius: 99,
                              background:
                                o.status === 'ready' ? 'rgba(16, 185, 129, 0.2)' :
                                o.status === 'cooking' ? 'rgba(251, 191, 36, 0.2)' :
                                o.status === 'pending' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                              color:
                                o.status === 'ready' ? '#34d399' :
                                o.status === 'cooking' ? '#fbbf24' :
                                o.status === 'pending' ? '#fb7185' : '#9ca3af'
                            }}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#9ca3af' }}>
                          Counter {o.pickupCounter || 1} • {o.tableNumber || 'Pickup'}
                        </td>
                        <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            {o.status === 'pending' && (
                              <button
                                type="button"
                                style={{ background: '#d9232d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.35rem 0.7rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                                onClick={() => handleStatusChange(o.orderId, 'cooking')}
                              >
                                🔥 Cook
                              </button>
                            )}
                            {o.status === 'cooking' && (
                              <button
                                type="button"
                                style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 6, padding: '0.35rem 0.7rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                                onClick={() => handleStatusChange(o.orderId, 'ready')}
                              >
                                🔔 Ready
                              </button>
                            )}
                            {o.status === 'ready' && (
                              <button
                                type="button"
                                style={{ background: '#374151', color: '#34d399', border: '1px solid #10b981', borderRadius: 6, padding: '0.35rem 0.7rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                                onClick={() => handleStatusChange(o.orderId, 'completed')}
                              >
                                ✅ Complete
                              </button>
                            )}
                            {o.status !== 'completed' && o.status !== 'cancelled' && (
                              <button
                                type="button"
                                style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: 6, padding: '0.35rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                onClick={() => handleStatusChange(o.orderId, 'cancelled')}
                                title="Cancel order"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================================
            TAB 3: USERS & REGISTRATIONS MANAGEMENT
            ====================================================================== */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>
                  Campus User Registrations & Meal Wallets
                </h1>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                  All registered students, faculty, and kitchen staff from MongoDB & database.
                </p>
              </div>

              {/* Action buttons & search */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="🔍 Search name, email, roll #..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ padding: '0.5rem 0.8rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  style={{ padding: '0.5rem 0.8rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="all">All Roles ({users.length})</option>
                  <option value="student">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admins</option>
                  <option value="kitchen">Kitchen Staff</option>
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(true)}
                  style={{ background: '#d9232d', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.5rem 0.9rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  ➕ Register New User
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div style={{ background: '#111827', borderRadius: '12px', border: '1px solid #1f2937', overflowX: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#1f2937', borderBottom: '1px solid #374151', color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>User Profile</th>
                    <th style={{ padding: '1rem' }}>Email Address</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem' }}>ID / Roll No</th>
                    <th style={{ padding: '1rem' }}>Department</th>
                    <th style={{ padding: '1rem' }}>Wallet Balance</th>
                    <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Credit Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        No campus users found matching this search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.userId || u._id} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td style={{ padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={u.name}
                            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #374151' }}
                          />
                          <div>
                            <strong style={{ color: '#f3f4f6', display: 'block' }}>{u.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{u.userId}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#d1d5db' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <span
                            style={{
                              textTransform: 'uppercase',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '0.2rem 0.55rem',
                              borderRadius: 99,
                              background:
                                u.role === 'admin' ? 'rgba(168, 85, 247, 0.2)' :
                                u.role === 'faculty' ? 'rgba(59, 130, 246, 0.2)' :
                                u.role === 'kitchen' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                              color:
                                u.role === 'admin' ? '#c084fc' :
                                u.role === 'faculty' ? '#93c5fd' :
                                u.role === 'kitchen' ? '#fde047' : '#6ee7b7'
                            }}
                          >
                            {u.role || 'student'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#9ca3af', fontWeight: 600 }}>
                          {u.studentId || u.regNo || '—'}
                        </td>
                        <td style={{ padding: '1rem', color: '#9ca3af' }}>
                          {u.department || 'Campus General'}
                        </td>
                        <td style={{ padding: '1rem', color: '#fbbf24', fontWeight: 800, fontSize: '1rem' }}>
                          ₹{Number(u.walletBalance || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              style={{ background: '#10b981', color: '#ffffff', border: 'none', borderRadius: 6, padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                              onClick={() => handleCreditWallet(u.userId, 100)}
                              title="Add ₹100 meal credits"
                            >
                              + ₹100
                            </button>
                            <button
                              type="button"
                              style={{ background: '#059669', color: '#ffffff', border: 'none', borderRadius: 6, padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                              onClick={() => handleCreditWallet(u.userId, 500)}
                              title="Add ₹500 meal credits"
                            >
                              + ₹500
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal: Add New Campus User */}
            {isAddUserModalOpen && (
              <div className="cart-drawer-overlay open" onClick={() => setIsAddUserModalOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.7)', zIndex: 1200 }}>
                <div style={{ maxWidth: 480, width: '100%', background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.8rem' }}>
                    <h2 style={{ fontSize: '1.35rem', color: '#fff', fontWeight: 800, margin: 0 }}>➕ Register Campus User</h2>
                    <button type="button" onClick={() => setIsAddUserModalOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                  </div>

                  {addUserMsg.error && (
                    <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', color: '#fecaca', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem' }}>
                      ⚠️ {addUserMsg.error}
                    </div>
                  )}
                  {addUserMsg.success && (
                    <div style={{ background: '#064e3b', border: '1px solid #10b981', color: '#a7f3d0', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem' }}>
                      ✅ {addUserMsg.success}
                    </div>
                  )}

                  <form onSubmit={handleAddUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Patil"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Campus Email</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@campus.edu"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Role</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                        >
                          <option value="student">Student</option>
                          <option value="faculty">Faculty</option>
                          <option value="kitchen">Kitchen Chef</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Roll / Employee ID</label>
                        <input
                          type="text"
                          placeholder="e.g. 2024CS099"
                          value={newUserRegNo}
                          onChange={(e) => setNewUserRegNo(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Department</label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science & Engineering"
                        value={newUserDept}
                        onChange={(e) => setNewUserDept(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Initial Balance (₹)</label>
                        <input
                          type="number"
                          value={newUserWallet}
                          onChange={(e) => setNewUserWallet(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Password</label>
                        <input
                          type="text"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      style={{ background: '#d9232d', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.8rem', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                      Save & Register User
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================
            TAB 4: MENU CATALOG MANAGER
            ====================================================================== */}
        {activeTab === 'menu' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>
                  Menu Catalog & Live Stock Controls
                </h1>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                  Toggle counter availability, edit item pricing, or add new delicacies to cafeteria.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="🔍 Search dishes..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  style={{ padding: '0.5rem 0.8rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
                <select
                  value={menuCategoryFilter}
                  onChange={(e) => setMenuCategoryFilter(e.target.value)}
                  style={{ padding: '0.5rem 0.8rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="all">All Categories</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="meals">Meals</option>
                  <option value="snacks">Snacks</option>
                  <option value="fastfood">Fast Food</option>
                  <option value="beverages">Beverages</option>
                  <option value="desserts">Desserts</option>
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(true)}
                  style={{ background: '#d9232d', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.5rem 0.9rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  ➕ Add New Dish
                </button>
              </div>
            </div>

            <div style={{ background: '#111827', borderRadius: '12px', border: '1px solid #1f2937', overflowX: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#1f2937', borderBottom: '1px solid #374151', color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Dish Item</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Dietary Type</th>
                    <th style={{ padding: '1rem' }}>Price (₹)</th>
                    <th style={{ padding: '1rem' }}>Prep Time</th>
                    <th style={{ padding: '1rem' }}>Stock Status</th>
                    <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Toggle Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMenuItems.map(dish => (
                    <tr key={dish.itemId} style={{ borderBottom: '1px solid #1f2937' }}>
                      <td style={{ padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img src={dish.image} alt={dish.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #374151' }} />
                        <div>
                          <strong style={{ color: '#f3f4f6', display: 'block' }}>{dish.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{dish.badge || 'Counter Dish'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textTransform: 'capitalize', color: '#d1d5db' }}>{dish.category}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 800, background: dish.veg ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: dish.veg ? '#34d399' : '#f87171' }}>
                          {dish.veg ? '🟢 Veg' : '🔴 Non-Veg'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#fbbf24', fontWeight: 800, fontSize: '1rem' }}>₹{dish.price}</td>
                      <td style={{ padding: '1rem', color: '#9ca3af' }}>{dish.prepTime || '8m'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.25rem 0.6rem', borderRadius: 99, fontSize: '0.75rem', background: dish.inStock !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', color: dish.inStock !== false ? '#34d399' : '#fb7185', fontWeight: 700 }}>
                          {dish.inStock !== false ? '✅ In Stock' : '❌ Sold Out'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStock(dish.itemId, dish.inStock !== false)}
                          style={{
                            background: dish.inStock !== false ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            border: `1px solid ${dish.inStock !== false ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                            color: dish.inStock !== false ? '#fca5a5' : '#6ee7b7',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {dish.inStock !== false ? 'Mark Sold Out' : 'Mark In Stock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal: Add New Menu Dish */}
            {isAddDishModalOpen && (
              <div className="cart-drawer-overlay open" onClick={() => setIsAddDishModalOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.7)', zIndex: 1200 }}>
                <div style={{ maxWidth: 480, width: '100%', background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.8rem' }}>
                    <h2 style={{ fontSize: '1.35rem', color: '#fff', fontWeight: 800, margin: 0 }}>➕ Add Dish to Menu</h2>
                    <button type="button" onClick={() => setIsAddDishModalOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                  </div>

                  {addDishMsg.error && <div style={{ background: '#7f1d1d', color: '#fecaca', padding: '0.6rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.82rem' }}>⚠️ {addDishMsg.error}</div>}
                  {addDishMsg.success && <div style={{ background: '#064e3b', color: '#a7f3d0', padding: '0.6rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.82rem' }}>✅ {addDishMsg.success}</div>}

                  <form onSubmit={handleAddDishSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Dish Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Masala Pav Bhaji"
                        value={newDishName}
                        onChange={(e) => setNewDishName(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Category</label>
                        <select
                          value={newDishCategory}
                          onChange={(e) => setNewDishCategory(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="meals">Meals</option>
                          <option value="snacks">Snacks</option>
                          <option value="fastfood">Fast Food</option>
                          <option value="beverages">Beverages</option>
                          <option value="desserts">Desserts</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={newDishPrice}
                          onChange={(e) => setNewDishPrice(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Dietary Type</label>
                        <select
                          value={newDishVeg ? 'veg' : 'nonveg'}
                          onChange={(e) => setNewDishVeg(e.target.value === 'veg')}
                          style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                        >
                          <option value="veg">Pure Vegetarian (Green)</option>
                          <option value="nonveg">Non-Vegetarian (Red)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Prep Time</label>
                        <input
                          type="text"
                          placeholder="e.g. 8-10m"
                          value={newDishPrepTime}
                          onChange={(e) => setNewDishPrepTime(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newDishImage}
                        onChange={(e) => setNewDishImage(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#d1d5db', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>Description</label>
                      <textarea
                        rows="2"
                        placeholder="Brief item description..."
                        value={newDishDesc}
                        onChange={(e) => setNewDishDesc(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.8rem', background: '#1f2937', border: '1.5px solid #374151', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ background: '#d9232d', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.8rem', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                      Add Dish to Counter
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================
            TAB 5: REVENUE & OPERATIONAL KPIS
            ====================================================================== */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontSize: '1.85rem', color: '#ffffff', fontWeight: 900, marginBottom: '1.5rem' }}>
              Operational Revenue & Cafeteria Telemetry
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: '#111827', border: '1px solid #7c3aed', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                <span style={{ fontSize: '0.8rem', color: '#a78bfa', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Total Settled Revenue</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fbbf24', margin: '0.5rem 0' }}>
                  ₹{kpis?.totalRevenue || 520}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>↑ 100% Meal Wallet Prepaid</span>
              </div>

              <div style={{ background: '#111827', border: '1px solid #0284c7', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Total Orders Dispatched</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', margin: '0.5rem 0' }}>
                  {kpis?.totalOrders || orders.length}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Current Campus Shift</span>
              </div>

              <div style={{ background: '#111827', border: '1px solid #e11d48', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                <span style={{ fontSize: '0.8rem', color: '#fb7185', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Active Kitchen Tickets</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fb7185', margin: '0.5rem 0' }}>
                  {queueOrders.length + cookingOrders.length}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#fde047', fontWeight: 700 }}>Avg Turnaround: ~8 Mins</span>
              </div>

              <div style={{ background: '#111827', border: '1px solid #059669', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                <span style={{ fontSize: '0.8rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Active Menu Dishes</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#34d399', margin: '0.5rem 0' }}>
                  {menuItems.length}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Live in Cafeteria Catalog</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
