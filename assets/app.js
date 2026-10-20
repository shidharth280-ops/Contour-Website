
/* ========================================
   CONTOUR — PRODUCT DATA
======================================== */

const products = [
  {
    id: "concha",
    name: "Concha",
    category: "Sweet Breads",
    price: 4.5,
    desc: "A soft Mexican sweet bread crowned with a delicate shell-pattern topping.",
    kind: "concha",
    detail:
      "Our signature concha brings together a tender, pillowy crumb and a lightly crisp, patterned sugar topping. Made for slow mornings, coffee breaks, and sharing.",
    ingredients:
      "Wheat flour, milk, butter, sugar, yeast, eggs, vanilla.",
    allergens: "Wheat, milk, eggs.",
  },
  {
    id: "churros",
    name: "Churros",
    category: "Churros",
    price: 5,
    desc: "Golden, crisp churros finished with cinnamon sugar.",
    kind: "churros",
    detail:
      "Golden on the outside and soft in the middle, our churros are rolled in fragrant cinnamon sugar and made to be enjoyed warm.",
    ingredients:
      "Wheat flour, water, butter, eggs, cinnamon, sugar.",
    allergens: "Wheat, milk, eggs.",
  },
  {
    id: "empanada",
    name: "Empanada de Cajeta",
    category: "Filled Pastries",
    price: 5.5,
    desc: "Flaky pastry filled with rich, caramel-like cajeta.",
    kind: "empanada",
    detail:
      "A flaky, buttery pastry wrapped around cajeta—a rich caramel-style confection traditionally made with goat’s milk.",
    ingredients: "Wheat flour, butter, cajeta, sugar, eggs.",
    allergens: "Wheat, milk, eggs.",
  },
  {
    id: "polvoron",
    name: "Polvorón",
    category: "Cookies",
    price: 4,
    desc: "Traditional crumbly shortbread with a delicate finish.",
    kind: "polvoron",
    detail:
      "Delicate, buttery and tender, this classic crumbly cookie is a small reminder that simple ingredients can make something special.",
    ingredients: "Wheat flour, butter, sugar, cinnamon.",
    allergens: "Wheat, milk.",
  },
  {
    id: "cinnamon",
    name: "Canela Roll",
    category: "Sweet Breads",
    price: 4.75,
    desc: "Soft spirals with warm cinnamon and a gentle sweetness.",
    kind: "cinnamon",
    detail:
      "A comforting pastry with layers of cinnamon warmth and a soft, tender texture, baked in small batches.",
    ingredients:
      "Wheat flour, milk, butter, sugar, cinnamon, yeast.",
    allergens: "Wheat, milk, eggs.",
  },
  {
    id: "mini-conchas",
    name: "Mini Conchas",
    category: "Sweet Breads",
    price: 6,
    desc: "Bite-sized versions of our much-loved signature pastry.",
    kind: "concha",
    detail:
      "All the charm of our signature concha in a smaller size, ideal for gatherings, catering, and sharing plates.",
    ingredients:
      "Wheat flour, milk, butter, sugar, yeast, eggs, vanilla.",
    allergens: "Wheat, milk, eggs.",
  },
];


/* ========================================
   CURRENCY FORMATTING
======================================== */

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}


/* ========================================
   SHOPPING CART STORAGE
======================================== */

// Read the cart from the browser's local storage.
function getCart() {
  try {
    return JSON.parse(
      localStorage.getItem("contour-cart") || "[]"
    );
  } catch (error) {
    return [];
  }
}

// Save the updated cart and refresh the cart counter.
function saveCart(cart) {
  localStorage.setItem(
    "contour-cart",
    JSON.stringify(cart)
  );

  updateCartCount();
}

// Update every cart counter displayed on the page.
function updateCartCount() {
  const cart = getCart();

  const totalItems = cart.reduce(
    (total, item) => total + item.qty,
    0
  );

  document
    .querySelectorAll("[data-cart-count]")
    .forEach((element) => {
      element.textContent = totalItems;
    });
}


/* ========================================
   ADD PRODUCTS TO THE CART
======================================== */

function addToCart(productId, quantity = 1) {
  const product = products.find(
    (item) => item.id === productId
  );

  if (!product) return;

  const cart = getCart();

  const existingItem = cart.find(
    (item) => item.id === productId
  );

  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({
      id: productId,
      qty: quantity,
    });
  }

  saveCart(cart);

  showToast(`${product.name} added to your bag`);
}


/* ========================================
   TOAST NOTIFICATIONS
======================================== */

function showToast(message) {
  let toastElement = document.querySelector(".toast");

  // Create the notification if it doesn't exist yet.
  if (!toastElement) {
    toastElement = document.createElement("div");
    toastElement.className = "toast";
    document.body.appendChild(toastElement);
  }

  toastElement.textContent = message;
  toastElement.classList.add("show");

  // Cancel the previous notification timer.
  clearTimeout(window.contourToastTimer);

  // Hide the notification after a short delay.
  window.contourToastTimer = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2200);
}


/* ========================================
   SHOPPING CART DRAWER
======================================== */

function openCart() {
  document
    .querySelector(".cart-drawer")
    ?.classList.add("open");

  renderCart();
}

function closeCart() {
  document
    .querySelector(".cart-drawer")
    ?.classList.remove("open");
}

// Display the current cart items and total price.
function renderCart() {
  const cartItemsContainer =
    document.querySelector(".cart-items");

  if (!cartItemsContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <p style="color:var(--muted);padding:20px 0">
        Your bag is waiting for something delicious.
      </p>
    `;
  } else {
    cartItemsContainer.innerHTML = cart
      .map((cartItem) => {
        const product = products.find(
          (item) => item.id === cartItem.id
        );

        if (!product) return "";

        return `
          <div class="cart-item">
            <div>
              <strong>${product.name}</strong>
              <small>
                ${formatMoney(product.price)} × ${cartItem.qty}
              </small>
            </div>

            <div>
              <strong>
                ${formatMoney(product.price * cartItem.qty)}
              </strong>
              <br>

              <button
                class="remove-item"
                data-remove="${product.id}"
              >
                Remove
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // Calculate the total cost of all cart items.
  const cartTotal = cart.reduce((total, cartItem) => {
    const product = products.find(
      (item) => item.id === cartItem.id
    );

    return product
      ? total + product.price * cartItem.qty
      : total;
  }, 0);

  document
    .querySelectorAll("[data-cart-total]")
    .forEach((element) => {
      element.textContent = formatMoney(cartTotal);
    });
}


/* ========================================
   PRODUCT CARD TEMPLATE
======================================== */

function createProductCard(product) {
  return `
    <article
      class="product-card"
      data-category="${product.category}"
    >
      <a
        href="product.html?id=${product.id}"
        aria-label="View ${product.name}"
      >
        <div class="product-art">
          <div class="food ${product.kind}"></div>
        </div>
      </a>

      <div class="product-info">
        <h3>
          <a href="product.html?id=${product.id}">
            ${product.name}
          </a>
        </h3>

        <p>${product.desc}</p>

        <div class="price-row">
          <span class="price">
            ${formatMoney(product.price)}
          </span>

          <button
            class="add-btn"
            data-add="${product.id}"
          >
            Add to bag +
          </button>
        </div>
      </div>
    </article>
  `;
}


/* ========================================
   FEATURED PRODUCTS
======================================== */

function renderFeaturedProducts() {
  const featuredContainer = document.querySelector(
    "[data-featured-products]"
  );

  if (!featuredContainer) return;

  // Display the first four products as featured items.
  featuredContainer.innerHTML = products
    .slice(0, 4)
    .map(createProductCard)
    .join("");
}


/* ========================================
   PRODUCT CATALOGUE, FILTERING & SORTING
======================================== */

function renderProductCatalog() {
  const catalogContainer = document.querySelector(
    "[data-catalog-products]"
  );

  if (!catalogContainer) return;

  let visibleProducts = [...products];

  // Apply the selected category filter.
  const activeFilter =
    document.querySelector(".filter-btn.active")
      ?.dataset.filter || "All";

  if (activeFilter !== "All") {
    visibleProducts = visibleProducts.filter(
      (product) => product.category === activeFilter
    );
  }

  // Apply the selected sorting option.
  const sortOption =
    document.querySelector("#sort-products")?.value ||
    "featured";

  if (sortOption === "price-low") {
    visibleProducts.sort(
      (first, second) => first.price - second.price
    );
  }

  if (sortOption === "price-high") {
    visibleProducts.sort(
      (first, second) => second.price - first.price
    );
  }

  if (sortOption === "name") {
    visibleProducts.sort(
      (first, second) =>
        first.name.localeCompare(second.name)
    );
  }

  // Render the filtered and sorted products.
  catalogContainer.innerHTML = visibleProducts
    .map(createProductCard)
    .join("");

  // Update the product count.
  const productCount = document.querySelector(
    "[data-product-count]"
  );

  if (productCount) {
    const count = visibleProducts.length;
    const label = count === 1 ? "product" : "products";

    productCount.textContent =
      `Showing ${count} ${label}`;
  }
}


/* ========================================
   INDIVIDUAL PRODUCT DETAILS
======================================== */

function renderProductDetails() {
  const detailsContainer = document.querySelector(
    "[data-product-detail]"
  );

  if (!detailsContainer) return;

  // Read the selected product ID from the URL.
  const urlParameters = new URLSearchParams(
    window.location.search
  );

  const productId = urlParameters.get("id");

  // Fall back to the first product if no valid ID is found.
  const product =
    products.find((item) => item.id === productId) ||
    products[0];

  document.title = `${product.name} | Contour`;

  detailsContainer.innerHTML = `
    <div class="detail-art">
      <div class="food ${product.kind}"></div>
    </div>

    <div class="detail-copy">
      <div class="eyebrow">
        ${product.category}
      </div>

      <h1>${product.name}</h1>

      <div class="price">
        ${formatMoney(product.price)}
      </div>

      <p>${product.detail}</p>

      <div class="notice">
        <strong>Made with care.</strong>
        <br>
        Prepared in small batches. For ingredient and
        allergen questions, contact our team before ordering.
      </div>

      <h3 style="margin-top:25px">Ingredients</h3>
      <p>${product.ingredients}</p>

      <p>
        <strong>Allergens:</strong>
        ${product.allergens}
      </p>

      <div class="quantity">
        <button
          data-qty="-1"
          aria-label="Decrease quantity"
        >
          −
        </button>

        <span data-qty-value>1</span>

        <button
          data-qty="1"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        class="btn"
        data-detail-add="${product.id}"
      >
        Add to bag — ${formatMoney(product.price)}
      </button>

      <p style="font-size:.82rem;margin-top:14px">
        Need a larger quantity?
        <a class="text-link" href="about.html#contact">
          Ask us about catering →
        </a>
      </p>
    </div>
  `;
}


/* ========================================
   CLICK EVENTS
======================================== */

// Use event delegation so dynamically rendered buttons work.
document.addEventListener("click", (event) => {
  const clickedElement = event.target;

  // Add a product from a product card.
  const addButton = clickedElement.closest("[data-add]");

  if (addButton) {
    addToCart(addButton.dataset.add);
  }

  // Add a product from its details page.
  const detailAddButton = clickedElement.closest(
    "[data-detail-add]"
  );

  if (detailAddButton) {
    const quantity = Number(
      document.querySelector("[data-qty-value]")
        ?.textContent || 1
    );

    addToCart(
      detailAddButton.dataset.detailAdd,
      quantity
    );
  }

  // Open the shopping cart.
  if (clickedElement.closest("[data-open-cart]")) {
    openCart();
  }

  // Close the shopping cart.
  if (clickedElement.closest("[data-close-cart]")) {
    closeCart();
  }

  // Remove a product from the cart.
  const removeButton = clickedElement.closest(
    "[data-remove]"
  );

  if (removeButton) {
    const productId = removeButton.dataset.remove;

    const updatedCart = getCart().filter(
      (item) => item.id !== productId
    );

    saveCart(updatedCart);
    renderCart();
  }

  // Change the active product category filter.
  const filterButton = clickedElement.closest(
    "[data-filter]"
  );

  if (filterButton) {
    document
      .querySelectorAll(".filter-btn")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button === filterButton
        );
      });

    renderProductCatalog();
  }

  // Increase or decrease the product quantity.
  const quantityButton = clickedElement.closest(
    "[data-qty]"
  );

  if (quantityButton) {
    const quantityDisplay = document.querySelector(
      "[data-qty-value]"
    );

    if (!quantityDisplay) return;

    const currentQuantity = Number(
      quantityDisplay.textContent
    );

    const change = Number(quantityButton.dataset.qty);

    // Keep the quantity between 1 and 20.
    const newQuantity = Math.max(
      1,
      Math.min(20, currentQuantity + change)
    );

    quantityDisplay.textContent = newQuantity;

    // Update the add-to-cart button price.
    const productId = new URLSearchParams(
      window.location.search
    ).get("id");

    const product =
      products.find((item) => item.id === productId) ||
      products[0];

    const detailAddButton = document.querySelector(
      "[data-detail-add]"
    );

    if (detailAddButton) {
      detailAddButton.textContent =
        `Add to bag — ${formatMoney(
          product.price * newQuantity
        )}`;
    }
  }

  // Toggle the mobile navigation menu.
  if (clickedElement.closest("[data-menu-toggle]")) {
    document
      .querySelector(".navlinks")
      ?.classList.toggle("open");
  }
});


/* ========================================
   SORTING EVENTS
======================================== */

document.addEventListener("change", (event) => {
  if (event.target.id === "sort-products") {
    renderProductCatalog();
  }
});


/* ========================================
   NEWSLETTER FORM
======================================== */

document.addEventListener("submit", (event) => {
  const form = event.target;

  if (form.matches("[data-newsletter]")) {
    event.preventDefault();

    showToast("Thanks for joining the Contour list!");

    form.reset();
  }
});


/* ========================================
   KEYBOARD EVENTS
======================================== */

// Close the shopping cart when Escape is pressed.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});


/* ========================================
   INITIALIZE THE WEBSITE
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Render products on the relevant pages.
  renderFeaturedProducts();
  renderProductCatalog();
  renderProductDetails();

  // Update the cart counter.
  updateCartCount();

  // Display the current year in the footer.
  document
    .querySelectorAll("[data-current-year]")
    .forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

  // Close the cart when the user clicks its backdrop.
  const cartDrawer = document.querySelector(".cart-drawer");

  cartDrawer?.addEventListener("click", (event) => {
    if (event.target === cartDrawer) {
      closeCart();
    }
  });
});
