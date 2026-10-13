// Campus Canteen Pro - Local Database Layer (LocalStorage Engine)
const DB_KEYS = {
  USERS: "canteen_users_v1",
  MENU: "canteen_menu_v1",
  ORDERS: "canteen_orders_v1",
  TRANSACTIONS: "canteen_transactions_v1",
  CURRENT_USER: "canteen_session_user_v1",
  COUPONS: "canteen_coupons_v1",
  TOKEN_SEQ: "canteen_token_seq_v1"
};

class CanteenDB {
  constructor() {
    this.listeners = new Set();
    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(DB_KEYS.MENU)) {
      localStorage.setItem(DB_KEYS.MENU, JSON.stringify(DEFAULT_MENU));
    }
    if (!localStorage.getItem(DB_KEYS.ORDERS)) {
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem(DB_KEYS.TRANSACTIONS)) {
      localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
    }
    if (!localStorage.getItem(DB_KEYS.COUPONS)) {
      localStorage.setItem(DB_KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
    }
    if (!localStorage.getItem(DB_KEYS.TOKEN_SEQ)) {
      localStorage.setItem(DB_KEYS.TOKEN_SEQ, "105");
    }
    // No automatic demo user login - users must register or sign in
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error("Listener error:", e);
      }
    });
  }

  // --- Session & Authentication ---
  getCurrentUser() {
    const raw = localStorage.getItem(DB_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      // Refresh user with up-to-date wallet balance from DB
      const userInDb = this.getUserById(parsed.id);
      return userInDb || parsed;
    } catch {
      return null;
    }
  }

  setCurrentUser(user) {
    localStorage.removeItem("canteen_user_logged_out");
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notify();
  }

  logout() {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
    localStorage.setItem("canteen_user_logged_out", "true");
    this.notify();
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
    } catch {
      return [];
    }
  }

  saveUsers(users) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    this.notify();
  }

  login(email, password) {
    const users = this.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      this.setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: "Invalid email or password." };
  }

  register(userData) {
    const users = this.getUsers();
    const exists = users.some(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );
    if (exists) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "student",
      regNo: userData.regNo || (userData.role === "student" ? "STU-" + Math.floor(1000 + Math.random() * 9000) : null),
      staffId: userData.staffId || (userData.role === "faculty" ? "FAC-" + Math.floor(100 + Math.random() * 900) : null),
      dept: userData.dept || "Campus General",
      walletBalance: userData.role === "admin" || userData.role === "kitchen" ? 0 : 250.00, // Welcome ₹250 bonus for demo
      avatar: userData.avatar || (userData.role === "faculty"
        ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
        : userData.role === "kitchen"
        ? "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150"
        : userData.role === "admin"
        ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    if (newUser.walletBalance > 0) {
      this.addTransaction({
        userId: newUser.id,
        type: "credit",
        amount: newUser.walletBalance,
        desc: "Welcome Bonus Campus Meal Credits"
      });
    }

    return { success: true, user: newUser };
  }

  // --- Wallet Operations ---
  updateWallet(userId, amount, type, description) {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return { success: false, message: "User not found" };

    const currentBalance = Number(users[userIndex].walletBalance || 0);
    const delta = Number(amount);

    if (type === "debit" && currentBalance < delta) {
      return { success: false, message: "Insufficient canteen wallet balance." };
    }

    const newBalance = type === "credit" ? currentBalance + delta : currentBalance - delta;
    users[userIndex].walletBalance = Math.round(newBalance * 100) / 100;
    this.saveUsers(users);

    // Update current session user if active
    const cur = this.getCurrentUser();
    if (cur && cur.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }

    // Add transaction log
    this.addTransaction({
      userId,
      type,
      amount: delta,
      desc: description || (type === "credit" ? "Wallet Top-up" : "Canteen Order Payment")
    });

    return { success: true, balance: users[userIndex].walletBalance };
  }

  // --- Menu CRUD Operations ---
  getMenu() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.MENU) || "[]");
    } catch {
      return [];
    }
  }

  saveMenu(menu) {
    localStorage.setItem(DB_KEYS.MENU, JSON.stringify(menu));
    this.notify();
  }

  addMenuItem(item) {
    const menu = this.getMenu();
    const newItem = {
      ...item,
      id: "dish_" + Date.now(),
      rating: 4.8,
      reviewsCount: 1,
      inStock: true
    };
    menu.unshift(newItem);
    this.saveMenu(menu);
    return newItem;
  }

  updateMenuItem(id, updates) {
    const menu = this.getMenu();
    const idx = menu.findIndex((m) => m.id === id);
    if (idx !== -1) {
      menu[idx] = { ...menu[idx], ...updates };
      this.saveMenu(menu);
      return menu[idx];
    }
    return null;
  }

  toggleMenuItemStock(id) {
    const menu = this.getMenu();
    const item = menu.find((m) => m.id === id);
    if (item) {
      item.inStock = !item.inStock;
      this.saveMenu(menu);
      return item.inStock;
    }
    return false;
  }

  deleteMenuItem(id) {
    const menu = this.getMenu();
    const filtered = menu.filter((m) => m.id !== id);
    this.saveMenu(filtered);
    return true;
  }

  // --- Orders Management & Kitchen Flow ---
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || "[]");
    } catch {
      return [];
    }
  }

  saveOrders(orders) {
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    this.notify();
  }

  getNextToken() {
    let seq = parseInt(localStorage.getItem(DB_KEYS.TOKEN_SEQ) || "105", 10);
    const token = "TK-" + seq;
    localStorage.setItem(DB_KEYS.TOKEN_SEQ, (seq + 1).toString());
    return token;
  }

  createOrder(orderPayload) {
    const orders = this.getOrders();
    const token = this.getNextToken();
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);

    // Calculate dynamic counter based on items
    let assignedCounter = "Counter #1 (Express)";
    const hasThali = orderPayload.items.some((i) => i.id === "dish_09" || i.id === "dish_10" || i.id === "dish_11");
    const hasBurger = orderPayload.items.some((i) => i.id === "dish_13" || i.id === "dish_14" || i.id === "dish_16");
    if (hasThali) assignedCounter = "Counter #2 (Thali & Hot Meals)";
    else if (hasBurger) assignedCounter = "Counter #3 (Grill & Fast Food)";

    const newOrder = {
      id: orderId,
      token,
      userId: orderPayload.userId,
      customerName: orderPayload.customerName,
      customerRole: orderPayload.customerRole,
      customerMeta: orderPayload.customerMeta || "",
      items: orderPayload.items,
      orderType: orderPayload.orderType || "takeaway",
      tableNo: orderPayload.tableNo || "Counter Pickup",
      notes: orderPayload.notes || "",
      subtotal: orderPayload.subtotal,
      discount: orderPayload.discount || 0,
      couponApplied: orderPayload.couponApplied || null,
      total: orderPayload.total,
      paymentMethod: orderPayload.paymentMethod,
      status: "received", // received -> cooking -> ready -> completed -> cancelled
      counter: assignedCounter,
      createdAt: new Date().toISOString(),
      estimatedMinutes: orderPayload.estimatedMinutes || 10
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      if (status === "ready") {
        order.readyAt = new Date().toISOString();
        order.estimatedMinutes = 0;
      } else if (status === "completed") {
        order.completedAt = new Date().toISOString();
      }
      this.saveOrders(orders);
      return order;
    }
    return null;
  }

  // --- Transactions ---
  getTransactions(userId) {
    try {
      const txns = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || "[]");
      if (userId) return txns.filter((t) => t.userId === userId);
      return txns;
    } catch {
      return [];
    }
  }

  addTransaction(txn) {
    const txns = this.getTransactions();
    const newTxn = {
      id: "TXN-" + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString(),
      ...txn
    };
    txns.unshift(newTxn);
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(txns));
    this.notify();
    return newTxn;
  }

  // --- Coupons ---
  getCoupons() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.COUPONS) || "[]");
    } catch {
      return [];
    }
  }

  validateCoupon(code, subtotal, role) {
    const coupons = this.getCoupons();
    const upper = (code || "").trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === upper);

    if (!found) {
      return { valid: false, message: "Invalid promo coupon code." };
    }
    if (found.minOrder && subtotal < found.minOrder) {
      return { valid: false, message: `Minimum order value ₹${found.minOrder} required for ${found.code}.` };
    }

    let discount = 0;
    if (found.discountPercent) {
      discount = (subtotal * found.discountPercent) / 100;
      if (found.maxDiscount && discount > found.maxDiscount) {
        discount = found.maxDiscount;
      }
    } else if (found.discountAmount) {
      discount = found.discountAmount;
    }

    return {
      valid: true,
      code: found.code,
      discount: Math.round(discount * 100) / 100,
      message: `Coupon ${found.code} applied successfully!`
    };
  }

  // --- Analytics & Statistics for Admin ---
  getAnalytics() {
    const orders = this.getOrders();
    const menu = this.getMenu();
    const users = this.getUsers();

    const completedOrActive = orders.filter((o) => o.status !== "cancelled");
    const totalRevenue = completedOrActive.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeOrders = orders.filter((o) => o.status === "received" || o.status === "cooking" || o.status === "ready");

    // Item sales breakdown
    const itemSales = {};
    orders.forEach((o) => {
      if (o.status !== "cancelled") {
        (o.items || []).forEach((it) => {
          itemSales[it.name] = (itemSales[it.name] || 0) + (it.qty || 1);
        });
      }
    });

    const topItems = Object.entries(itemSales)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRevenue: Math.round(totalRevenue),
      totalOrders: orders.length,
      activeOrdersCount: activeOrders.length,
      totalMenuItems: menu.length,
      totalStudents: users.filter((u) => u.role === "student").length,
      totalFaculty: users.filter((u) => u.role === "faculty").length,
      topItems,
      ordersByStatus: {
        received: orders.filter((o) => o.status === "received").length,
        cooking: orders.filter((o) => o.status === "cooking").length,
        ready: orders.filter((o) => o.status === "ready").length,
        completed: orders.filter((o) => o.status === "completed").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length
      }
    };
  }

  // --- Backup, Export & Factory Reset ---
  exportDatabaseJSON() {
    const fullDb = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      users: this.getUsers(),
      menu: this.getMenu(),
      orders: this.getOrders(),
      transactions: this.getTransactions(),
      coupons: this.getCoupons()
    };
    return JSON.stringify(fullDb, null, 2);
  }

  importDatabaseJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.users) localStorage.setItem(DB_KEYS.USERS, JSON.stringify(data.users));
      if (data.menu) localStorage.setItem(DB_KEYS.MENU, JSON.stringify(data.menu));
      if (data.orders) localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(data.orders));
      if (data.transactions) localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
      if (data.coupons) localStorage.setItem(DB_KEYS.COUPONS, JSON.stringify(data.coupons));
      this.notify();
      return { success: true };
    } catch (err) {
      return { success: false, message: "Invalid JSON format: " + err.message };
    }
  }

  resetToFactoryDefaults() {
    localStorage.removeItem(DB_KEYS.USERS);
    localStorage.removeItem(DB_KEYS.MENU);
    localStorage.removeItem(DB_KEYS.ORDERS);
    localStorage.removeItem(DB_KEYS.TRANSACTIONS);
    localStorage.removeItem(DB_KEYS.COUPONS);
    localStorage.removeItem(DB_KEYS.TOKEN_SEQ);
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
    this.initDatabase();
    this.notify();
    return true;
  }
}

// Global Singleton Instance
const db = new CanteenDB();
