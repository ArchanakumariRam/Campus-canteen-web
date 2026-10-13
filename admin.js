// Campus Canteen Pro - Staff & Admin Operations Controller
(function () {
  "use strict";

  // Admin App State
  const state = {
    activeTab: "overview",
    staffUser: null
  };

  // DOM Elements
  const DOM = {
    // Navigation
    adminNavLinks: document.getElementById("admin-nav-links"),
    btnTabOverview: document.getElementById("btn-tab-overview"),
    btnTabKds: document.getElementById("btn-tab-kds"),
    btnTabMenu: document.getElementById("btn-tab-menu"),
    btnTabOrders: document.getElementById("btn-tab-orders"),
    btnTabWallets: document.getElementById("btn-tab-wallets"),
    kdsAlertDot: document.getElementById("kds-alert-dot"),
    btnAdminSound: document.getElementById("btn-admin-sound"),
    adminUserInfo: document.getElementById("admin-user-info"),
    adminAvatar: document.getElementById("admin-avatar"),
    adminName: document.getElementById("admin-name"),
    adminRoleBadge: document.getElementById("admin-role-badge"),
    btnAdminLogout: document.getElementById("btn-admin-logout"),

    // Sections
    sectionStaffAuth: document.getElementById("section-staff-auth"),
    sectionAdminDashboard: document.getElementById("section-admin-dashboard"),

    // Auth Form & Quick Logins
    btnQuickLoginAdmin: document.getElementById("btn-quick-login-admin"),
    btnQuickLoginKitchen: document.getElementById("btn-quick-login-kitchen"),
    formStaffLogin: document.getElementById("form-staff-login"),
    staffEmail: document.getElementById("staff-email"),
    staffPassword: document.getElementById("staff-password"),

    // Subtabs
    subtabOverview: document.getElementById("subtab-overview"),
    subtabKds: document.getElementById("subtab-kds"),
    subtabMenu: document.getElementById("subtab-menu"),
    subtabOrders: document.getElementById("subtab-orders"),
    subtabWallets: document.getElementById("subtab-wallets"),

    // Overview KPIs
    adminKpiRevenue: document.getElementById("admin-kpi-revenue"),
    adminKpiOrdersCount: document.getElementById("admin-kpi-orders-count"),
    adminKpiActiveOrders: document.getElementById("admin-kpi-active-orders"),
    adminKpiMenuItems: document.getElementById("admin-kpi-menu-items"),
    btnAdminExportDb: document.getElementById("btn-admin-export-db"),
    inputAdminImportDb: document.getElementById("input-admin-import-db"),
    btnAdminResetDb: document.getElementById("btn-admin-reset-db"),

    // KDS Kanban
    adminKdsQueueCount: document.getElementById("admin-kds-queue-count"),
    adminKdsCookingCount: document.getElementById("admin-kds-cooking-count"),
    adminKdsReadyCount: document.getElementById("admin-kds-ready-count"),
    adminKdsCountReceived: document.getElementById("admin-kds-count-received"),
    adminKdsCountCooking: document.getElementById("admin-kds-count-cooking"),
    adminKdsCountReady: document.getElementById("admin-kds-count-ready"),
    adminKdsCountCompleted: document.getElementById("admin-kds-count-completed"),
    adminKdsColReceived: document.getElementById("admin-kds-col-received"),
    adminKdsColCooking: document.getElementById("admin-kds-col-cooking"),
    adminKdsColReady: document.getElementById("admin-kds-col-ready"),
    adminKdsColCompleted: document.getElementById("admin-kds-col-completed"),

    // Menu Management
    adminMenuListTbody: document.getElementById("admin-menu-list-tbody"),
    btnAdminAddDishModal: document.getElementById("btn-admin-add-dish-modal"),
    adminModalAddDish: document.getElementById("admin-modal-add-dish"),
    btnAdminCloseDishModal: document.getElementById("btn-admin-close-dish-modal"),
    adminFormAddDish: document.getElementById("admin-form-add-dish"),

    // Orders & Wallets Tables
    adminOrdersListTbody: document.getElementById("admin-orders-list-tbody"),
    adminWalletsListTbody: document.getElementById("admin-wallets-list-tbody"),

    // Toast Container
    toastContainer: document.getElementById("admin-toast-container")
  };

  // --- INITIALIZATION ---
  function init() {
    checkStaffSession();
    bindEvents();

    // Subscribe to DB updates (Live sync with customer orders)
    db.subscribe(() => {
      if (state.staffUser) {
        renderCurrentTab();
        checkActiveOrdersNotification();
      }
    });
  }

  // --- SESSION CHECK ---
  function checkStaffSession() {
    const cur = db.getCurrentUser();
    if (cur && (cur.role === "admin" || cur.role === "kitchen")) {
      loginStaffSuccess(cur);
    } else {
      showStaffLoginForm();
    }
  }

  function showStaffLoginForm() {
    state.staffUser = null;
    DOM.sectionStaffAuth.style.display = "flex";
    DOM.sectionAdminDashboard.style.display = "none";
    DOM.adminNavLinks.style.display = "none";
    DOM.adminUserInfo.style.display = "none";
  }

  function loginStaffSuccess(user) {
    state.staffUser = user;
    DOM.sectionStaffAuth.style.display = "none";
    DOM.sectionAdminDashboard.style.display = "block";
    DOM.adminNavLinks.style.display = "flex";
    DOM.adminUserInfo.style.display = "flex";

    DOM.adminName.textContent = user.name ? user.name.split(" (")[0] : "Admin";
    DOM.adminRoleBadge.textContent = user.role.toUpperCase();
    if (user.avatar) DOM.adminAvatar.src = user.avatar;

    // Default tab based on role
    if (user.role === "kitchen") {
      switchSubTab("kds");
    } else {
      switchSubTab("overview");
    }

    checkActiveOrdersNotification();
  }

  // --- SUBTAB NAVIGATION ---
  function switchSubTab(tabName) {
    sounds.playTap();
    state.activeTab = tabName;

    // Update active nav button
    document.querySelectorAll(".admin-nav .nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Toggle subtab sections
    if (DOM.subtabOverview) DOM.subtabOverview.style.display = tabName === "overview" ? "block" : "none";
    if (DOM.subtabKds) DOM.subtabKds.style.display = tabName === "kds" ? "block" : "none";
    if (DOM.subtabMenu) DOM.subtabMenu.style.display = tabName === "menu" ? "block" : "none";
    if (DOM.subtabOrders) DOM.subtabOrders.style.display = tabName === "orders" ? "block" : "none";
    if (DOM.subtabWallets) DOM.subtabWallets.style.display = tabName === "wallets" ? "block" : "none";

    renderCurrentTab();
  }

  function renderCurrentTab() {
    if (state.activeTab === "overview") renderOverview();
    else if (state.activeTab === "kds") renderKDS();
    else if (state.activeTab === "menu") renderMenuCatalog();
    else if (state.activeTab === "orders") renderOrdersTable();
    else if (state.activeTab === "wallets" && DOM.adminWalletsListTbody) renderWalletsTable();
  }

  function checkActiveOrdersNotification() {
    const orders = db.getOrders();
    const newInQueue = orders.some((o) => o.status === "received");
    DOM.kdsAlertDot.style.display = newInQueue ? "inline-block" : "none";
  }

  // --- 1. OVERVIEW & KPIS ---
  function renderOverview() {
    const analytics = db.getAnalytics();
    DOM.adminKpiRevenue.textContent = `₹${analytics.totalRevenue.toLocaleString()}`;
    DOM.adminKpiOrdersCount.textContent = analytics.totalOrders;
    DOM.adminKpiActiveOrders.textContent = analytics.activeOrdersCount;
    DOM.adminKpiMenuItems.textContent = analytics.totalMenuItems;
  }

  // --- 2. KITCHEN DISPLAY SYSTEM (KDS) ---
  function renderKDS() {
    const orders = db.getOrders();

    const received = orders.filter((o) => o.status === "received");
    const cooking = orders.filter((o) => o.status === "cooking");
    const ready = orders.filter((o) => o.status === "ready");
    const completed = orders.filter((o) => o.status === "completed").slice(0, 10);

    DOM.adminKdsQueueCount.innerHTML = `🟡 In Queue: <strong>${received.length}</strong>`;
    DOM.adminKdsCookingCount.innerHTML = `🟠 Cooking: <strong>${cooking.length}</strong>`;
    DOM.adminKdsReadyCount.innerHTML = `🟢 Ready at Counter: <strong>${ready.length}</strong>`;

    DOM.adminKdsCountReceived.textContent = received.length;
    DOM.adminKdsCountCooking.textContent = cooking.length;
    DOM.adminKdsCountReady.textContent = ready.length;
    DOM.adminKdsCountCompleted.textContent = completed.length;

    DOM.adminKdsColReceived.innerHTML = renderKdsTicketsHtml(received, "received");
    DOM.adminKdsColCooking.innerHTML = renderKdsTicketsHtml(cooking, "cooking");
    DOM.adminKdsColReady.innerHTML = renderKdsTicketsHtml(ready, "ready");
    DOM.adminKdsColCompleted.innerHTML = renderKdsTicketsHtml(completed, "completed");

    bindKdsActionButtons();
  }

  function renderKdsTicketsHtml(ticketList, stage) {
    if (ticketList.length === 0) {
      return `<div style="text-align: center; color: var(--text-subtle); padding: 2.5rem 0; font-size: 0.85rem;">No tickets in this stage</div>`;
    }

    return ticketList
      .map((order) => {
        const timeAgo = formatTimeAgo(order.createdAt);
        return `
        <div class="kds-ticket-card" data-order-id="${order.id}">
          <div class="ticket-header">
            <span class="ticket-token">#${order.token}</span>
            <span class="ticket-time">⏱️ ${timeAgo}</span>
          </div>

          <div class="ticket-customer">
            <strong>${order.customerName}</strong> (${order.customerRole.toUpperCase()})<br>
            <span style="font-size: 0.75rem; color: var(--text-subtle);">${order.orderType === "dine-in" ? "🍽️ " + order.tableNo : "🛍️ Takeaway"} • ${order.counter}</span>
          </div>

          <div class="ticket-items-list">
            ${order.items.map((i) => `
              <div class="ticket-item-row">
                <span>${i.name}</span>
                <span class="ticket-item-qty">x${i.qty}</span>
              </div>
            `).join("")}
          </div>

          ${order.notes ? `<div class="ticket-notes">Cooking Note: "${order.notes}"</div>` : ""}

          <div class="ticket-actions">
            ${stage === "received" ? `
              <button type="button" class="kds-btn kds-btn-start btn-admin-kds-advance" data-action="cooking" data-id="${order.id}">
                🔥 Start Cooking
              </button>
            ` : stage === "cooking" ? `
              <button type="button" class="kds-btn kds-btn-ready btn-admin-kds-advance" data-action="ready" data-id="${order.id}">
                🔔 Mark Ready at Counter
              </button>
            ` : stage === "ready" ? `
              <button type="button" class="kds-btn kds-btn-done btn-admin-kds-advance" data-action="completed" data-id="${order.id}">
                ✓ Handed Over / Served
              </button>
            ` : `
              <span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">✓ Served & Completed</span>
            `}
          </div>
        </div>
      `;
      })
      .join("");
  }

  function bindKdsActionButtons() {
    document.querySelectorAll(".btn-admin-kds-advance").forEach((btn) => {
      btn.addEventListener("click", () => {
        const orderId = btn.dataset.id;
        const targetStatus = btn.dataset.action;
        const updated = db.updateOrderStatus(orderId, targetStatus);

        if (targetStatus === "ready") {
          sounds.playOrderReady();
          showToast(`🔔 Token #${updated.token} is now READY! Counter bell triggered.`, "success");
        } else if (targetStatus === "cooking") {
          sounds.playPop();
          showToast(`🔥 Order #${updated.token} transferred to stove & preparation.`, "info");
        } else if (targetStatus === "completed") {
          sounds.playPop();
          showToast(`Order #${updated.token} handed over & marked served.`, "info");
        }

        renderKDS();
      });
    });
  }

  // --- 3. MENU CATALOG & STOCK ---
  function renderMenuCatalog() {
    const menu = db.getMenu();
    DOM.adminMenuListTbody.innerHTML = menu
      .map(
        (dish) => `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="${dish.image}" alt="${dish.name}" style="width: 38px; height: 38px; border-radius: 6px; object-fit: cover;">
              <strong>${dish.name}</strong>
            </div>
          </td>
          <td><span style="text-transform: capitalize;">${dish.category}</span></td>
          <td><span class="diet-badge-icon ${dish.diet}"></span> ${dish.diet === "veg" ? "Pure Veg" : "Non-Veg"}</td>
          <td><strong style="color: #ffc482;">₹${dish.price}</strong></td>
          <td>${dish.prepTime} mins</td>
          <td>
            <button type="button" class="role-pill-btn btn-stock-toggle" data-id="${dish.id}" style="${dish.inStock ? 'color:#10b981; border-color:#10b981;' : 'color:#ef4444; border-color:#ef4444;'}">
              ${dish.inStock ? "🟢 In Stock" : "🔴 Sold Out"}
            </button>
          </td>
          <td>
            <button type="button" class="btn-dish-delete" data-id="${dish.id}" style="color: #ef4444; padding: 0.35rem 0.65rem; border-radius: 6px; background: rgba(239,68,68,0.1);" title="Delete Dish">
              🗑️
            </button>
          </td>
        </tr>
      `
      )
      .join("");

    DOM.adminMenuListTbody.querySelectorAll(".btn-stock-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const newStock = db.toggleMenuItemStock(id);
        sounds.playTap();
        showToast(`Stock updated: Dish is now ${newStock ? "IN STOCK" : "OUT OF STOCK"}.`);
        renderMenuCatalog();
      });
    });

    DOM.adminMenuListTbody.querySelectorAll(".btn-dish-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (confirm("Are you sure you want to delete this dish from the menu?")) {
          db.deleteMenuItem(id);
          sounds.playTap();
          showToast("Dish removed from catalog.");
          renderMenuCatalog();
        }
      });
    });
  }

  // --- 4. ALL ORDERS TABLE ---
  function renderOrdersTable() {
    const orders = db.getOrders();
    DOM.adminOrdersListTbody.innerHTML = orders
      .map(
        (o) => `
        <tr>
          <td><strong style="color: #ffc482; font-size: 1.05rem;">#${o.token}</strong><br><span style="font-size: 0.72rem; color: var(--text-subtle);">${o.id}</span></td>
          <td>${o.customerName}<br><span style="font-size: 0.72rem; color: var(--text-muted);">${o.customerRole.toUpperCase()}</span></td>
          <td>${o.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}</td>
          <td>${o.orderType === "dine-in" ? "🍽️ " + o.tableNo : "🛍️ Takeaway"}</td>
          <td><strong style="color: #ffc482;">₹${o.total}</strong></td>
          <td>
            <span style="text-transform: uppercase; font-size: 0.74rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 99px; ${
              o.status === "ready" ? "background:#10b981; color:#120e0d;" :
              o.status === "cooking" ? "background:#ff7a00; color:#120e0d;" :
              o.status === "received" ? "background:#f59e0b; color:#120e0d;" :
              "background:rgba(255,255,255,0.1); color:var(--text-muted);"
            }">
              ${o.status}
            </span>
          </td>
          <td>
            ${o.status !== "completed" ? `
              <button type="button" class="role-pill-btn btn-quick-complete" data-id="${o.id}">
                Mark Done ✓
              </button>
            ` : `<span style="font-size: 0.75rem; color: var(--text-subtle);">Done</span>`}
          </td>
        </tr>
      `
      )
      .join("");

    DOM.adminOrdersListTbody.querySelectorAll(".btn-quick-complete").forEach((btn) => {
      btn.addEventListener("click", () => {
        db.updateOrderStatus(btn.dataset.id, "completed");
        sounds.playPop();
        showToast("Order marked completed!");
        renderOrdersTable();
      });
    });
  }

  // --- 5. WALLETS MANAGEMENT ---
  function renderWalletsTable() {
    const users = db.getUsers().filter((u) => u.role === "student" || u.role === "faculty");
    DOM.adminWalletsListTbody.innerHTML = users
      .map(
        (u) => `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="${u.avatar}" alt="${u.name}" style="width: 34px; height: 34px; border-radius: 50%;">
              <strong>${u.name}</strong>
            </div>
          </td>
          <td><span style="text-transform: capitalize;">${u.role}</span></td>
          <td>${u.regNo || u.staffId || "N/A"}</td>
          <td>${u.email}</td>
          <td><strong style="color: #10b981; font-size: 1.05rem;">₹${(u.walletBalance || 0).toFixed(2)}</strong></td>
          <td>
            <button type="button" class="role-pill-btn btn-admin-credit-100" data-id="${u.id}" data-name="${u.name}">
              + Credit ₹100
            </button>
          </td>
        </tr>
      `
      )
      .join("");

    DOM.adminWalletsListTbody.querySelectorAll(".btn-admin-credit-100").forEach((btn) => {
      btn.addEventListener("click", () => {
        const uid = btn.dataset.id;
        const res = db.updateWallet(uid, 100, "credit", "Admin Manual Grant");
        if (res.success) {
          sounds.playPop();
          showToast(`Credited ₹100 to ${btn.dataset.name}'s wallet! New balance: ₹${res.balance.toFixed(2)}`);
          renderWalletsTable();
        }
      });
    });
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast-item";
    if (type === "error") toast.style.borderColor = "#ef4444";
    if (type === "success") toast.style.borderColor = "#10b981";

    toast.innerHTML = `<span>🛡️</span> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Helper: Relative time
  function formatTimeAgo(isoString) {
    if (!isoString) return "just now";
    const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    return `${Math.floor(diffMin / 60)}h ago`;
  }

  // --- EVENT BINDING ---
  function bindEvents() {
    // 1-Click Demo Logins
    DOM.btnQuickLoginAdmin.addEventListener("click", () => {
      const users = db.getUsers();
      const admin = users.find((u) => u.role === "admin");
      if (admin) {
        db.setCurrentUser(admin);
        sounds.playPop();
        showToast("Logged in as Canteen Director Vikram (Full Admin)! 👑");
        loginStaffSuccess(admin);
      }
    });

    DOM.btnQuickLoginKitchen.addEventListener("click", () => {
      const users = db.getUsers();
      const chef = users.find((u) => u.role === "kitchen");
      if (chef) {
        db.setCurrentUser(chef);
        sounds.playPop();
        showToast("Logged in as Kitchen Chef Rajesh (KDS View)! 👨‍🍳");
        loginStaffSuccess(chef);
      }
    });

    // Custom Staff Login Form
    DOM.formStaffLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = DOM.staffEmail.value.trim();
      const pass = DOM.staffPassword.value;
      const res = db.login(email, pass);

      if (res.success) {
        if (res.user.role === "admin" || res.user.role === "kitchen") {
          sounds.playPop();
          showToast(`Welcome to Staff Operations, ${res.user.name}!`);
          loginStaffSuccess(res.user);
        } else {
          showToast("Access Denied: This account is not authorized as Staff or Admin.", "error");
        }
      } else {
        showToast(res.message, "error");
      }
    });

    // Staff Logout
    DOM.btnAdminLogout.addEventListener("click", () => {
      db.logout();
      sounds.playTap();
      showToast("Logged out of Operations Portal.");
      showStaffLoginForm();
    });

    // Nav Subtab Buttons
    DOM.btnTabOverview.addEventListener("click", () => switchSubTab("overview"));
    DOM.btnTabKds.addEventListener("click", () => switchSubTab("kds"));
    DOM.btnTabMenu.addEventListener("click", () => switchSubTab("menu"));
    DOM.btnTabOrders.addEventListener("click", () => switchSubTab("orders"));
    if (DOM.btnTabWallets) {
      DOM.btnTabWallets.addEventListener("click", () => switchSubTab("wallets"));
    }

    // Audio Chimes Toggle
    DOM.btnAdminSound.addEventListener("click", () => {
      const isMuted = sounds.toggleMute();
      DOM.btnAdminSound.textContent = isMuted ? "🔇" : "🔊";
      showToast(isMuted ? "Sound muted" : "Sound unmuted");
    });

    // Add Dish Modal
    DOM.btnAdminAddDishModal.addEventListener("click", () => {
      DOM.adminModalAddDish.classList.add("open");
    });
    DOM.btnAdminCloseDishModal.addEventListener("click", () => {
      DOM.adminModalAddDish.classList.remove("open");
    });
    DOM.adminFormAddDish.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("admin-dish-name").value.trim();
      const category = document.getElementById("admin-dish-category").value;
      const diet = document.getElementById("admin-dish-diet").value;
      const price = parseFloat(document.getElementById("admin-dish-price").value);
      const prepTime = parseInt(document.getElementById("admin-dish-preptime").value, 10);
      const image = document.getElementById("admin-dish-image").value.trim();
      const description = document.getElementById("admin-dish-desc").value.trim();

      const newDish = db.addMenuItem({
        name,
        category,
        diet,
        price,
        prepTime,
        image,
        description,
        calories: "380 kcal",
        badge: "Chef Special 👨‍🍳",
        isPopular: false
      });

      sounds.playPop();
      showToast(`Added ${newDish.name} to the menu! 🍱`);
      DOM.adminModalAddDish.classList.remove("open");
      DOM.adminFormAddDish.reset();
      renderMenuCatalog();
    });

    // Export Database JSON
    DOM.btnAdminExportDb.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(db.exportDatabaseJSON());
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `canteen_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Database exported as JSON backup! 💾");
    });

    // Import Database JSON
    DOM.inputAdminImportDb.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = db.importDatabaseJSON(event.target.result);
        if (res.success) {
          sounds.playOrderSuccess();
          showToast("Database imported successfully! 📂");
          renderCurrentTab();
        } else {
          showToast(res.message, "error");
        }
      };
      reader.readAsText(file);
    });

    // Reset Factory Database
    DOM.btnAdminResetDb.addEventListener("click", () => {
      if (confirm("Reset local canteen database to initial factory demo state? All custom dishes and orders will reset.")) {
        db.resetToFactoryDefaults();
        sounds.playPop();
        showToast("Database restored to demo factory defaults! 🔄");
        location.reload();
      }
    });
  }

  // Run on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
