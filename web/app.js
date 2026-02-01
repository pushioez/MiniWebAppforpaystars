/* ================= TELEGRAM ================= */
const tg = window.Telegram?.WebApp;

if (tg) {
  tg.expand();
}

/* ================= НАСТРОЙКИ ================= */
const RATE = 1.74;

/* ================= ПРОДУКТЫ ================= */
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

/* ================= КОРЗИНА ================= */
let cart = JSON.parse(localStorage.getItem("cart") || "{}");

/* ================= DOM ================= */
const productList = document.getElementById("product-list");

/* ================= РЕНДЕР ================= */
function renderProducts() {
  productList.innerHTML = "";

  PRODUCTS.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="images/${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <p><b>${p.stars} ⭐</b></p>
      <div class="actions">
        <button class="glass">В корзину</button>
        <button class="primary">Купить</button>
      </div>
    `;

    card.querySelector(".glass").addEventListener("click", () => addToCart(p.id));
    card.querySelector(".primary").addEventListener("click", () => buyNow(p.id));

    productList.appendChild(card);
  });
}

renderProducts();

/* ================= ЛОГИКА ================= */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));

  tg?.HapticFeedback?.impactOccurred("light");
}

function buyNow(id) {
  const item = PRODUCTS.find(p => p.id === id);
  if (!item || !tg) return;

  tg.sendData(JSON.stringify({
    type: "buy",
    items: [{ id, qty: 1 }]
  }));

  tg.close();
}

function goCart() {
  switchPage("page-pay");

  const payList = document.getElementById("pay-list");
  const totalEl = document.getElementById("total-stars");
  const payBtn = document.getElementById("pay-button");

  payList.innerHTML = "";
  let total = 0;

  Object.entries(cart).forEach(([id, qty]) => {
    const item = PRODUCTS.find(p => p.id === id);
    if (!item) return;

    const sum = item.stars * qty;
    total += sum;

    payList.innerHTML += `<p>${item.name} × ${qty} — ${sum} ⭐</p>`;
  });

  totalEl.innerText = total;
  payBtn.disabled = total === 0;
  payBtn.innerText = total > 0 ? `Оплатить ${total} ⭐` : "Корзина пуста";

  payBtn.onclick = () => {
    if (!tg || total === 0) return;

    tg.sendData(JSON.stringify({
      type: "cart",
      items: Object.entries(cart).map(([id, qty]) => ({ id, qty }))
    }));

    tg.close();
  };
}

function goMain() {
  cart = {};
  localStorage.removeItem("cart");
  switchPage("page-main");
}

function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
}
