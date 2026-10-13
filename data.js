// Campus Canteen Pro - Seed Data & Initial State
const DEFAULT_USERS = [
  {
    id: "usr_student_01",
    name: "Aryan Sharma",
    email: "student@campus.edu",
    password: "password123",
    role: "student",
    regNo: "2024CS042",
    dept: "Computer Science",
    walletBalance: 420.00,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "usr_faculty_01",
    name: "Dr. Meenakshi Iyer",
    email: "faculty@campus.edu",
    password: "password123",
    role: "faculty",
    staffId: "FAC-108",
    dept: "Electronics & Comm.",
    walletBalance: 1250.00,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "usr_kitchen_01",
    name: "Chef Rajesh (Kitchen Counter)",
    email: "kitchen@campus.edu",
    password: "password123",
    role: "kitchen",
    station: "Main Kitchen Counter #1 & #2",
    walletBalance: 0,
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "usr_admin_01",
    name: "Canteen Director Vikram",
    email: "admin@campus.edu",
    password: "password123",
    role: "admin",
    office: "Canteen Management Office",
    walletBalance: 0,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  }
];

const DEFAULT_MENU = [
  // --- Breakfast ---
  {
    id: "dish_01",
    name: "Crispy Masala Dosa",
    category: "breakfast",
    diet: "veg",
    price: 75,
    prepTime: 8,
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    isPopular: true,
    calories: "320 kcal",
    badge: "Student Fav 🌟",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
    description: "Golden rice crepe stuffed with spiced potato mash, served with coconut chutney & piping hot sambar."
  },
  {
    id: "dish_02",
    name: "Amritsari Chole Bhature",
    category: "breakfast",
    diet: "veg",
    price: 95,
    prepTime: 10,
    rating: 4.8,
    reviewsCount: 118,
    inStock: true,
    isPopular: true,
    calories: "560 kcal",
    badge: "Chef Special 👨‍🍳",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80",
    description: "Two jumbo fluffy bhature served with rich dark chickpea gravy, pickled onions, and mint chutney."
  },
  {
    id: "dish_03",
    name: "Indori Poha with Sev & Jalebi",
    category: "breakfast",
    diet: "veg",
    price: 55,
    prepTime: 4,
    rating: 4.7,
    reviewsCount: 88,
    inStock: true,
    isPopular: false,
    calories: "280 kcal",
    badge: "Quick Pick ⚡",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
    description: "Steam-cooked flattened rice tempered with mustard, roasted peanuts, topped with ratlami sev and fresh coriander."
  },
  {
    id: "dish_04",
    name: "Cheese & Herb Omelette with Toast",
    category: "breakfast",
    diet: "non-veg",
    price: 70,
    prepTime: 7,
    rating: 4.6,
    reviewsCount: 64,
    inStock: true,
    isPopular: false,
    calories: "340 kcal",
    badge: "High Protein 🍳",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    description: "Fluffy 2-egg omelette loaded with melted cheddar cheese, oregano herbs, served with 2 butter toasted sourdough slices."
  },

  // --- Snacks & Street Food ---
  {
    id: "dish_05",
    name: "Hot Punjabi Samosa (2 pcs)",
    category: "snacks",
    diet: "veg",
    price: 40,
    prepTime: 3,
    rating: 4.9,
    reviewsCount: 310,
    inStock: true,
    isPopular: true,
    calories: "290 kcal",
    badge: "Bestseller 🔥",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    description: "Crispy golden pastry filled with spiced green peas and potato chunks, served with tangy tamarind & mint chutneys."
  },
  {
    id: "dish_06",
    name: "Mumbai Vada Pav with Thecha",
    category: "snacks",
    diet: "veg",
    price: 45,
    prepTime: 3,
    rating: 4.8,
    reviewsCount: 240,
    inStock: true,
    isPopular: true,
    calories: "320 kcal",
    badge: "RIT Special 🌶️",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80",
    description: "Crispy spiced batata vada tucked in soft buttered pav with spicy garlic peanut thecha and fried green chilies."
  },
  {
    id: "dish_07",
    name: "Crispy Peri Peri Chicken Popcorn",
    category: "snacks",
    diet: "non-veg",
    price: 115,
    prepTime: 8,
    rating: 4.9,
    reviewsCount: 195,
    inStock: true,
    isPopular: true,
    calories: "440 kcal",
    badge: "Hot & Crispy 🍗",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80",
    description: "Bite-sized tender chicken cubes double coated in crunch batter, tossed in zesty African peri peri spice."
  },
  {
    id: "dish_08",
    name: "Cheesy Loaded Nachos & Salsa",
    category: "snacks",
    diet: "veg",
    price: 90,
    prepTime: 6,
    rating: 4.5,
    reviewsCount: 78,
    inStock: true,
    isPopular: false,
    calories: "380 kcal",
    badge: "Sharing Platter 🧀",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80",
    description: "Crispy corn tortilla chips drowned in warm melted cheese sauce, topped with jalapeños, olives, and fresh tomato salsa."
  },

  // --- Lunch & Thalis ---
  {
    id: "dish_09",
    name: "Shahi Paneer Deluxe Thali",
    category: "meals",
    diet: "veg",
    price: 150,
    prepTime: 12,
    rating: 4.9,
    reviewsCount: 220,
    inStock: true,
    isPopular: true,
    calories: "680 kcal",
    badge: "Complete Meal 🍛",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80",
    description: "Creamy royal cottage cheese curry, Dal Tadka, Jeera Rice, 2 Butter Rotis, Gulab Jamun sweet, crunchy papad & salad."
  },
  {
    id: "dish_10",
    name: "Hyderabadi Dum Chicken Biryani",
    category: "meals",
    diet: "non-veg",
    price: 170,
    prepTime: 10,
    rating: 5.0,
    reviewsCount: 380,
    inStock: true,
    isPopular: true,
    calories: "740 kcal",
    badge: "RIT #1 Rated 🏆",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    description: "Aromatic long-grain basmati rice slow-cooked on dum with marinated chicken, saffron, fried onions, served with cooling burhani raita & salan."
  },
  {
    id: "dish_11",
    name: "Punjabi Rajma Masala with Steamed Rice",
    category: "meals",
    diet: "veg",
    price: 90,
    prepTime: 6,
    rating: 4.7,
    reviewsCount: 165,
    inStock: true,
    isPopular: false,
    calories: "480 kcal",
    badge: "Comfort Food ❤️",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    description: "Slow-simmered Kashmiri red kidney beans cooked with garlic, onions, and tomato gravy over fragrant steamed basmati rice."
  },
  {
    id: "dish_12",
    name: "Veg Schezwan Fried Rice & Manchurian",
    category: "meals",
    diet: "veg",
    price: 125,
    prepTime: 9,
    rating: 4.8,
    reviewsCount: 190,
    inStock: true,
    isPopular: true,
    calories: "520 kcal",
    badge: "Desi Chinese 🥢",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
    description: "Wok-tossed spicy Schezwan rice with garden vegetables served with 4 vegetable balls in dark savoury Manchurian gravy."
  },

  // --- Fast Food & Burgers ---
  {
    id: "dish_13",
    name: "Classic Cheesy Veggie Supreme Burger",
    category: "fastfood",
    diet: "veg",
    price: 85,
    prepTime: 8,
    rating: 4.7,
    reviewsCount: 140,
    inStock: true,
    isPopular: false,
    calories: "450 kcal",
    badge: "Extra Cheesy 🍔",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    description: "Crispy herb potato patty topped with melted slice, fresh tomato, crisp lettuce, gherkins and secret canteen sauce in brioche bun."
  },
  {
    id: "dish_14",
    name: "Crispy Zing Chicken Burger",
    category: "fastfood",
    diet: "non-veg",
    price: 135,
    prepTime: 10,
    rating: 4.9,
    reviewsCount: 260,
    inStock: true,
    isPopular: true,
    calories: "590 kcal",
    badge: "Crispy Delight 🍗",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    description: "Marinated whole chicken breast fillet fried to golden crunch, iceberg lettuce, spiced mayonnaise in sesame toasted bun."
  },
  {
    id: "dish_15",
    name: "Paneer Tikka Grilled Club Sandwich",
    category: "fastfood",
    diet: "veg",
    price: 95,
    prepTime: 7,
    rating: 4.8,
    reviewsCount: 110,
    inStock: true,
    isPopular: false,
    calories: "420 kcal",
    badge: "Grilled To Perfection 🥪",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
    description: "Triple-layer jumbo sandwich packed with tandoori spiced paneer cubes, capsicum, mint mayo, and melted mozzarella."
  },
  {
    id: "dish_16",
    name: "Margherita 8-Inch Pan Pizza",
    category: "fastfood",
    diet: "veg",
    price: 140,
    prepTime: 14,
    rating: 4.6,
    reviewsCount: 89,
    inStock: true,
    isPopular: false,
    calories: "620 kcal",
    badge: "Fresh Baked 🍕",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    description: "Hand-stretched sourdough base covered in San Marzano tomato sauce, generous fresh mozzarella cheese and Italian basil."
  },

  // --- Beverages & Shakes ---
  {
    id: "dish_17",
    name: "Special Cutting Masala Chai",
    category: "beverages",
    diet: "veg",
    price: 20,
    prepTime: 2,
    rating: 5.0,
    reviewsCount: 450,
    inStock: true,
    isPopular: true,
    calories: "90 kcal",
    badge: "Fuel of RIT ☕",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    description: "Brewed fresh with Assam tea leaves, crushed ginger, cardamom, and whole milk. Served piping hot in authentic glass."
  },
  {
    id: "dish_18",
    name: "Thick Cold Coffee with Choco Drizzle",
    category: "beverages",
    diet: "veg",
    price: 65,
    prepTime: 4,
    rating: 4.9,
    reviewsCount: 310,
    inStock: true,
    isPopular: true,
    calories: "260 kcal",
    badge: "Crowd Favorite 🥤",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
    description: "Double espresso blended with chilled creamy milk, chocolate syrup, topped with rich cocoa dusting."
  },
  {
    id: "dish_19",
    name: "Oreo & KitKat Thick Shake",
    category: "beverages",
    diet: "veg",
    price: 85,
    prepTime: 5,
    rating: 4.9,
    reviewsCount: 175,
    inStock: true,
    isPopular: true,
    calories: "410 kcal",
    badge: "Sweet Rush 🍫",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    description: "Creamy vanilla ice cream churned with crushed Oreo cookies, KitKat fingers, and dark chocolate ganache."
  },
  {
    id: "dish_20",
    name: "Fresh Mint & Lime Mojito",
    category: "beverages",
    diet: "veg",
    price: 45,
    prepTime: 3,
    rating: 4.7,
    reviewsCount: 92,
    inStock: true,
    isPopular: false,
    calories: "85 kcal",
    badge: "Super Refreshing 🍋",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    description: "Muddled fresh mint leaves, lime juice, dash of rock salt, and sparkling soda served chilled over crushed ice."
  },

  // --- Desserts ---
  {
    id: "dish_21",
    name: "Warm Gulab Jamun with Rabri (2 pcs)",
    category: "desserts",
    diet: "veg",
    price: 60,
    prepTime: 2,
    rating: 4.9,
    reviewsCount: 180,
    inStock: true,
    isPopular: true,
    calories: "340 kcal",
    badge: "Melt In Mouth 🍯",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
    description: "Hot, syrup-soaked khoya dumplings served with a generous dollop of chilled thickened cardamom rabri."
  },
  {
    id: "dish_22",
    name: "Warm Choco Lava Cake",
    category: "desserts",
    diet: "veg",
    price: 80,
    prepTime: 3,
    rating: 4.9,
    reviewsCount: 160,
    inStock: true,
    isPopular: true,
    calories: "380 kcal",
    badge: "Molten Center 🎂",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    description: "Decadent dark chocolate sponge cake with an irresistible flowing warm chocolate fudge lava center."
  }
];

const DEFAULT_COUPONS = [
  {
    code: "RIT20",
    discountPercent: 20,
    maxDiscount: 50,
    minOrder: 100,
    desc: "20% OFF (Up to ₹50) for all RIT students"
  },
  {
    code: "CAMPUS20",
    discountPercent: 20,
    maxDiscount: 50,
    minOrder: 100,
    desc: "20% OFF (Up to ₹50) for all students"
  },
  {
    code: "RIT50",
    discountAmount: 50,
    minOrder: 200,
    desc: "Flat ₹50 OFF on orders above ₹200"
  },
  {
    code: "SNACK30",
    discountAmount: 30,
    minOrder: 150,
    desc: "Flat ₹30 OFF on orders above ₹150"
  },
  {
    code: "FACULTY10",
    discountPercent: 10,
    maxDiscount: 100,
    minOrder: 0,
    desc: "Faculty Express 10% auto-discount"
  }
];

const DEFAULT_ORDERS = [
  {
    id: "ORD-9421",
    token: "TK-101",
    userId: "usr_student_01",
    customerName: "Aryan Sharma",
    customerRole: "student",
    customerMeta: "2024CS042 • CS Dept",
    items: [
      { id: "dish_09", name: "Shahi Paneer Deluxe Thali", price: 150, qty: 1 },
      { id: "dish_18", name: "Thick Cold Coffee", price: 65, qty: 1 }
    ],
    orderType: "dine-in",
    tableNo: "Table 4",
    notes: "Please make the gravy mild spicy.",
    subtotal: 215,
    discount: 43,
    couponApplied: "CAMPUS20",
    total: 172,
    paymentMethod: "wallet",
    status: "ready", // received, cooking, ready, completed, cancelled
    counter: "Counter #2 (Thali & Meals)",
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    estimatedMinutes: 0
  },
  {
    id: "ORD-9422",
    token: "TK-102",
    userId: "usr_faculty_01",
    customerName: "Dr. Meenakshi Iyer",
    customerRole: "faculty",
    customerMeta: "FAC-108 • Faculty Express",
    items: [
      { id: "dish_02", name: "Amritsari Chole Bhature", price: 95, qty: 1 },
      { id: "dish_17", name: "Special Cutting Masala Chai", price: 20, qty: 2 }
    ],
    orderType: "takeaway",
    tableNo: "Express Counter",
    notes: "Less sugar in cutting chai please.",
    subtotal: 135,
    discount: 13.5,
    couponApplied: "FACULTY10",
    total: 121.5,
    paymentMethod: "wallet",
    status: "cooking",
    counter: "Counter #1 (Snacks & Quick)",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    estimatedMinutes: 4
  },
  {
    id: "ORD-9423",
    token: "TK-103",
    userId: "usr_student_01",
    customerName: "Sneha Kapur",
    customerRole: "student",
    customerMeta: "2024ME019 • Mech Dept",
    items: [
      { id: "dish_14", name: "Crispy Zing Chicken Burger", price: 135, qty: 1 },
      { id: "dish_20", name: "Fresh Mint & Lime Mojito", price: 45, qty: 1 }
    ],
    orderType: "takeaway",
    tableNo: "Express Counter",
    notes: "Extra napkins please.",
    subtotal: 180,
    discount: 0,
    couponApplied: null,
    total: 180,
    paymentMethod: "cash_on_counter",
    status: "received",
    counter: "Counter #3 (Fast Food)",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    estimatedMinutes: 9
  },
  {
    id: "ORD-9420",
    token: "TK-100",
    userId: "usr_student_01",
    customerName: "Aryan Sharma",
    customerRole: "student",
    customerMeta: "2024CS042 • CS Dept",
    items: [
      { id: "dish_05", name: "Hot Punjabi Samosa (2 pcs)", price: 40, qty: 1 },
      { id: "dish_17", name: "Special Cutting Masala Chai", price: 20, qty: 1 }
    ],
    orderType: "dine-in",
    tableNo: "Table 12",
    notes: "",
    subtotal: 60,
    discount: 0,
    couponApplied: null,
    total: 60,
    paymentMethod: "wallet",
    status: "completed",
    counter: "Counter #1 (Snacks & Quick)",
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    estimatedMinutes: 0
  }
];

const DEFAULT_TRANSACTIONS = [
  {
    id: "TXN-801",
    userId: "usr_student_01",
    type: "credit",
    amount: 500,
    desc: "Digital Wallet Top-up (Campus UPI)",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "TXN-802",
    userId: "usr_student_01",
    type: "debit",
    amount: 60,
    desc: "Paid for Order #ORD-9420 (Token #TK-100)",
    date: new Date(Date.now() - 55 * 60 * 1000).toISOString()
  },
  {
    id: "TXN-803",
    userId: "usr_student_01",
    type: "debit",
    amount: 172,
    desc: "Paid for Order #ORD-9421 (Token #TK-101)",
    date: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: "TXN-804",
    userId: "usr_faculty_01",
    type: "credit",
    amount: 1500,
    desc: "Monthly Faculty Meal Subsidy Credit",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "TXN-805",
    userId: "usr_faculty_01",
    type: "debit",
    amount: 121.5,
    desc: "Paid for Order #ORD-9422 (Token #TK-102)",
    date: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  }
];
