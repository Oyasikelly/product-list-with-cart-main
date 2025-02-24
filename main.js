let cart = new Map();

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function createMenuItem(item) {
  const div = document.createElement("div");
  div.className = "menu-item";
  div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-item-content">
            <div class="menu-item-category">${item.category}</div>
            <h3 class="menu-item-title">${item.name}</h3>
            <div class="menu-item-price">${formatPrice(item.price)}</div>
            <div class="quantity-control" style="display: none;">
                <button class="quantity-button minus" disabled>-</button>
                <span class="quantity">1</span>
                <button class="quantity-button plus">+</button>
            </div>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    `;

  const quantityControl = div.querySelector(".quantity-control");
  const addToCartBtn = div.querySelector(".add-to-cart");
  const minusBtn = div.querySelector(".minus");
  const plusBtn = div.querySelector(".plus");
  const quantitySpan = div.querySelector(".quantity");

  addToCartBtn.addEventListener("click", () => {
    quantityControl.style.display = "flex";
    addToCartBtn.style.display = "none";
    updateCart(item, 1);
  });

  minusBtn.addEventListener("click", () => {
    const currentQty = parseInt(quantitySpan.textContent);
    if (currentQty > 1) {
      quantitySpan.textContent = currentQty - 1;
      minusBtn.disabled = currentQty - 1 === 1;
      updateCart(item, currentQty - 1);
    }
  });

  plusBtn.addEventListener("click", () => {
    const currentQty = parseInt(quantitySpan.textContent);
    quantitySpan.textContent = currentQty + 1;
    minusBtn.disabled = false;
    updateCart(item, currentQty + 1);
  });

  return div;
}

function updateCart(item, quantity) {
  cart.set(item.id, { item, quantity });
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach(({ item, quantity }) => {
    const itemTotal = item.price * quantity;
    total += itemTotal;
    count += quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <span class="cart-item-title">${item.name}</span>
                <span class="cart-item-price">${quantity}x @ ${formatPrice(
      item.price
    )}</span>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;

    cartItems.appendChild(div);
  });

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      cart.delete(id);

      // Reset the menu item's quantity control
      const menuItem = document
        .querySelector(`[data-id="${id}"]`)
        .closest(".menu-item");
      if (menuItem) {
        menuItem.querySelector(".quantity-control").style.display = "none";
        menuItem.querySelector(".add-to-cart").style.display = "block";
        menuItem.querySelector(".quantity").textContent = "1";
        menuItem.querySelector(".minus").disabled = true;
      }

      renderCart();
    });
  });
}

function showOrderConfirmation() {
  const modal = document.getElementById("orderModal");
  const modalOrderSummary = document.getElementById("modalOrderSummary");

  let summaryHTML = "";
  let total = 0;

  cart.forEach(({ item, quantity }) => {
    const itemTotal = item.price * quantity;
    total += itemTotal;
    summaryHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.name}</span>
                    <span class="cart-item-price">${quantity}x @ ${formatPrice(
      item.price
    )}</span>
                </div>
                <span>${formatPrice(itemTotal)}</span>
            </div>
        `;
  });

  summaryHTML += `
        <div class="cart-total">
            <span>Order Total</span>
            <span>${formatPrice(total)}</span>
        </div>
    `;

  modalOrderSummary.innerHTML = summaryHTML;
  modal.style.display = "flex";
}

// Initialize the menu
document.addEventListener("DOMContentLoaded", () => {
  const menuGrid = document.getElementById("menuGrid");
  menuItems.forEach((item) => {
    menuGrid.appendChild(createMenuItem(item));
  });

  // Add event listeners for order confirmation
  document
    .getElementById("confirmOrder")
    .addEventListener("click", showOrderConfirmation);

  document.getElementById("startNewOrder").addEventListener("click", () => {
    cart.clear();
    renderCart();
    document.getElementById("orderModal").style.display = "none";

    // Reset all quantity controls
    document.querySelectorAll(".quantity-control").forEach((control) => {
      control.style.display = "none";
      control.querySelector(".quantity").textContent = "1";
      control.querySelector(".minus").disabled = true;
    });

    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.style.display = "block";
    });
  });
});
