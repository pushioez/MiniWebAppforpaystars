const tg = Telegram.WebApp;
tg.ready();
tg.expand();

/* ===== CONFIG ===== */
const RATE = 1.84; // Fixed conversion rate

/* ===== PRODUCTS ===== */
const PRODUCTS = [
  {
    id: "latte_lemon",
    name: "Латте Лимонный Курд с Шоколадом",
    desc: "Нежный и сливочный напиток на основе...",
    stars: Math.round(425 * RATE),
    img: "latte_lemon.png"
  },
  {
    id: "chicory_milk",
    name: "Цикорий Молочный",
    desc: "Нежный горячий напиток...",
    stars: Math.round(335 * RATE),
    img: "chicory_milk.png"
  },
  {
    id: "chicory_caramel",
    name: "Цикорий Сливочная Карамель",
    desc: "Сливочный горячий напиток...",
    stars: Math.round(370 * RATE),
    img: "chicory_caramel.png"
  },
  {
    id: "belgian_waffle",
    name: "Бельгийская вафля",
    desc: "Нежное лакомство...",
    stars: Math.round(290 * RATE),
    img: "belgian_waffle.png"
  },
  {
    id: "pretzel",
    name: "Брецель с солёным маслом",
    desc: "Только натуральные ингредиенты...",
    stars: Math.round(420 * RATE),
    img: "pretzel.png"
  },
  {
    id: "croissant_almond",
    name: "Круассан Миндальный",
    desc: "Классический круассан...",
    stars: Math.round(320 * RATE),
    img: "croissant_almond.png"
  },
  {
    id: "hot_chocolate",
    name: "Горячий шоколад",
    desc: "Изысканный вкус...",
    stars: Math.round(385 * RATE),
    img: "hot_chocolate.png"
  },
  {
    id: "matcha_latte",
    name: "Маття Чай Латте",
    desc: "Фирменный напиток...",
    stars: Math.round(395 * RATE),
    img: "matcha_latte.png"
  },
  {
    id: "combo_breakfast",
    name: "Комбо завтрак",
    desc: "Начните свой день...",
    stars: Math.round(730 * RATE),
    img: "combo_breakfast.png"
  }
];

/* ===== CART MANAGEMENT ===== */
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  cart.push(product);
  saveCart();
  updateCartBadge();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.stars, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (cart.length > 0) {
    badge.textContent = cart.length;
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }
}

/* ===== RENDER PRODUCTS ===== */
function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  PRODUCTS.forEach(p => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <img src="images/${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">${p.stars}</div>
      <div class="actions">
        <button class="glass add">В корзину</button>
        <button class="primary buy">Купить</button>
      </div>
    `;

    el.querySelector(".add").addEventListener("click", () => {
      addToCart(p);
      // Visual feedback
      const btn = el.querySelector(".add");
      const originalText = btn.textContent;
      btn.textContent = "✓ Добавлено";
      btn.style.background = "rgba(52, 199, 89, 0.2)";
      btn.style.borderColor = "rgba(52, 199, 89, 0.3)";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.style.borderColor = "";
      }, 1000);
    });

    el.querySelector(".buy").addEventListener("click", () => {
      renderPayPage([p.id]);
      switchPage("page-pay");
    });

    productList.appendChild(el);
  });
}

/* ===== RENDER CART ===== */
function renderCart() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  const cartTotalPrice = document.getElementById("cart-total-price");
  const payCartButton = document.getElementById("pay-cart-button");
  const cartEmpty = document.getElementById("cart-empty");

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartTotal.style.display = "none";
    payCartButton.style.display = "none";
    cartEmpty.style.display = "block";
    return;
  }

  cartEmpty.style.display = "none";
  cartTotal.style.display = "flex";
  payCartButton.style.display = "block";

  cart.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="images/${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.stars}</div>
      </div>
      <button class="cart-remove" data-index="${index}">×</button>
    `;

    el.querySelector(".cart-remove").addEventListener("click", () => {
      removeFromCart(index);
    });

    cartList.appendChild(el);
  });

  const total = getCartTotal();
  cartTotalPrice.textContent = total;

  payCartButton.onclick = () => {
    renderPayPage(cart.map(item => item.id));
    switchPage("page-pay");
  };
}

/* ===== RENDER PAY PAGE ===== */
function renderPayPage(items) {
  const payItems = document.getElementById("pay-items");
  const payTotalAmount = document.getElementById("pay-total-amount");
  const payButtonStars = document.getElementById("pay-button-stars");

  payItems.innerHTML = "";

  let total = 0;
  items.forEach(itemId => {
    const product = PRODUCTS.find(p => p.id === itemId);
    if (product) {
      total += product.stars;
      const el = document.createElement("div");
      el.className = "pay-item";
      el.innerHTML = `
        <span class="pay-item-name">${product.name}</span>
        <span class="pay-item-price">${product.stars}</span>
      `;
      payItems.appendChild(el);
    }
  });

  payTotalAmount.textContent = total;
  payButtonStars.textContent = total;

  document.getElementById("pay-button").onclick = () => {
    startPayment(items);
  };
}

/* ===== PAYMENT ===== */
function startPayment(items) {
  tg.sendData(JSON.stringify({
    type: "stars_payment",
    items: items
  }));
}

/* ===== QR DISPLAY ===== */
function showQR(qrUrl) {
  switchPage("page-qr");
  document.getElementById("qr-img").src = qrUrl;
}

// Listen for QR data from bot
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "qr_code") {
    showQR(event.data.qrUrl);
  }
});

// Also listen for Telegram WebApp events
tg.onEvent("qr_code", (data) => {
  if (data && data.qrUrl) {
    showQR(data.qrUrl);
  }
});

/* ===== TAB BAR NAVIGATION ===== */
document.querySelectorAll(".tab-item").forEach(tab => {
  tab.addEventListener("click", () => {
    const pageId = tab.getAttribute("data-page");
    
    // Update active tab
    document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    
    // Switch page
    switchPage(pageId);
    
    // Render cart if switching to cart page
    if (pageId === "page-cart") {
      renderCart();
    }
  });
});

/* ===== PAGE NAVIGATION ===== */
function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(id);
  const tabBar = document.querySelector(".tab-bar");
  
  if (page) {
    page.classList.add("active");
    
    // Show/hide tab bar based on page
    if (id === "page-main" || id === "page-cart") {
      tabBar.classList.remove("hidden");
      // Update tab bar active state
      document.querySelectorAll(".tab-item").forEach(t => {
        t.classList.toggle("active", t.getAttribute("data-page") === id);
      });
    } else {
      // Hide tab bar for Pay and QR pages
      tabBar.classList.add("hidden");
      document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
    }
  }
}

/* ===== BACK TO HOME ===== */
document.querySelector(".back-home-button").addEventListener("click", () => {
  cart = [];
  saveCart();
  updateCartBadge();
  switchPage("page-main");
  renderCart();
});

/* ===== INITIALIZE ===== */
renderProducts();
updateCartBadge();

// Handle back button from Pay page (if needed)
// The Pay page doesn't have a back button in the new design, 
// but users can use Tab Bar to navigate
