const tg = Telegram.WebApp;
tg.expand();

/* ================= НАСТРОЙКИ ================= */
const RATE = 1.84; // курс в звёздах

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
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const productList = document.getElementById("product-list");
if (!productList) {
  console.error("❌ Элемент #product-list не найден");
}

/* ================= РЕНДЕР ================= */
PRODUCTS.forEach(p => {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <img src="images/${p.img}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p class="desc">${p.desc}</p>
    <p class="price">${p.stars} ⭐</p>
    <div class="actions">
      <button class="glass" onclick="addToCart('${p.id}')">В корзину</button>
      <button class="primary" onclick="buyNow('${p.id}')">Купить</button>
    </div>
  `;
  productList?.appendChild(el);
});

/* ================= ЛОГИКА ================= */
function addToCart(id) {
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function buyNow(id) {
  tg.sendData(JSON.stringify({
    type: "buy",
    items: [id]
  }));
}

function goCart() {
  switchPage("page-pay");

  const payList = document.getElementById("pay-list");
  payList.innerHTML = "";

  let total = 0;

  cart
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter(Boolean)
    .forEach(item => {
      total += item.stars;
      payList.innerHTML += `<p>${item.name} — ${item.stars} ⭐</p>`;
    });

  document.getElementById("total-stars").innerText = total;
  const btn = document.getElementById("pay-button");
  btn.innerText = `Оплатить ${total} ⭐`;

  btn.onclick = () => {
    tg.sendData(JSON.stringify({
      type: "cart",
      items: cart,
      total
    }));
  };
}

function goMain() {
  cart = [];
  localStorage.removeItem("cart"); // ✅ правильно
  switchPage("page-main");
}

function switchPage(id) {
  document
    .querySelectorAll(".page")
    .forEach(p => p.classList.remove("active"));

  document.getElementById(id)?.classList.add("active");
}

