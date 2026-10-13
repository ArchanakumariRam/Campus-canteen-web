# 🍽️ RIT Canteen Pro — Full-Stack MERN Canteen Management System

> **A high-performance, full-stack MERN (MongoDB, Express.js, React, Node.js) Smart Cafeteria Management System featuring dual-portal separation, Live Kitchen Display System (KDS), student digital meal wallet, and QR token slip dispatch.**

---

## 🏛️ System Architecture: True MERN Stack

```
               ┌────────────────────────────────────────────────────────┐
               │          React.js Client (Vite + Modern UI)            │
               │  - Student Portal: Live Menu, Cart Drawer, Token Slip   │
               │  - Staff Portal: Live KDS Kanban, Stock, Revenue KPIs  │
               └───────────────────────────▲────────────────────────────┘
                                           │ HTTP / REST APIs (JSON)
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │           Node.js & Express.js REST API Server         │
               │  - /api/menu    - /api/orders    - /api/auth    - /api/kpi │
               └───────────────────────────▲────────────────────────────┘
                                           │ Mongoose ODM (Object Modeling)
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                 MongoDB Database (NoSQL)               │
               │  - Users Collection      - MenuItems Collection        │
               │  - Orders Collection     - Wallet Transactions         │
               └────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack Breakdown

| MERN Component | Technology | Role & Details |
| :---: | :--- | :--- |
| **M** | **MongoDB & Mongoose ODM** | Schema validation, collections for `Users`, `MenuItems`, and `Orders`. Supports both local MongoDB (`mongodb://localhost:27017/rit_canteen_pro`) and MongoDB Atlas cloud clusters. |
| **E** | **Express.js (v4.19)** | Backend web framework providing RESTful API endpoints for menu, orders, authentication, and analytics. |
| **R** | **React.js (v18.3) + Vite** | Component-driven UI using React Hooks (`useState`, `useEffect`, `useMemo`), Context API (`AuthContext`, `CartContext`), and 60 FPS CSS keyframe animations. |
| **N** | **Node.js (v18+)** | High-performance asynchronous JavaScript server runtime hosting the REST API and serving client bundles. |

---

## 🗄️ MongoDB Database Collections & Schemas

### 1. `Users` Collection (`models/User.js`)
* `userId` (String, Unique) — e.g., `"usr-01"`
* `name` (String) — Full name of student or faculty
* `email` (String, Unique) — Login credential
* `password` (String) — Secure hashed credential
* `role` (String) — `'student' | 'faculty' | 'admin' | 'kitchen'`
* `studentId` (String) — e.g., `"2024CS042"`
* `walletBalance` (Number) — Digital balance (₹)
* `avatar` (String) — Profile picture URL

### 2. `MenuItems` Collection (`models/MenuItem.js`)
* `itemId` (String, Unique) — e.g., `"dish-01"`
* `name` (String) — e.g., `"Hyderabadi Dum Chicken Biryani"`
* `category` (String) — `'breakfast' | 'snacks' | 'meals' | 'fastfood' | 'beverages' | 'desserts'`
* `price` (Number) — Price in INR (₹)
* `veg` (Boolean) — Pure Veg (`true`) or Non-Veg (`false`)
* `prepTime` (String) — Average preparation duration
* `rating` (Number) & `ratingCount` (Number) — Community reviews
* `calories` (Number) — Nutritional caloric count
* `inStock` (Boolean) — Live counter availability toggle
* `image` (String) & `description` (String)

### 3. `Orders` Collection (`models/Order.js`)
* `orderId` (String, Unique) — Order identifier
* `tokenNumber` (String) — Sequential counter token slip (e.g., `"#TK-101"`)
* `customer` (Object) — `userId`, `name`, `role`, `studentId`
* `items` (Array) — Array of sub-documents (`itemId`, `name`, `price`, `quantity`, `veg`)
* `totalAmount` (Number) — Total bill in INR
* `status` (String) — `'pending' | 'cooking' | 'ready' | 'completed' | 'cancelled'`
* `pickupCounter` (Number) — Assigned counter (1, 2, or 3)
* `tableNumber` (String) — Dine-in or Counter pickup
* `cookingNotes` (String) — Special student customizations
* `createdAt` (Date) — Timestamp

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/menu` | List all dishes (supports `?category=`, `?diet=`, `?search=`, `?sort=`) |
| `GET` | `/api/menu/:id` | Get details of a single dish |
| `POST` | `/api/menu` | Add a new dish to the cafeteria catalog (Admin) |
| `PATCH`| `/api/menu/:id/stock` | Toggle dish between In-Stock and Sold-Out |
| `DELETE`| `/api/menu/:id` | Remove a dish from the catalog |
| `GET` | `/api/orders` | Fetch orders list (supports status & customer filters) |
| `GET` | `/api/orders/queue/live` | Live Waiting Queue ticker metrics (`callingToken`, `waitingCount`, `estWait`) |
| `POST` | `/api/orders` | Place new order, deduct user wallet, and generate token slip |
| `PATCH`| `/api/orders/:id/status` | Move order status along kitchen workflow (`cooking`, `ready`, `completed`) |
| `POST` | `/api/auth/login` | Authenticate student, faculty, or staff |
| `GET` | `/api/auth/users` | List accounts for admin inspection and demo switching |
| `POST` | `/api/auth/wallet/topup` | Top-up digital meal wallet |
| `GET` | `/api/kpi` | Real-time revenue, order counts, and kitchen metrics |

---

## 🚀 How to Run the Project

### Prerequisites:
- **Node.js** (v18 or higher) installed
- **MongoDB** (Local daemon or MongoDB Atlas URI) *[Optional: runs with built-in auto-persistence if MongoDB is offline]*

### Option 1: Quick Start (Full-Stack Backend + Client)
```bash
# 1. Install dependencies
npm run install-all

# 2. Start the Express & Mongoose API Server
npm start
```
* **Server & API:** `http://localhost:5000`
* **Student Canteen Portal:** `http://localhost:5000`
* **Staff & Admin Operations:** `http://localhost:5000/admin.html`

### Option 2: Running React in Vite Development Mode
```bash
# Terminal 1: Start Express Backend
npm run server

# Terminal 2: Start React Vite Client
npm run client
```
Open **`http://localhost:3000`** in your browser.

### Deploying to Vercel

The repository includes a Vercel configuration for the built React client and
the `/api` serverless function. Import the project into Vercel with the project
root as the deployment root. Before deploying, add `MONGO_URI` to the Vercel
project's Environment Variables and set it to a MongoDB Atlas connection URI.
The local MongoDB address (`mongodb://localhost:27017`) is only reachable from
your own computer and cannot be used by Vercel. Redeploy after saving the
environment variable.

After deployment, the student portal is available at the deployment URL, the
staff portal at `/admin.html`, and the API health check at `/api/health`.

---

## 🔑 Demo Access Credentials

### 1. Student / Customer Portal
* **Student:** `student@campus.edu` / `password123` (Aryan Sharma — Wallet: ₹420)
* **Faculty:** `faculty@campus.edu` / `password123` (Dr. Meenakshi — Wallet: ₹1,250)

### 2. Staff & Admin Operations Portal
* **Canteen Director:** `admin@campus.edu` / `password123` (Full Management & Analytics)
* **Kitchen Chef:** `kitchen@campus.edu` / `password123` (Live Kitchen Display Board)

---

## 🎨 Theme & Aesthetics
* **Theme:** Clean & Impressive Canteen Ordering System Theme (Crimson Red & Pure White)
* **Palette:** Appetizing Crimson Red (`#d9232d`), Pure White (`#ffffff`), Crisp Slate (`#0f172a`), Deep Corporate Footer (`#1e242d`), Warm Amber (`#f59e0b`).
* **Visual Structure:** 
  - Top Campus Helpline & Location bar
  - Center search header with instant dish finder
  - Crimson category bar with dropdown triggers
  - High-res food hero banner (`canteen-banner.jpg`)
  - 4 Trust & Service highlight cards (Quality, 8-Min Pickup, Cashless Wallet, 24/7 Alerts)
  - About Canteen operational statistics overview
  - 3 Special Offer promotional banners (Combo Saver, Evening Snacks, Royal Lunch Thali)
  - 8-category visual showcase grid with direct filter triggers
  - Live cafeteria queue ticker and 12+ menu dishes grid
  - Corporate 4-column footer with payment logos and campus directory

---

## 🏛️ Campus Project Information
> **Rajarambapu Institute of Technology (RIT) Campus Cafeteria Management Suite**  
> *Official full-stack MERN digital dining system for students, faculty, and cafeteria kitchen staff.*
