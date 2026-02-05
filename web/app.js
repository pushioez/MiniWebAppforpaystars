const tg = Telegram.WebApp;
tg.ready();
tg.expand();

/* ===== CONFIG ===== */
const RATE = 1.74;

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

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

/* ===== RENDER ===== */
const productList = document.getElementById("product-list");

PRODUCTS.forEach(p => {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <img src="images/${p.img}">
    <h3>${p.name}</h3>
    <p>${p.stars} ⭐</p>
    <div class="actions">
      <button class="glass add">В корзину</button>
      <button class="primary buy">Купить</button>
    </div>
  `;

  el.querySelector(".add").addEventListener("click", () => {
    cart.push(p.id);
    localStorage.setItem("cart", JSON.stringify(cart));
  });

  el.querySelector(".buy").addEventListener("click", () => {
    startPayment([p.id]);
  });

  productList.appendChild(el);
});

/* ===== CART ===== */
document.getElementById("go-cart").onclick = openCart;

function openCart() {
  switchPage("page-pay");

  const payList = document.getElementById("pay-list");
  payList.innerHTML = "";

  let total = 0;
  cart.map(id => PRODUCTS.find(p => p.id === id))
      .filter(Boolean)
      .forEach(p => {
        total += p.stars;
        payList.innerHTML += `<p>${p.name} — ${p.stars} ⭐</p>`;
      });

  document.getElementById("total-stars").innerText = total;

  document.getElementById("pay-button").onclick = () => {
    startPayment(cart);
  };
}

/* ===== STARS PAYMENT ===== */
function startPayment(items) {
  tg.sendData(JSON.stringify({
    type: "stars_payment",
    items
  }));
}

/* ===== QR AFTER PAYMENT ===== */
function showQR(qrUrl) {
  switchPage("page-qr");
  document.getElementById("qr-img").src = qrUrl;
}

/* ===== NAV ===== */
document.querySelectorAll(".back").forEach(b =>
  b.onclick = () => switchPage("page-main")
);

document.querySelector(".back-main").onclick = () => {
  cart = [];
  localStorage.removeItem("cart");
  switchPage("page-main");
};

function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ===== MOCK: после оплаты ===== */
// ⚠️ В реальности это приходит от бота
window.mockPaymentSuccess = () => {
  showQR("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ORDER123");
};
