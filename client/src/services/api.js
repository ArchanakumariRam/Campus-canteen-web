// API Service for RIT Canteen Pro MERN Backend
const API_BASE = '/api';

export const api = {
  // Menu Endpoints
  async getMenu(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/menu${query ? `?${query}` : ''}`);
    return res.json();
  },

  async addDish(dishData) {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dishData)
    });
    return res.json();
  },

  async toggleDishStock(itemId, inStock) {
    const res = await fetch(`${API_BASE}/menu/${itemId}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock })
    });
    return res.json();
  },

  async deleteDish(itemId) {
    const res = await fetch(`${API_BASE}/menu/${itemId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Orders Endpoints
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/orders${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getLiveQueue() {
    const res = await fetch(`${API_BASE}/orders/queue/live`);
    return res.json();
  },

  async placeOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async updateOrderStatus(orderId, status) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Auth & Wallet Endpoints
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },

  async addUser(userData) {
    const res = await fetch(`${API_BASE}/auth/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async topupWallet(userId, amount) {
    const res = await fetch(`${API_BASE}/auth/wallet/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount })
    });
    return res.json();
  },

  // KPI Operations Endpoints
  async getKPIs() {
    const res = await fetch(`${API_BASE}/kpi`);
    return res.json();
  }
};
