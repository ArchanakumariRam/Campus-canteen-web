# 🍽️ Campus Canteen Pro — Master System Specification & Prompt

## 1. System Overview & Vision
**Campus Canteen Pro** is a modern, responsive, full-featured web-based Canteen & Cafeteria Management System engineered for colleges, universities, and corporate campuses. The system eliminates long physical queues, automates meal preparation tracking via a Kitchen Display System (KDS), provides instant digital token generation with verifiable QR codes, and supports seamless multi-role authentication (Student, Faculty/Staff, Kitchen Chef, and Canteen Manager/Admin).

The application is completely self-contained with a robust **Local Database (LocalStorage / IndexedDB)** layer, zero external cloud dependencies, built-in sound synthesis via Web Audio API, and 1-click database export/import. This makes the project 100% portable and shareable via ZIP or USB without any complex server or database setup.

---

## 2. Core User Roles & Permissions Matrix

| Feature / Capability | Student | Faculty / Staff | Kitchen Chef (KDS) | Canteen Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Menu & Dietary Filters** | ✅ | ✅ | ✅ | ✅ |
| **Cart & Custom Food Requests** | ✅ | ✅ | ❌ | ❌ |
| **Digital Wallet & 1-Click Top-up** | ✅ | ✅ | ❌ | ✅ (Adjust Balances) |
| **Staff Priority Counter & Discount**| ❌ | ✅ (10% Auto) | ❌ | ❌ |
| **Order Placement & Token Generation**| ✅ | ✅ | ❌ | ❌ |
| **Live Order Tracking & Countdown** | ✅ (Own orders) | ✅ (Own orders) | ❌ | ✅ (All orders) |
| **Kitchen Kanban Display (KDS)** | ❌ | ❌ | ✅ (Full Control) | ✅ |
| **1-Click Order Stage Transitions** | ❌ | ❌ | ✅ | ✅ |
| **Menu Item CRUD & Stock Toggle** | ❌ | ❌ | ❌ | ✅ |
| **Sales Analytics & Revenue Metrics** | ❌ | ❌ | ❌ | ✅ |
| **Export / Import Database (JSON)** | ❌ | ❌ | ❌ | ✅ |

---

## 3. Visual Aesthetics & Animation Guidelines ("Bistro Amber & Spice Dark")
- **Color Palette**:
  - Primary Accent: Sun-ripened Amber (`#ff9f1c`) & Saffron Gold (`#f59e0b`)
  - Accent Secondary: Flame Orange (`#ff6b35`) & Spicy Red (`#ef4444`)
  - Background: Midnight Espresso (`#0f0c0b`, `#1a1513`, `#261f1c`)
  - Surface Glass: Frosted Acrylic Glass `rgba(38, 31, 28, 0.75)` with 16px backdrop blur and delicate amber borders (`rgba(255, 159, 28, 0.15)`)
  - Dietary Indicators: Official Indian/International FSSAI standards — Green square with green dot (Pure Veg), Brown/Red square with red triangle (Non-Veg), Teal badge (Vegan/Beverage)
- **Canteen-Themed Animations**:
  - Rising steam animation on hot items (Coffee, Thalis, Biryani, Soup)
  - Subtle floating food particles in hero header (🍔, 🍕, ☕, 🥟, 🥤, 🍛)
  - Interactive item card hover with lift, glow, and micro-bounce on cart addition
  - Live order pulse animations (Received ➔ Preparing ➔ Ready for Pickup ➔ Completed)
  - Celebratory confetti burst on successful checkout
  - Synthesized audio chimes for kitchen order notifications and customer pickup announcements

---

## 4. Local Database Schema (`canteen_db_v1`)

```json
{
  "users": [
    {
      "id": "usr_stu_01",
      "name": "Aryan Sharma",
      "email": "aryan@campus.edu",
      "role": "student",
      "regNo": "2024CS042",
      "walletBalance": 450.00,
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"
    }
  ],
  "menu": [
    {
      "id": "dish_01",
      "name": "Paneer Butter Masala Combo",
      "category": "thali",
      "diet": "veg",
      "price": 140,
      "prepTime": 12,
      "inStock": true,
      "rating": 4.8,
      "image": "...",
      "description": "Rich cottage cheese gravy served with 2 butter naans, jeera rice, and salad."
    }
  ],
  "orders": [
    {
      "id": "ORD-8492",
      "token": "TK-104",
      "userId": "usr_stu_01",
      "customerName": "Aryan Sharma",
      "customerRole": "student",
      "items": [{ "id": "dish_01", "name": "...", "qty": 2, "price": 140 }],
      "orderType": "takeaway",
      "total": 280,
      "paymentMethod": "wallet",
      "status": "cooking",
      "createdAt": "2026-10-11T20:15:00Z",
      "estimatedReadyAt": "2026-10-11T20:27:00Z",
      "counter": 2
    }
  ],
  "transactions": [],
  "coupons": [
    { "code": "CAMPUS20", "discountPercent": 20, "minOrder": 150 },
    { "code": "SNACK50", "discountAmount": 50, "minOrder": 200 }
  ]
}
```

---

## 5. End-to-End User Flow & Experience
1. **Instant Quick-Login / Demo Switcher**:
   - The user or reviewer can click 1 button (`[🎓 Student]`, `[👨‍🏫 Faculty]`, `[👨‍🍳 Kitchen KDS]`, `[👑 Admin]`) to instantly experience that role without entering passwords.
2. **Order Placement**:
   - Filter by categories (Breakfast, Snacks, Meals & Thalis, Fast Food, Beverages, Desserts).
   - Filter by dietary preferences (Veg Only, Non-Veg, High Protein, Chef's Specials).
   - Add items, adjust quantity, add special preparation notes (e.g., "extra spicy", "no onion").
   - Select Dining Type: **Dine-in (Table Counter)** or **Express Takeaway**.
   - Pay with Digital Wallet or Cash at Counter.
3. **Token & Pickup Generation**:
   - Immediate receipt with Token Number (e.g. `#TK-108`) and high-resolution SVG QR code.
   - Live status stepper updating in real-time.
4. **Kitchen Display System (KDS)**:
   - Kitchen staff see live tickets sorted chronologically.
   - 1-click status transitions: `Pending` ➔ `Cooking` ➔ `Ready for Pickup` ➔ `Served`.
   - Audio notification triggers when a dish is marked ready.
5. **Canteen Management & Admin**:
   - Real-time revenue, order volume, and top-selling dishes.
   - Menu Editor: Add new dishes, edit price, upload or choose photo, toggle out-of-stock.
   - Full JSON Export / Import tool to save and restore database snapshots.
