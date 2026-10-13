// RIT Canteen Pro - Seed Data Catalog for MongoDB & Memory Engine
const initialDishes = [
  {
    itemId: "dish-01",
    name: "Hyderabadi Dum Chicken Biryani",
    category: "meals",
    price: 170,
    veg: false,
    prepTime: "10m",
    rating: 5.0,
    ratingCount: 380,
    calories: 740,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop",
    description: "Aromatic long-grain basmati rice slow-cooked on dum with marinated chicken, saffron, fried onions, and served with spicy salan & cooling mint raita.",
    badge: "Campus #1 Rated 🔥",
    isBestseller: true,
    inStock: true,
    counterNo: 2
  },
  {
    itemId: "dish-02",
    name: "Special Cutting Masala Chai",
    category: "beverages",
    price: 20,
    veg: true,
    prepTime: "2m",
    rating: 5.0,
    ratingCount: 450,
    calories: 90,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop",
    description: "Brewed fresh with Assam tea leaves, crushed ginger, cardamom, and whole milk. Served piping hot in authentic cutting glasses.",
    badge: "Fuel of Campus ☕",
    isBestseller: true,
    inStock: true,
    counterNo: 3
  },
  {
    itemId: "dish-03",
    name: "Crispy Masala Dosa",
    category: "breakfast",
    price: 75,
    veg: true,
    prepTime: "8m",
    rating: 4.9,
    ratingCount: 142,
    calories: 320,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop",
    description: "Golden rice crepe stuffed with spiced potato mash, served with coconut chutney & piping hot sambar.",
    badge: "Student Fav 🌟",
    isBestseller: true,
    inStock: true,
    counterNo: 1
  },
  {
    itemId: "dish-04",
    name: "Hot Punjabi Samosa (2 pcs)",
    category: "snacks",
    price: 40,
    veg: true,
    prepTime: "3m",
    rating: 4.9,
    ratingCount: 310,
    calories: 290,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop",
    description: "Crispy golden pastry filled with spiced green peas and potato chunks, served with tangy tamarind & spicy mint chutney.",
    badge: "Bestseller 🔥",
    isBestseller: true,
    inStock: true,
    counterNo: 1
  },
  {
    itemId: "dish-05",
    name: "Crispy Peri Peri Chicken Popcorn",
    category: "fastfood",
    price: 115,
    veg: false,
    prepTime: "8m",
    rating: 4.9,
    ratingCount: 195,
    calories: 440,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop",
    description: "Bite-sized tender chicken cubes double coated in crunch batter, tossed in zesty African peri peri spice.",
    badge: "Hot & Crispy 🍗",
    isBestseller: true,
    inStock: true,
    counterNo: 2
  },
  {
    itemId: "dish-06",
    name: "Shahi Paneer Deluxe Thali",
    category: "meals",
    price: 150,
    veg: true,
    prepTime: "12m",
    rating: 4.9,
    ratingCount: 220,
    calories: 680,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
    description: "Creamy royal cottage cheese curry, Dal Tadka, Jeera Rice, 2 Butter Rotis, Gulab Jamun sweet, crunchy salad & roasted papad.",
    badge: "Complete Meal 🍱",
    isBestseller: true,
    inStock: true,
    counterNo: 2
  },
  {
    itemId: "dish-07",
    name: "Crispy Zing Chicken Burger",
    category: "fastfood",
    price: 135,
    veg: false,
    prepTime: "10m",
    rating: 4.9,
    ratingCount: 260,
    calories: 590,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
    description: "Marinated whole chicken breast fillet fried to golden crunch, iceberg lettuce, spiced mayonnaise in toasted sesame brioche bun.",
    badge: "Crispy Delight 🍗",
    isBestseller: false,
    inStock: true,
    counterNo: 2
  },
  {
    itemId: "dish-08",
    name: "Thick Cold Coffee with Choco Drizzle",
    category: "beverages",
    price: 65,
    veg: true,
    prepTime: "4m",
    rating: 4.9,
    ratingCount: 310,
    calories: 260,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop",
    description: "Double espresso blended with chilled creamy milk, chocolate syrup, topped with rich cocoa dusting.",
    badge: "Crowd Favorite ☕",
    isBestseller: false,
    inStock: true,
    counterNo: 3
  },
  {
    itemId: "dish-09",
    name: "Oreo & KitKat Thick Shake",
    category: "beverages",
    price: 85,
    veg: true,
    prepTime: "5m",
    rating: 4.9,
    ratingCount: 175,
    calories: 410,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop",
    description: "Creamy vanilla ice cream churned with crushed Oreo cookies, KitKat fingers, and dark chocolate ganache.",
    badge: "Sweet Rush 🍫",
    isBestseller: false,
    inStock: true,
    counterNo: 3
  },
  {
    itemId: "dish-10",
    name: "Warm Gulab Jamun with Rabri (2 pcs)",
    category: "desserts",
    price: 60,
    veg: true,
    prepTime: "2m",
    rating: 4.9,
    ratingCount: 180,
    calories: 340,
    image: "https://images.unsplash.com/photo-1605197148560-84cf0efd32b5?w=600&auto=format&fit=crop",
    description: "Hot, syrup-soaked khoya dumplings served with a generous dollop of chilled thickened cardamom rabri.",
    badge: "Melt In Mouth 🍯",
    isBestseller: false,
    inStock: true,
    counterNo: 3
  },
  {
    itemId: "dish-11",
    name: "Warm Choco Lava Cake",
    category: "desserts",
    price: 80,
    veg: true,
    prepTime: "3m",
    rating: 4.9,
    ratingCount: 160,
    calories: 380,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop",
    description: "Decadent dark chocolate sponge cake with an irresistible flowing warm chocolate fudge lava center.",
    badge: "Molten Center 🍫",
    isBestseller: false,
    inStock: true,
    counterNo: 3
  },
  {
    itemId: "dish-12",
    name: "Amritsari Chole Bhature",
    category: "breakfast",
    price: 95,
    veg: true,
    prepTime: "10m",
    rating: 4.8,
    ratingCount: 118,
    calories: 560,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop",
    description: "Two jumbo fluffy bhature served with rich dark chickpea gravy, pickled onions, and mint chutney.",
    badge: "Chef Special 🌟",
    isBestseller: false,
    inStock: true,
    counterNo: 1
  }
];

const initialUsers = [
  {
    userId: "usr-01",
    name: "Aryan Sharma",
    email: "student@campus.edu",
    password: "password123",
    role: "student",
    studentId: "2024CS042",
    department: "Computer Science",
    walletBalance: 420,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
  },
  {
    userId: "usr-02",
    name: "Dr. Meenakshi Iyer",
    email: "faculty@campus.edu",
    password: "password123",
    role: "faculty",
    studentId: "FAC-108",
    department: "Electronics & Communication",
    walletBalance: 1250,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
  },
  {
    userId: "usr-03",
    name: "Director Vikram",
    email: "admin@campus.edu",
    password: "password123",
    role: "admin",
    studentId: "ADM-001",
    department: "Campus Operations",
    walletBalance: 9999,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    userId: "usr-04",
    name: "Chef Rajesh",
    email: "kitchen@campus.edu",
    password: "password123",
    role: "kitchen",
    studentId: "CHEF-007",
    department: "Executive Kitchen",
    walletBalance: 500,
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150"
  }
];

const initialOrders = [
  {
    orderId: "ord-101",
    tokenNumber: "#TK-101",
    customer: {
      userId: "usr-01",
      name: "Aryan Sharma",
      role: "student",
      studentId: "2024CS042"
    },
    items: [
      { itemId: "dish-01", name: "Hyderabadi Dum Chicken Biryani", price: 170, quantity: 1, veg: false },
      { itemId: "dish-02", name: "Special Cutting Masala Chai", price: 20, quantity: 1, veg: true }
    ],
    totalAmount: 190,
    status: "ready",
    pickupCounter: 2,
    tableNumber: "Counter 2",
    cookingNotes: "Make biryani extra spicy please!",
    paymentMethod: "campus_wallet",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    orderId: "ord-102",
    tokenNumber: "#TK-102",
    customer: {
      userId: "usr-02",
      name: "Dr. Meenakshi Iyer",
      role: "faculty",
      studentId: "FAC-108"
    },
    items: [
      { itemId: "dish-03", name: "Crispy Masala Dosa", price: 75, quantity: 2, veg: true },
      { itemId: "dish-08", name: "Thick Cold Coffee with Choco Drizzle", price: 65, quantity: 1, veg: true }
    ],
    totalAmount: 215,
    status: "cooking",
    pickupCounter: 1,
    tableNumber: "Faculty Table 4",
    cookingNotes: "Crispy dosa with extra coconut chutney",
    paymentMethod: "campus_wallet",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 8 * 60 * 1000)
  },
  {
    orderId: "ord-103",
    tokenNumber: "#TK-103",
    customer: {
      userId: "usr-01",
      name: "Aryan Sharma",
      role: "student",
      studentId: "2024CS042"
    },
    items: [
      { itemId: "dish-05", name: "Crispy Peri Peri Chicken Popcorn", price: 115, quantity: 1, veg: false }
    ],
    totalAmount: 115,
    status: "pending",
    pickupCounter: 2,
    tableNumber: "Counter Pickup",
    cookingNotes: "Extra peri-peri seasoning",
    paymentMethod: "campus_wallet",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 2 * 60 * 1000)
  }
];

// Standalone runner for direct `node seed/seedData.js`
async function seedDB() {
  const mongoose = require('mongoose');
  const connectDB = require('../config/db');
  const MenuItem = require('../models/MenuItem');
  const User = require('../models/User');
  const Order = require('../models/Order');

  const connected = await connectDB();
  if (connected) {
    try {
      await MenuItem.deleteMany({});
      await User.deleteMany({});
      await Order.deleteMany({});

      await MenuItem.insertMany(initialDishes);
      await User.insertMany(initialUsers);
      await Order.insertMany(initialOrders);
      console.log('🎉 Database Seeded with Initial Menu, Users & Orders!');
      process.exit(0);
    } catch (e) {
      console.error('Error seeding database:', e);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seedDB();
}

module.exports = {
  initialDishes,
  initialUsers,
  initialOrders
};
