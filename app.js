// Campus Canteen Pro - Customer Application Controller (Student & Faculty Portal)
(function () {
  "use strict";

  // Application State
  const state = {
    cart: [],
    activeCategory: "all",
    activeDiet: "all",
    searchQuery: "",
    sortBy: "popular",
    appliedCoupon: null,
    diningType: "takeaway",
    activeView: "menu"
  };

  // Cached DOM Elements
  const DOM = {
    // Navigation & Top Banner
    brandLink: document.getElementById("brand-link"),
    navBtnMenu: document.getElementById("nav-btn-menu"),
    navBtnOrders: document.getElementById("nav-btn-orders"),
    navActiveOrdersDot: document.getElementById("nav-active-orders-dot"),
    btnToggleSound: document.getElementById("btn-toggle-sound"),
    navWalletPill: document.getElementById("nav-wallet-pill"),
    navWalletAmount: document.getElementById("nav-wallet-amount"),
    btnOpenCart: document.getElementById("btn-open-cart"),
    navCartCount: document.getElementById("nav-cart-count"),
    btnNavbarCart: document.getElementById("btn-navbar-cart"),
    navStickyCartCount: document.getElementById("nav-sticky-cart-count"),
    navStickyCartTotal: document.getElementById("nav-sticky-cart-total"),
    navUserLoggedInBox: document.getElementById("nav-user-logged-in-box"),
    navUserProfile: document.getElementById("nav-user-profile"),
    navUserAvatar: document.getElementById("nav-user-avatar"),
    navUserName: document.getElementById("nav-user-name"),
    navUserRole: document.getElementById("nav-user-role"),
    btnCustomerLogout: document.getElementById("btn-customer-logout"),
    navGuestActions: document.getElementById("nav-guest-actions"),
    btnOpenSignin: document.getElementById("btn-open-signin"),
    btnOpenSignup: document.getElementById("btn-open-signup"),
    footerLoginLink: document.getElementById("footer-login-link"),
    btnQuickFillStudent: document.getElementById("btn-quick-fill-student"),
    btnQuickFillFaculty: document.getElementById("btn-quick-fill-faculty"),
    linkToRegister: document.getElementById("link-to-register"),
    linkToLogin: document.getElementById("link-to-login"),

    // Live Waiting Queue Elements (Navbar + Strip)
    navQueueWaitingNumber: document.getElementById("nav-queue-waiting-number"),
    navQueueWaitingTime: document.getElementById("nav-queue-waiting-time"),
    navQueuePillBadge: document.getElementById("nav-queue-pill-badge"),
    liveQueueStrip: document.getElementById("live-queue-strip"),
    queueServingTokens: document.getElementById("queue-serving-tokens"),
    queueWaitingCount: document.getElementById("queue-waiting-count"),
    queueEstWait: document.getElementById("queue-est-wait"),

    // Views
    viewMenu: document.getElementById("view-menu"),
    viewOrders: document.getElementById("view-orders"),

    // Menu Browser
    menuSearchInput: document.getElementById("menu-search-input"),
    btnSearchClear: document.getElementById("btn-search-clear"),
    btnSearchTrigger: document.getElementById("btn-search-trigger"),
    categoryTabsRow: document.getElementById("category-tabs-row"),
    dietPills: document.querySelectorAll(".diet-pill"),
    sortDropdownSelect: document.getElementById("sort-dropdown-select"),
    menuCardsContainer: document.getElementById("menu-cards-container"),

    // Cart Drawer
    cartDrawerOverlay: document.getElementById("cart-drawer-overlay"),
    btnCloseCart: document.getElementById("btn-close-cart"),
    cartItemCountLabel: document.getElementById("cart-item-count-label"),
    cartItemsContainer: document.getElementById("cart-items-container"),
    btnOrderTypeTakeaway: document.getElementById("btn-ordertype-takeaway"),
    btnOrderTypeDinein: document.getElementById("btn-ordertype-dinein"),
    tableSelectRow: document.getElementById("table-select-row"),
    tableNumberInput: document.getElementById("table-number-input"),
    kitchenNotesInput: document.getElementById("kitchen-notes-input"),
    couponCodeInput: document.getElementById("coupon-code-input"),
    btnApplyCoupon: document.getElementById("btn-apply-coupon"),
    couponStatusMsg: document.getElementById("coupon-status-msg"),
    cartSubtotalVal: document.getElementById("cart-subtotal-val"),
    cartDiscountRow: document.getElementById("cart-discount-row"),
    cartDiscountVal: document.getElementById("cart-discount-val"),
    cartGrandtotalVal: document.getElementById("cart-grandtotal-val"),
    paymentMethodSelect: document.getElementById("payment-method-select"),
    btnPlaceOrder: document.getElementById("btn-place-order"),

    // Token Slip Modal
    modalTokenSlip: document.getElementById("modal-token-slip"),
    tokenModalNumber: document.getElementById("token-modal-number"),
    tokenModalCounter: document.getElementById("token-modal-counter"),
    tokenModalProgressFill: document.getElementById("token-modal-progress-fill"),
    tokenModalEstTime: document.getElementById("token-modal-est-time"),
    tokenModalQueuePos: document.getElementById("token-modal-queue-pos"),
    tokenModalOrdersAhead: document.getElementById("token-modal-orders-ahead"),
    tokenModalQrBox: document.getElementById("token-modal-qr-box"),
    btnCloseTokenModal: document.getElementById("btn-close-token-modal"),
    btnPrintToken: document.getElementById("btn-print-token"),

    // Wallet Topup Modal
    modalWalletTopup: document.getElementById("modal-wallet-topup"),
    btnCloseWalletModal: document.getElementById("btn-close-wallet-modal"),
    modalWalletCurrentBal: document.getElementById("modal-wallet-current-bal"),
    topupAmountInput: document.getElementById("topup-amount-input"),
    btnSubmitWalletTopup: document.getElementById("btn-submit-wallet-topup"),

    // Auth Modal
    modalAuth: document.getElementById("modal-auth"),
    btnCloseAuthModal: document.getElementById("btn-close-auth-modal"),
    tabBtnLogin: document.getElementById("tab-btn-login"),
    tabBtnRegister: document.getElementById("tab-btn-register"),
    formLogin: document.getElementById("form-login"),
    formRegister: document.getElementById("form-register"),

    // Orders History View
    ordersHistoryList: document.getElementById("orders-history-list"),

    // Notifications & Canvas
    toastContainer: document.getElementById("toast-container"),
    confettiCanvas: document.getElementById("confetti-canvas")
  };

  // --- INITIALIZATION ---
  function init() {
    ensureCustomerSession();
    loadCartFromSession();
    bindEvents();
    renderUserNav();
    renderLiveQueue();
    renderView(state.activeView);

    // Subscribe to DB updates
    db.subscribe(() => {
      renderUserNav();
      renderLiveQueue();
      if (state.activeView === "menu") renderMenu();
      if (state.activeView === "orders") renderOrdersHistory();
      checkActiveOrders();
    });

    checkActiveOrders();
  }

  // Ensure current user is not in staff role when opening student portal
  function ensureCustomerSession() {
    const user = db.getCurrentUser();
    if (user && (user.role === "admin" || user.role === "kitchen")) {
      db.logout();
    }
  }

  // --- CART STORAGE ---
  function saveCartToSession() {
    try {
      sessionStorage.setItem("canteen_cart", JSON.stringify(state.cart));
    } catch (e) {}
  }

  function loadCartFromSession() {
    try {
      const saved = sessionStorage.getItem("canteen_cart");
      if (saved) state.cart = JSON.parse(saved);
    } catch (e) {}
  }

  // --- USER PROFILE & NAVIGATION ---
  function renderUserNav() {
    const user = db.getCurrentUser();

    if (!user) {
      // Guest / Logged out mode
      if (DOM.navUserLoggedInBox) DOM.navUserLoggedInBox.style.display = "none";
      if (DOM.navGuestActions) DOM.navGuestActions.style.display = "flex";
      updateCartBadge();
      return;
    }

    // Authenticated Student or Faculty mode
    if (DOM.navUserLoggedInBox) DOM.navUserLoggedInBox.style.display = "flex";
    if (DOM.navGuestActions) DOM.navGuestActions.style.display = "none";

    if (DOM.navUserName) DOM.navUserName.textContent = user.name;
    if (DOM.navUserRole) DOM.navUserRole.textContent = (user.role || "student").toUpperCase();
    if (user.avatar && DOM.navUserAvatar) DOM.navUserAvatar.src = user.avatar;

    updateCartBadge();
  }

  // --- LIVE CAFETERIA QUEUE TICKER ---
  function renderLiveQueue() {
    const orders = db.getOrders();
    const readyOrders = orders.filter((o) => o.status === "ready");
    const activeQueue = orders.filter((o) => o.status === "received" || o.status === "cooking");

    // Live navbar queue indicator
    if (DOM.navQueueWaitingNumber) {
      DOM.navQueueWaitingNumber.textContent = activeQueue.length;
    }
    if (DOM.navQueueWaitingTime) {
      if (activeQueue.length === 0) {
        DOM.navQueueWaitingTime.textContent = "Queue Clear";
      } else {
        const minWait = Math.max(3, activeQueue.length * 3);
        const maxWait = Math.max(5, activeQueue.length * 4);
        DOM.navQueueWaitingTime.textContent = `~${minWait}-${maxWait} mins`;
      }
    }

    // Tokens currently ready at counter
    if (DOM.queueServingTokens) {
      if (readyOrders.length > 0) {
        DOM.queueServingTokens.textContent = readyOrders
          .slice(0, 3)
          .map((o) => `#${o.token} (${o.counter.split(" ")[0] || "Counter"})`)
          .join(", ");
      } else {
        DOM.queueServingTokens.textContent = "Counter Queue Clear";
      }
    }

    // Total orders currently waiting in line
    if (DOM.queueWaitingCount) {
      DOM.queueWaitingCount.textContent = `${activeQueue.length} Order${activeQueue.length === 1 ? "" : "s"} in line`;
    }

    // Dynamic estimated prep & wait time
    if (DOM.queueEstWait) {
      const minWait = Math.max(3, activeQueue.length * 3);
      const maxWait = Math.max(5, activeQueue.length * 4);
      DOM.queueEstWait.textContent = `~${minWait}-${maxWait} Mins`;
    }
  }

  function checkActiveOrders() {
    const user = db.getCurrentUser();
    if (!user) return;
    const orders = db.getOrders();
    const active = orders.some(
      (o) => o.userId === user.id && (o.status === "received" || o.status === "cooking" || o.status === "ready")
    );
    DOM.navActiveOrdersDot.style.display = active ? "inline-block" : "none";
  }

  // --- VIEW SWITCHING ---
  function switchView(viewName) {
    sounds.playTap();
    state.activeView = viewName;

    // Update active nav button on crimson navbar
    document.querySelectorAll(".crimson-nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    // Toggle customer sections
    if (DOM.viewMenu) DOM.viewMenu.style.display = viewName === "menu" ? "block" : "none";
    if (DOM.viewOrders) DOM.viewOrders.style.display = viewName === "orders" ? "block" : "none";

    renderView(viewName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.switchView = switchView;

  function renderView(viewName) {
    if (viewName === "menu") renderMenu();
    else if (viewName === "orders") renderOrdersHistory();
  }

  // --- MENU RENDERING & FILTERS ---
  function renderMenu() {
    const menu = db.getMenu();
    let filtered = [...menu];

    // Filter by Category
    if (state.activeCategory !== "all") {
      filtered = filtered.filter((i) => i.category === state.activeCategory);
    }

    // Filter by Diet / Bestseller
    if (state.activeDiet === "veg") {
      filtered = filtered.filter((i) => i.diet === "veg");
    } else if (state.activeDiet === "non-veg") {
      filtered = filtered.filter((i) => i.diet === "non-veg");
    } else if (state.activeDiet === "popular") {
      filtered = filtered.filter((i) => i.isPopular);
    }

    // Filter by Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (state.sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === "time-quick") {
      filtered.sort((a, b) => a.prepTime - b.prepTime);
    } else {
      // Most Popular / Highest Rating
      filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating);
    }

    // Empty state
    if (filtered.length === 0) {
      DOM.menuCardsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="font-size: 1.4rem; color: var(--text-main); margin-bottom: 0.5rem;">No dishes match your filter</h3>
          <p>Try searching for something else or reset your dietary preferences.</p>
          <button type="button" class="add-to-cart-btn" style="margin: 1.5rem auto 0;" id="btn-reset-filters">Reset Filters</button>
        </div>
      `;
      const btnReset = document.getElementById("btn-reset-filters");
      if (btnReset) {
        btnReset.addEventListener("click", () => {
          state.activeCategory = "all";
          state.activeDiet = "all";
          state.searchQuery = "";
          DOM.menuSearchInput.value = "";
          DOM.btnSearchClear.style.display = "none";
          document.querySelectorAll(".category-tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.category === "all"));
          document.querySelectorAll(".diet-pill").forEach((b) => b.classList.toggle("active", b.dataset.diet === "all"));
          renderMenu();
        });
      }
      return;
    }

    // Render Food Cards
    DOM.menuCardsContainer.innerHTML = filtered
      .map((dish) => {
        const cartItem = state.cart.find((c) => c.id === dish.id);
        const qtyInCart = cartItem ? cartItem.qty : 0;
        const isHotItem = dish.category === "meals" || dish.category === "breakfast" || dish.name.includes("Chai");

        return `
          <article class="food-card" data-id="${dish.id}">
            <div class="food-card-thumb-wrapper">
              <img src="${dish.image}" alt="${dish.name}" class="food-card-img" loading="lazy">
              ${isHotItem ? `
                <div class="steam-overlay" aria-hidden="true">
                  <div class="steam-particle"></div>
                  <div class="steam-particle"></div>
                  <div class="steam-particle"></div>
                </div>
              ` : ""}
              <div class="food-card-badges-float">
                <span class="diet-badge-icon ${dish.diet}" title="${dish.diet === 'veg' ? 'Pure Vegetarian' : 'Non-Vegetarian'}"></span>
                ${dish.badge ? `<span class="card-top-tag tag-bestseller">${dish.badge}</span>` : ""}
              </div>
              <span class="tag-preptime">⏱️ ${dish.prepTime}m</span>
            </div>

            <div class="food-card-body">
              <div class="card-title-row">
                <h3 class="food-card-title">${dish.name}</h3>
              </div>
              <p class="food-card-desc">${dish.description}</p>

              <div class="card-meta-row">
                <div class="card-rating-col">
                  <span>★</span>
                  <span>${dish.rating}</span>
                  <span class="card-rating-count">(${dish.reviewsCount || 42})</span>
                </div>
                <div>${dish.calories || "320 kcal"}</div>
              </div>

              <div class="card-footer-action">
                <div class="card-price-col">
                  <span class="card-price-value">₹${dish.price}</span>
                  <span class="card-price-original">₹${Math.round(dish.price * 1.25)}</span>
                  <span class="card-price-discount">20% off</span>
                </div>

                ${!dish.inStock ? `
                  <span class="out-of-stock-badge">Sold Out</span>
                ` : qtyInCart > 0 ? `
                  <div class="food-qty-stepper">
                    <button type="button" class="stepper-btn btn-minus" data-id="${dish.id}">-</button>
                    <span class="stepper-value">${qtyInCart}</span>
                    <button type="button" class="stepper-btn btn-plus" data-id="${dish.id}">+</button>
                  </div>
                ` : `
                  <button type="button" class="add-to-cart-btn btn-add" data-id="${dish.id}">
                    <span>+ Add</span>
                  </button>
                `}
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    bindFoodCardButtons();
  }

  function bindFoodCardButtons() {
    DOM.menuCardsContainer.querySelectorAll(".btn-add").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        addToCart(id, btn);
      });
    });

    DOM.menuCardsContainer.querySelectorAll(".btn-plus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        updateCartQty(id, 1, btn);
      });
    });

    DOM.menuCardsContainer.querySelectorAll(".btn-minus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        updateCartQty(id, -1, btn);
      });
    });
  }

  // --- CART MANAGEMENT ---
  function addToCart(dishId, sourceBtn = null) {
    const menu = db.getMenu();
    const dish = menu.find((d) => d.id === dishId);
    if (!dish || !dish.inStock) {
      showToast("⚠️ This dish is currently out of stock.", "error");
      return;
    }

    const existing = state.cart.find((c) => c.id === dishId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        qty: 1,
        image: dish.image,
        prepTime: dish.prepTime,
        diet: dish.diet,
        category: dish.category
      });
    }

    sounds.playPop();
    saveCartToSession();
    updateCartBadge();
    renderMenu();
    renderCart();

    // Trigger flight animation towards plate button
    if (sourceBtn) {
      animateFlyToCart(sourceBtn, dish);
    }

    // Trigger rich food added floating popup
    showFoodAddedPopup(dish);
  }

  function updateCartQty(dishId, delta, sourceBtn = null) {
    const idx = state.cart.findIndex((c) => c.id === dishId);
    if (idx === -1) return;

    state.cart[idx].qty += delta;
    const dish = state.cart[idx];
    if (state.cart[idx].qty <= 0) {
      state.cart.splice(idx, 1);
    }

    sounds.playPop();
    saveCartToSession();
    updateCartBadge();
    renderMenu();
    renderCart();

    if (delta > 0 && sourceBtn && dish) {
      animateFlyToCart(sourceBtn, dish);
      showFoodAddedPopup(dish);
    }
  }

  function removeFromCart(dishId) {
    const idx = state.cart.findIndex((c) => c.id === dishId);
    if (idx !== -1) {
      state.cart.splice(idx, 1);
      sounds.playPop();
      saveCartToSession();
      updateCartBadge();
      renderMenu();
      renderCart();
    }
  }

  function updateCartBadge() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (DOM.navCartCount) DOM.navCartCount.textContent = totalCount;
    if (DOM.navStickyCartCount) DOM.navStickyCartCount.textContent = totalCount;
    if (DOM.navStickyCartTotal) DOM.navStickyCartTotal.textContent = `₹${subtotal}`;
    if (DOM.cartItemCountLabel) DOM.cartItemCountLabel.textContent = `(${totalCount} items)`;
  }

  function renderCart() {
    if (state.cart.length === 0) {
      DOM.cartItemsContainer.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-icon">🍱</div>
          <h4 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 0.4rem;">Your Plate is Empty</h4>
          <p style="font-size: 0.88rem;">Add your favorite hot snacks, meals, or refreshing shakes to begin ordering.</p>
        </div>
      `;
      DOM.cartSubtotalVal.textContent = "₹0";
      DOM.cartDiscountRow.style.display = "none";
      DOM.cartGrandtotalVal.textContent = "₹0";
      DOM.btnPlaceOrder.disabled = true;
      DOM.btnPlaceOrder.style.opacity = "0.5";
      return;
    }

    DOM.btnPlaceOrder.disabled = false;
    DOM.btnPlaceOrder.style.opacity = "1";

    DOM.cartItemsContainer.innerHTML = state.cart
      .map(
        (item) => `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-meta">₹${item.price} each • <strong>₹${(item.price * item.qty).toFixed(2)}</strong></div>
          </div>
          <div class="cart-item-actions">
            <div class="cart-stepper-compact">
              <button type="button" class="cart-qty-btn cart-step-minus" data-id="${item.id}" title="Decrease">−</button>
              <span class="cart-qty-count">${item.qty}</span>
              <button type="button" class="cart-qty-btn cart-step-plus" data-id="${item.id}" title="Increase">+</button>
            </div>
            <button type="button" class="cart-item-remove-btn" data-id="${item.id}" title="Remove item">🗑️</button>
          </div>
        </div>
      `
      )
      .join("");

    DOM.cartItemsContainer.querySelectorAll(".cart-step-plus").forEach((btn) => {
      btn.addEventListener("click", () => updateCartQty(btn.dataset.id, 1));
    });
    DOM.cartItemsContainer.querySelectorAll(".cart-step-minus").forEach((btn) => {
      btn.addEventListener("click", () => updateCartQty(btn.dataset.id, -1));
    });
    DOM.cartItemsContainer.querySelectorAll(".cart-item-remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
    });

    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    DOM.cartSubtotalVal.textContent = `₹${subtotal.toFixed(2)}`;

    let discount = 0;
    const user = db.getCurrentUser();

    if (user && user.role === "faculty" && !state.appliedCoupon) {
      discount = subtotal * 0.1;
      DOM.cartDiscountRow.style.display = "flex";
      DOM.cartDiscountVal.textContent = `-₹${discount.toFixed(2)} (Faculty 10%)`;
    } else if (state.appliedCoupon) {
      discount = state.appliedCoupon.discount;
      DOM.cartDiscountRow.style.display = "flex";
      DOM.cartDiscountVal.textContent = `-₹${discount.toFixed(2)} (${state.appliedCoupon.code})`;
    } else {
      DOM.cartDiscountRow.style.display = "none";
    }

    const grandTotal = Math.max(0, subtotal - discount);
    DOM.cartGrandtotalVal.textContent = `₹${grandTotal.toFixed(2)}`;
  }

  // --- CHECKOUT & ORDER PLACEMENT ---
  function placeOrder() {
    if (state.cart.length === 0) return;
    const user = db.getCurrentUser();
    if (!user) {
      openAuthModal();
      return;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    let discount = 0;
    if (user.role === "faculty" && !state.appliedCoupon) {
      discount = subtotal * 0.1;
    } else if (state.appliedCoupon) {
      discount = state.appliedCoupon.discount;
    }
    const grandTotal = Math.max(0, subtotal - discount);
    const paymentMethod = DOM.paymentMethodSelect.value;

    const maxPrep = Math.max(...state.cart.map((i) => i.prepTime || 8));

    const orderPayload = {
      userId: user.id,
      customerName: user.name,
      customerRole: user.role,
      customerMeta: user.role === "student" ? `${user.regNo || "Student"} • ${user.dept || "RIT"}` : `${user.staffId || "Faculty"} • Express`,
      items: state.cart.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty
      })),
      orderType: state.diningType,
      tableNo: state.diningType === "dine-in" ? (DOM.tableNumberInput.value.trim() || "Table (Assigned)") : "Express Counter",
      notes: DOM.kitchenNotesInput.value.trim(),
      subtotal,
      discount,
      couponApplied: state.appliedCoupon ? state.appliedCoupon.code : (user.role === "faculty" ? "FACULTY10" : null),
      total: grandTotal,
      paymentMethod,
      estimatedMinutes: maxPrep
    };

    const newOrder = db.createOrder(orderPayload);

    sounds.playOrderSuccess();
    triggerConfetti();

    state.cart = [];
    state.appliedCoupon = null;
    DOM.couponCodeInput.value = "";
    DOM.couponStatusMsg.textContent = "";
    DOM.kitchenNotesInput.value = "";
    saveCartToSession();
    updateCartBadge();
    renderCart();
    renderMenu();

    closeCartDrawer();
    openTokenModal(newOrder);
    showToast(`Order Placed! Token #${newOrder.token} generated. 🎉`);
  }

  // --- TOKEN MODAL SLIP & SVG QR GENERATOR ---
  function openTokenModal(order) {
    DOM.tokenModalNumber.textContent = `#${order.token}`;
    DOM.tokenModalCounter.textContent = `📍 ${order.counter}`;
    DOM.tokenModalEstTime.textContent = order.status === "ready" 
      ? "🟢 ORDER IS READY FOR PICKUP AT COUNTER!" 
      : `⏱️ Estimated Prep Time: ~${order.estimatedMinutes} Mins`;

    const stepNodes = [
      document.getElementById("step-node-1"),
      document.getElementById("step-node-2"),
      document.getElementById("step-node-3"),
      document.getElementById("step-node-4")
    ];

    stepNodes.forEach((n) => n.classList.remove("active", "completed"));

    let progressPct = "25%";
    if (order.status === "received") {
      progressPct = "25%";
      stepNodes[0].classList.add("active");
    } else if (order.status === "cooking") {
      progressPct = "50%";
      stepNodes[0].classList.add("completed");
      stepNodes[1].classList.add("active");
    } else if (order.status === "ready") {
      progressPct = "75%";
      stepNodes[0].classList.add("completed");
      stepNodes[1].classList.add("completed");
      stepNodes[2].classList.add("active");
    } else if (order.status === "completed") {
      progressPct = "100%";
      stepNodes[0].classList.add("completed");
      stepNodes[1].classList.add("completed");
      stepNodes[2].classList.add("completed");
      stepNodes[3].classList.add("completed");
    }

    DOM.tokenModalProgressFill.style.width = progressPct;
    DOM.tokenModalQrBox.innerHTML = generateQrSvg(`CANTEEN:${order.id}:${order.token}:${order.total}`);

    // Real-time Queue Place Calculation
    if (DOM.tokenModalQueuePos) {
      const orders = db.getOrders();
      const activeQueue = orders.filter((o) => o.status === "received" || o.status === "cooking");
      const orderIndex = activeQueue.findIndex((o) => o.id === order.id);

      if (order.status === "ready") {
        DOM.tokenModalQueuePos.textContent = "🟢 YOUR TURN! PROCEED TO COUNTER";
        DOM.tokenModalQueuePos.style.color = "#10b981";
        DOM.tokenModalOrdersAhead.textContent = `Your meal is ready for collection at ${order.counter}`;
      } else if (order.status === "completed") {
        DOM.tokenModalQueuePos.textContent = "✓ ORDER SERVED & COMPLETED";
        DOM.tokenModalQueuePos.style.color = "#9ca3af";
        DOM.tokenModalOrdersAhead.textContent = "Thank you for dining with us!";
      } else {
        const pos = orderIndex >= 0 ? orderIndex + 1 : 1;
        const ahead = Math.max(0, pos - 1);
        DOM.tokenModalQueuePos.textContent = `Queue Position: #${pos} in Line`;
        DOM.tokenModalQueuePos.style.color = "#ffc482";
        DOM.tokenModalOrdersAhead.textContent = ahead === 0
          ? "Your meal is being prepared right now on the kitchen stove! 🔥"
          : `${ahead} order${ahead > 1 ? "s" : ""} being prepared ahead of yours in the queue`;
      }
    }

    DOM.modalTokenSlip.classList.add("open");
  }

  function generateQrSvg(text) {
    const size = 130;
    const modules = 21;
    const cellSize = size / modules;
    let rects = "";

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        const isTopLeft = row < 7 && col < 7;
        const isTopRight = row < 7 && col >= modules - 7;
        const isBottomLeft = row >= modules - 7 && col < 7;

        let isDark = false;
        if (isTopLeft || isTopRight || isBottomLeft) {
          const r = row >= modules - 7 ? row - (modules - 7) : row;
          const c = col >= modules - 7 ? col - (modules - 7) : col;
          if (r === 0 || r === 6 || c === 0 || c === 6) isDark = true;
          else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) isDark = true;
        } else {
          isDark = Math.sin(row * 13 + col * 17 + hash) > 0.15;
        }

        if (isDark) {
          rects += `<rect x="${(col * cellSize).toFixed(1)}" y="${(row * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" fill="#120e0d"/>`;
        }
      }
    }

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="display:block;">${rects}</svg>`;
  }

  // --- ORDERS HISTORY VIEW ---
  function renderOrdersHistory() {
    const user = db.getCurrentUser();
    if (!user) {
      DOM.ordersHistoryList.innerHTML = `
        <div class="orders-empty-auth-card">
          <div class="orders-auth-icon-badge">🔐</div>
          <h3 class="orders-auth-title">Sign In to View Your Orders & Tokens</h3>
          <p class="orders-auth-subtitle">Please sign in with your RIT student or faculty account to track your real-time tokens, kitchen preparation status, and meal receipts.</p>
          <div class="orders-auth-btn-row">
            <button type="button" class="orders-btn-signin" id="btn-orders-login">🔐 Sign In</button>
            <button type="button" class="orders-btn-register" id="btn-orders-register">✨ Create Account</button>
            <button type="button" class="orders-btn-browse" id="btn-orders-browse">🍔 Browse Menu</button>
          </div>
        </div>
      `;
      document.getElementById("btn-orders-login")?.addEventListener("click", () => openAuthModal("login"));
      document.getElementById("btn-orders-register")?.addEventListener("click", () => openAuthModal("register"));
      document.getElementById("btn-orders-browse")?.addEventListener("click", () => switchView("menu"));
      return;
    }

    const orders = db.getOrders().filter((o) => o.userId === user.id);
    if (orders.length === 0) {
      DOM.ordersHistoryList.innerHTML = `
        <div class="orders-empty-state-card">
          <div class="orders-empty-icon-badge">🍱</div>
          <h3 class="orders-empty-title">No Orders Placed Yet</h3>
          <p class="orders-empty-subtitle">Hey <strong>${user.name}</strong>, you haven't placed any food orders today! Check out our freshly prepared menu items and grab a digital token.</p>
          <button type="button" class="orders-btn-signin" id="btn-orders-empty-menu" style="margin: 0 auto;">🍽️ Explore Menu Now</button>
        </div>
      `;
      document.getElementById("btn-orders-empty-menu")?.addEventListener("click", () => switchView("menu"));
      return;
    }

    const allOrders = db.getOrders();
    const activeQueue = allOrders.filter((o) => o.status === "received" || o.status === "cooking");

    DOM.ordersHistoryList.innerHTML = orders
      .map((order) => {
        const qIndex = activeQueue.findIndex((o) => o.id === order.id);
        const qPos = qIndex >= 0 ? qIndex + 1 : 1;
        const qAhead = Math.max(0, qPos - 1);

        let statusClass = "status-completed";
        let statusLabel = "✓ Order Delivered";
        if (order.status === "ready") {
          statusClass = "status-ready";
          statusLabel = "🟢 Ready for Pickup";
        } else if (order.status === "cooking") {
          statusClass = "status-cooking";
          statusLabel = "🔥 In Kitchen Cooking";
        } else if (order.status === "received") {
          statusClass = "status-received";
          statusLabel = "⏳ Order Received";
        }

        return `
        <div class="history-card">
          <div class="history-card-header">
            <div class="history-card-header-left">
              <span class="history-token-pill">Token #${order.token}</span>
              <span class="history-order-id">#${order.id}</span>
            </div>
            <div class="history-card-header-right">
              ${(order.status === "received" || order.status === "cooking") ? `
                <span class="history-queue-pill">
                  🚶 Queue #${qPos} (${qAhead} ahead)
                </span>
              ` : ""}
              <span class="history-status-badge ${statusClass}">
                ${statusLabel}
              </span>
            </div>
          </div>

          <div class="history-meta-row">
            <div class="history-meta-item">
              <span class="meta-label">Pickup Location:</span>
              <strong class="meta-val">📍 ${order.counter || "Counter 1"}</strong>
            </div>
            <div class="history-meta-item">
              <span class="meta-label">Dining Mode:</span>
              <strong class="meta-val">${order.orderType === "dine-in" ? "🍽️ Dine-in (Table " + (order.tableNo || "1") + ")" : "🛍️ Takeaway / Parcel"}</strong>
            </div>
            <div class="history-meta-item">
              <span class="meta-label">Payment Mode:</span>
              <strong class="meta-val">💳 ${order.paymentMethod ? order.paymentMethod.toUpperCase() : "PAID"}</strong>
            </div>
          </div>

          <div class="history-items-container">
            <div class="history-items-header">Items Ordered (${order.items.reduce((s, i) => s + i.qty, 0)})</div>
            <div class="history-items-list">
              ${order.items.map((i) => `
                <div class="history-item-row">
                  <span class="history-item-name">
                    ${i.diet === "veg" ? "🟢" : "🔴"} ${i.name}
                    <span class="history-item-qty">× ${i.qty}</span>
                  </span>
                  <span class="history-item-price">₹${i.price * i.qty}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="history-card-footer">
            <div class="history-total-col">
              <span class="history-total-label">Grand Total Paid</span>
              <span class="history-total-amount">₹${order.total}</span>
            </div>
            <button type="button" class="history-btn-view-token btn-reopen-token" data-id="${order.id}">
              📱 View QR Token Slip
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    DOM.ordersHistoryList.querySelectorAll(".btn-reopen-token").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ord = orders.find((o) => o.id === btn.dataset.id);
        if (ord) openTokenModal(ord);
      });
    });
  }

  // --- MODAL CONTROLS ---
  function openCartDrawer() {
    sounds.playTap();
    renderCart();
    DOM.cartDrawerOverlay.classList.add("open");
  }

  function closeCartDrawer() {
    DOM.cartDrawerOverlay.classList.remove("open");
  }

  function openWalletModal() {
    const user = db.getCurrentUser();
    if (!user) return;
    DOM.modalWalletCurrentBal.textContent = `₹${(user.walletBalance || 0).toFixed(2)}`;
    DOM.modalWalletTopup.classList.add("open");
  }

  function closeWalletModal() {
    DOM.modalWalletTopup.classList.remove("open");
  }

  function openAuthModal(mode = "login") {
    sounds.playTap();
    if (mode === "register") {
      switchToRegisterTab();
    } else {
      switchToLoginTab();
    }
    DOM.modalAuth.classList.add("open");
    DOM.modalAuth.classList.add("active");
  }

  function closeAuthModal() {
    DOM.modalAuth.classList.remove("open");
    DOM.modalAuth.classList.remove("active");
  }

  function switchToLoginTab() {
    if (DOM.tabBtnLogin) DOM.tabBtnLogin.classList.add("active");
    if (DOM.tabBtnRegister) DOM.tabBtnRegister.classList.remove("active");
    if (DOM.formLogin) DOM.formLogin.style.display = "block";
    if (DOM.formRegister) DOM.formRegister.style.display = "none";
  }

  function switchToRegisterTab() {
    if (DOM.tabBtnRegister) DOM.tabBtnRegister.classList.add("active");
    if (DOM.tabBtnLogin) DOM.tabBtnLogin.classList.remove("active");
    if (DOM.formRegister) DOM.formRegister.style.display = "block";
    if (DOM.formLogin) DOM.formLogin.style.display = "none";
  }

  // --- FLYING DISH ANIMATION TO PLATE ---
  function animateFlyToCart(sourceElement, dish) {
    try {
      const targetBtn = DOM.btnNavbarCart || DOM.btnOpenCart;
      if (!targetBtn || !sourceElement) return;

      const sourceRect = sourceElement.getBoundingClientRect();
      const targetRect = targetBtn.getBoundingClientRect();

      const flyer = document.createElement("div");
      flyer.className = "flying-plate-ball";

      if (dish && dish.image) {
        flyer.innerHTML = `<img src="${dish.image}" alt="">`;
      } else {
        flyer.innerHTML = `<span style="font-size:24px;">🍽️</span>`;
      }

      const startX = sourceRect.left + sourceRect.width / 2 - 25;
      const startY = sourceRect.top + sourceRect.height / 2 - 25;
      const endX = targetRect.left + targetRect.width / 2 - 20;
      const endY = targetRect.top + targetRect.height / 2 - 20;

      flyer.style.left = `${startX}px`;
      flyer.style.top = `${startY}px`;
      flyer.style.width = "50px";
      flyer.style.height = "50px";
      flyer.style.transition = "all 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)";
      flyer.style.transform = "scale(1) rotate(0deg)";

      document.body.appendChild(flyer);

      requestAnimationFrame(() => {
        flyer.style.left = `${endX}px`;
        flyer.style.top = `${endY}px`;
        flyer.style.transform = "scale(0.3) rotate(360deg)";
        flyer.style.opacity = "0.7";
      });

      setTimeout(() => {
        flyer.remove();
        targetBtn.classList.add("cart-bounce-bump");
        if (DOM.btnOpenCart) DOM.btnOpenCart.classList.add("cart-bounce-bump");
        setTimeout(() => {
          targetBtn.classList.remove("cart-bounce-bump");
          if (DOM.btnOpenCart) DOM.btnOpenCart.classList.remove("cart-bounce-bump");
        }, 400);
      }, 650);
    } catch (e) {
      console.error("Fly animation error:", e);
    }
  }

  // --- RICH FOOD ADDED FLOATING POPUP ---
  function showFoodAddedPopup(dish) {
    const container = DOM.toastContainer;
    if (!container) return;

    // Remove any existing food added popup
    container.querySelectorAll(".food-added-popup").forEach((el) => el.remove());

    const popup = document.createElement("div");
    popup.className = "food-added-popup";
    popup.innerHTML = `
      <img src="${dish.image}" class="popup-dish-img" alt="${dish.name}">
      <div class="popup-content">
        <div class="popup-title-row">
          <span class="popup-check-icon">✓</span>
          <span class="popup-title">Added to Plate!</span>
        </div>
        <div class="popup-dish-name">${dish.name}</div>
        <div class="popup-dish-price">₹${dish.price} • ${dish.category}</div>
      </div>
      <button type="button" class="popup-view-cart-btn" id="popup-btn-view-cart">
        View Plate ➜
      </button>
      <button type="button" class="popup-close-btn" aria-label="Close">✕</button>
    `;

    popup.querySelector(".popup-close-btn").addEventListener("click", () => {
      popup.style.opacity = "0";
      popup.style.transform = "translateY(-10px)";
      setTimeout(() => popup.remove(), 250);
    });

    popup.querySelector("#popup-btn-view-cart").addEventListener("click", () => {
      openCartDrawer();
      popup.remove();
    });

    container.appendChild(popup);

    setTimeout(() => {
      if (popup.parentElement) {
        popup.style.opacity = "0";
        popup.style.transform = "translateY(-10px)";
        setTimeout(() => popup.remove(), 250);
      }
    }, 6000);
  }

  // --- SYSTEM TOAST NOTIFICATIONS ---
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast-item";
    if (type === "error") toast.style.borderColor = "#ef4444";
    if (type === "success") toast.style.borderColor = "#10b981";

    toast.innerHTML = `<span>🔔</span> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- CONFETTI PARTICLE ANIMATOR ---
  function triggerConfetti() {
    const canvas = DOM.confettiCanvas;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#ff9f1c", "#ff6b35", "#ffb703", "#10b981", "#ef4444", "#38bdf8"];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 3,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        life: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35;
          p.rot += p.vr;
          p.life -= 0.016;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }

  // --- EVENT BINDING ---
  function bindEvents() {
    DOM.brandLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("menu");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    DOM.navBtnMenu.addEventListener("click", () => {
      switchView("menu");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    DOM.navBtnOrders.addEventListener("click", () => switchView("orders"));

    // Intercept all anchor navigation so clicking them when in Orders view switches back to Menu view!
    document.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const targetId = href.substring(1);
        if (targetId === "view-orders") {
          e.preventDefault();
          switchView("orders");
          return;
        }
        if (state.activeView !== "menu" && targetId !== "site-footer") {
          switchView("menu");
        }
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }, 60);
        }
      });
    });

    // Categories dropdown button
    const catBtn = document.querySelector(".nav-cat-dropdown-btn");
    if (catBtn) {
      catBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (state.activeView !== "menu") {
          switchView("menu");
        }
        setTimeout(() => {
          document.getElementById("categories-showcase")?.scrollIntoView({ behavior: "smooth" });
        }, 60);
      });
    }

    // Back to Menu button inside My Orders view
    const btnBackMenu = document.getElementById("btn-back-to-menu");
    if (btnBackMenu) {
      btnBackMenu.addEventListener("click", () => switchView("menu"));
    }

    // Sound Toggle

    DOM.btnToggleSound.addEventListener("click", () => {
      const isMuted = sounds.toggleMute();
      DOM.btnToggleSound.textContent = isMuted ? "🔇" : "🔊";
      showToast(isMuted ? "Sound muted" : "Sound unmuted");
    });

    DOM.menuSearchInput.addEventListener("input", (e) => {
      if (state.activeView !== "menu") switchView("menu");
      state.searchQuery = e.target.value;
      DOM.btnSearchClear.style.display = state.searchQuery ? "block" : "none";
      renderMenu();
    });

    DOM.btnSearchClear.addEventListener("click", () => {
      if (state.activeView !== "menu") switchView("menu");
      DOM.menuSearchInput.value = "";
      state.searchQuery = "";
      DOM.btnSearchClear.style.display = "none";
      renderMenu();
    });

    DOM.btnSearchTrigger.addEventListener("click", () => {
      if (state.activeView !== "menu") switchView("menu");
      state.searchQuery = DOM.menuSearchInput.value;
      renderMenu();
      document.getElementById("menu-controls")?.scrollIntoView({ behavior: "smooth" });
    });

    DOM.categoryTabsRow.querySelectorAll(".category-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        sounds.playTap();
        DOM.categoryTabsRow.querySelectorAll(".category-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.activeCategory = btn.dataset.category;
        renderMenu();
      });
    });

    DOM.dietPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        sounds.playTap();
        DOM.dietPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        state.activeDiet = pill.dataset.diet;
        renderMenu();
      });
    });

    DOM.sortDropdownSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderMenu();
    });

    DOM.btnOpenCart.addEventListener("click", openCartDrawer);
    if (DOM.btnNavbarCart) {
      DOM.btnNavbarCart.addEventListener("click", openCartDrawer);
    }
    DOM.btnCloseCart.addEventListener("click", closeCartDrawer);
    DOM.cartDrawerOverlay.addEventListener("click", (e) => {
      if (e.target === DOM.cartDrawerOverlay) closeCartDrawer();
    });

    // Student / Customer Logout Button
    if (DOM.btnCustomerLogout) {
      DOM.btnCustomerLogout.addEventListener("click", () => {
        db.logout();
        sounds.playPop();
        showToast("Logged out successfully. 👋", "info");
        renderUserNav();
        renderLiveQueue();
        if (state.activeView === "orders") switchView("menu");
      });
    }

    // Guest Auth Actions
    if (DOM.btnOpenSignin) {
      DOM.btnOpenSignin.addEventListener("click", () => openAuthModal("login"));
    }
    if (DOM.btnOpenSignup) {
      DOM.btnOpenSignup.addEventListener("click", () => openAuthModal("register"));
    }
    if (DOM.footerLoginLink) {
      DOM.footerLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        openAuthModal("login");
      });
    }
    if (DOM.btnCloseAuthModal) {
      DOM.btnCloseAuthModal.addEventListener("click", closeAuthModal);
    }
    if (DOM.modalAuth) {
      DOM.modalAuth.addEventListener("click", (e) => {
        if (e.target === DOM.modalAuth) closeAuthModal();
      });
    }

    // Login Form Submit
    if (DOM.formLogin) {
      DOM.formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const pass = document.getElementById("login-password").value;
        const res = db.login(email, pass);
        if (res.success) {
          sounds.playPop();
          showToast(`Welcome back, ${res.user.name}!`, "success");
          closeAuthModal();
          renderUserNav();
          renderLiveQueue();
          DOM.formLogin.reset();
        } else {
          showToast(res.message, "error");
        }
      });
    }

    // Register Form Submit
    if (DOM.formRegister) {
      DOM.formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const role = document.getElementById("reg-role").value;
        const regNo = document.getElementById("reg-id").value.trim();
        const password = document.getElementById("reg-password").value;

        const res = db.register({ name, email, role, regNo, password });
        if (res.success) {
          db.setCurrentUser(res.user);
          sounds.playOrderSuccess();
          triggerConfetti();
          showToast(`Welcome, ${name}! Your account has been created. 🎉`, "success");
          closeAuthModal();
          renderUserNav();
          renderLiveQueue();
          DOM.formRegister.reset();
        } else {
          showToast(res.message, "error");
        }
      });
    }

    DOM.btnOrderTypeTakeaway.addEventListener("click", () => {
      state.diningType = "takeaway";
      DOM.btnOrderTypeTakeaway.classList.add("active");
      DOM.btnOrderTypeDinein.classList.remove("active");
      DOM.tableSelectRow.style.display = "none";
    });

    DOM.btnOrderTypeDinein.addEventListener("click", () => {
      state.diningType = "dine-in";
      DOM.btnOrderTypeDinein.classList.add("active");
      DOM.btnOrderTypeTakeaway.classList.remove("active");
      DOM.tableSelectRow.style.display = "block";
    });

    DOM.btnApplyCoupon.addEventListener("click", () => {
      const code = DOM.couponCodeInput.value;
      const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const user = db.getCurrentUser();
      const res = db.validateCoupon(code, subtotal, user ? user.role : "student");

      if (res.valid) {
        state.appliedCoupon = res;
        DOM.couponStatusMsg.style.color = "#10b981";
        DOM.couponStatusMsg.textContent = `✓ ${res.message} (-₹${res.discount})`;
        sounds.playPop();
        renderCart();
      } else {
        state.appliedCoupon = null;
        DOM.couponStatusMsg.style.color = "#ef4444";
        DOM.couponStatusMsg.textContent = `✕ ${res.message}`;
        renderCart();
      }
    });

    DOM.btnPlaceOrder.addEventListener("click", placeOrder);

    DOM.btnCloseTokenModal.addEventListener("click", () => {
      DOM.modalTokenSlip.classList.remove("open");
    });
    DOM.btnPrintToken.addEventListener("click", () => {
      window.print();
    });

    if (DOM.navWalletPill) {
      DOM.navWalletPill.addEventListener("click", openWalletModal);
    }
    if (DOM.btnCloseWalletModal) {
      DOM.btnCloseWalletModal.addEventListener("click", closeWalletModal);
    }

    // Auth Modal Triggers & Tab Controls
    if (DOM.navUserProfile) {
      DOM.navUserProfile.addEventListener("click", () => openAuthModal("login"));
    }
    if (DOM.btnCloseAuthModal) {
      DOM.btnCloseAuthModal.addEventListener("click", closeAuthModal);
    }
    if (DOM.modalAuth) {
      DOM.modalAuth.addEventListener("click", (e) => {
        if (e.target === DOM.modalAuth) closeAuthModal();
      });
    }

    if (DOM.tabBtnLogin) {
      DOM.tabBtnLogin.addEventListener("click", switchToLoginTab);
    }
    if (DOM.tabBtnRegister) {
      DOM.tabBtnRegister.addEventListener("click", switchToRegisterTab);
    }
    if (DOM.linkToRegister) {
      DOM.linkToRegister.addEventListener("click", switchToRegisterTab);
    }
    if (DOM.linkToLogin) {
      DOM.linkToLogin.addEventListener("click", switchToLoginTab);
    }

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
