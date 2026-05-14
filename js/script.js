// ==========================================
// Outline 1: Objects & Classes
// ==========================================

class MenuItem {
  constructor(id, name, category, price, description, image) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.description = description;
    this.image = image;
  }
}

// ==========================================
// Outline 2: Arrays & Array Methods
// ==========================================

const defaultMenu = [
  new MenuItem(
    1,
    "Signature Beef Burger",
    "foods",
    185,
    "Grilled beef patty with cheddar cheese and GrillWave sauce.",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
  ),
new MenuItem(
  2,
  "Pepperoni Pizza",
  "foods",
  210,
  "Thin crust pizza with mozzarella and pepperoni.",
  "images/pip.jpg"
),
  new MenuItem(
    3,
    "Fresh Mango Juice",
    "drinks",
    65,
    "Cold refreshing mango juice.",
    "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=80"
  )
];


let menuItems =
  JSON.parse(localStorage.getItem("grillwave_menu")) || defaultMenu;

let cart =
  JSON.parse(localStorage.getItem("grillwave_cart")) || [];

let orders =
  JSON.parse(localStorage.getItem("grillwave_orders")) || [];

let reservations =
  JSON.parse(localStorage.getItem("grillwave_reservations")) || [];

let messages =
  JSON.parse(localStorage.getItem("grillwave_messages")) || [];

let categories =
  JSON.parse(localStorage.getItem("grillwave_categories")) || [
    "foods",
    "drinks",
    "desserts"
  ];

let currentCategory = "all";
let currentSearch = "";

// ==========================================
// Outline 7: Cookies
// ==========================================

function setCookie(name, value, days) {

  const date = new Date();

  date.setTime(
    date.getTime() + days * 24 * 60 * 60 * 1000
  );

  document.cookie =
    `${name}=${encodeURIComponent(value)};
    expires=${date.toUTCString()};
    path=/`;
}

function getCookie(name) {

  const cookies = document.cookie.split("; ");

  const found = cookies.find(cookie =>
    cookie.startsWith(name + "=")
  );

  return found
    ? decodeURIComponent(found.split("=")[1])
    : "";
}

// ==========================================
// Outline 5: Functions
// ==========================================

function user() {
  return JSON.parse(
    localStorage.getItem("currentUser")
  );
}

function formatMoney(price) {
  return `${price} EGP`;
}

function showFeedback(text, isError = false) {

  const box = document.getElementById("feedback");

  if (box) {

    box.textContent = text;

    box.style.color =
      isError ? "#c0392b" : "#1e8449";
  }
}

// --------------------------------------------------------------------------------mohamed
function getCartTotal() {

  return cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );
}

function getCartCount() {

  return cart.reduce(
    (sum, item) =>
      sum + item.qty,
    0
  );
}

// ==========================================
// Outline 6: localStorage
// ==========================================

// ==========================================
// Outline 9: Error Handling
// ==========================================

function saveData() {

  try {

    localStorage.setItem(
      "grillwave_menu",
      JSON.stringify(menuItems)
    );

    localStorage.setItem(
      "grillwave_cart",
      JSON.stringify(cart)
    );

    localStorage.setItem(
      "grillwave_orders",
      JSON.stringify(orders)
    );

    localStorage.setItem(
      "grillwave_reservations",
      JSON.stringify(reservations)
    );

    localStorage.setItem(
      "grillwave_messages",
      JSON.stringify(messages)
    );

    localStorage.setItem(
      "grillwave_categories",
      JSON.stringify(categories)
    );

  } catch (error) {

    console.log(error);

    showFeedback(
      "Error saving data.",
      true
    );
  }
}

// ==========================================
// Outline 3: DOM Manipulation
// ==========================================

function renderMenu() {

  const list =
    document.getElementById("menuList");

  const count =
    document.getElementById("menuCount");

  if (!list) return;

  const filtered = menuItems.filter(item => {

    const matchCategory =
      currentCategory === "all" ||
      item.category === currentCategory;

    const matchSearch =
      item.name
      .toLowerCase()
      .includes(
        currentSearch.toLowerCase()
      );

    return matchCategory && matchSearch;
  });

  list.innerHTML = "";

  filtered.forEach(item => {

    const card =
      document.createElement("article");

    card.className = "menu-card";

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">

      <div class="menu-card-content">

        <span class="badge">
          ${item.category}
        </span>

        <h3>${item.name}</h3>

        <p>${item.description}</p>

        <strong class="price">
          ${formatMoney(item.price)}
        </strong>

        <button
          class="main-btn add-cart-btn"
          data-id="${item.id}"
        >
          Add To Cart
        </button>

      </div>
    `;

    list.appendChild(card);
  });

  if (count) {
    count.textContent =
      `${filtered.length} items`;
  }
}
// ------------------------------------------------------------------------------hossam
function renderCart() {

  const cartItems =
    document.getElementById("cartItems");

  const cartCount =
    document.getElementById("cartCount");

  const cartTotal =
    document.getElementById("cartTotal");

  const checkoutTotal =
    document.getElementById("checkoutTotal");

  if (!cartItems) return;

  cartItems.innerHTML =
    cart.length
      ? ""
      : "<p>Your cart is empty.</p>";

  cart.forEach(item => {

    const row =
      document.createElement("div");

    row.className = "cart-line";

    row.innerHTML = `
      <div>

        <strong>${item.name}</strong>

        <br>

        <small>
          ${item.qty}
          x
          ${formatMoney(item.price)}
        </small>

      </div>

      <div class="qty-controls">

        <button
          data-action="decrease"
          data-id="${item.id}"
        >
          -
        </button>

        <span>${item.qty}</span>

        <button
          data-action="increase"
          data-id="${item.id}"
        >
          +
        </button>

        <button
          class="remove-btn"
          data-action="remove"
          data-id="${item.id}"
        >
          x
        </button>

      </div>
    `;

    cartItems.appendChild(row);
  });

  if (cartCount) {
    cartCount.textContent =
      `Cart: ${getCartCount()}`;
  }

  if (cartTotal) {
    cartTotal.textContent =
      `Total: ${formatMoney(getCartTotal())}`;
  }

  if (checkoutTotal) {
    checkoutTotal.textContent =
      formatMoney(getCartTotal());
  }
}

function addToCart(id) {

  const item =
    menuItems.find(
      meal => Number(meal.id) === Number(id)
    );

  if (!item) return;

  const existing =
    cart.find(
      line => Number(line.id) === Number(id)
    );

  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1
    });
  }

  saveData();

  renderCart();

  showFeedback(
    `${item.name} added to cart.`
  );
}

// ==========================================
// Outline 8:
// Conditional Logic & Validation
// ==========================================

function validateEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function saveOrder() {

  const current = user();

  if (cart.length === 0) {

    showFeedback(
      "Please add items first.",
      true
    );

    return;
  }

  if (
    !current.name ||
    !current.phone ||
    !current.address
  ) {

    showFeedback(
      "Please complete profile first.",
      true
    );

    return;
  }

  const order = {

    id: Date.now(),

    userEmail: current.email,

    customer: current.name,

    phone: current.phone,

    address: current.address,

    total: getCartTotal(),

    items: cart
      .map(
        item =>
          `${item.name} x${item.qty}`
      )
      .join(", "),

    date: new Date().toLocaleString(),

    status: "Pending"
  };

  orders.push(order);

  cart = [];

  saveData();

  renderCart();

  showFeedback(
    "Order placed successfully."
  );
}

// ==========================================
// Outline 10:
// Dynamic UI & User Feedback
// ==========================================

function applyTheme() {

  const savedTheme =
    getCookie("theme");

  if (savedTheme === "dark") {

    document.body.classList.add(
      "dark-theme"
    );
  }
}

function toggleTheme() {

  document.body.classList.toggle(
    "dark-theme"
  );

  const theme =
    document.body.classList.contains(
      "dark-theme"
    )
      ? "dark"
      : "light";

  setCookie("theme", theme, 30);

  showFeedback(
    `Theme changed to ${theme}`
  );
}

// ==========================================
// Outline 4: Event Listeners
// ==========================================

function setupEvents() {

  const menuToggle =
    document.getElementById("menuToggle");

  const navLinks =
    document.getElementById("navLinks");

  if (menuToggle && navLinks) {

    menuToggle.addEventListener(
      "click",
      function () {

        navLinks.classList.toggle(
          "show"
        );
      }
    );
  }

  const search =
    document.getElementById("searchInput");

  if (search) {

    search.addEventListener(
      "input",
      function (e) {

        currentSearch =
          e.target.value;

        renderMenu();
      }
    );
  }

  document
    .querySelectorAll(".filter-btn")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        function () {

          document
            .querySelectorAll(".filter-btn")
            .forEach(b =>
              b.classList.remove("active")
            );

          btn.classList.add("active");

          currentCategory =
            btn.dataset.category;

          renderMenu();
        }
      );
    });

  const menuList =
    document.getElementById("menuList");

  if (menuList) {

    menuList.addEventListener(
      "click",
      function (e) {

        if (
          e.target.classList.contains(
            "add-cart-btn"
          )
        ) {

          addToCart(
            Number(e.target.dataset.id)
          );
        }
      }
    );
  }

  const checkoutBtn =
    document.getElementById("checkoutBtn");

  if (checkoutBtn) {

    checkoutBtn.addEventListener(
      "click",
      saveOrder
    );
  }
}

function initApp() {

  applyTheme();

  setupEvents();

  renderMenu();

  renderCart();
}

initApp();