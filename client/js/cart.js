const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

async function loadCart() {
  const result = await apiRequest("/cart");

  if (!result.success) {
    cartItems.innerHTML = "<h2>Your cart is empty.</h2>";

    return;
  }

  cartItems.innerHTML = "";

  result.data.items.forEach((item) => {
    cartItems.innerHTML += `

        <div class="card" style="margin-bottom:20px">

            <h3>${item.product.name}</h3>

            <p>₹${item.price}</p>

            <p>

            Quantity:

            <input
            type="number"
            min="1"
            value="${item.quantity}"
            onchange="updateQuantity('${item.product._id}', this.value)">

            </p>

            <button
            onclick="removeItem('${item.product._id}')">

            Remove

            </button>

        </div>

        `;
  });

  totalPrice.innerHTML = `Total : ₹${result.totalPrice}`;
}

async function updateQuantity(productId, quantity) {
  await apiRequest(
    `/cart/${productId}`,

    "PUT",

    {
      quantity: Number(quantity),
    },
  );

  loadCart();
}

async function removeItem(productId) {
  await apiRequest(
    `/cart/${productId}`,

    "DELETE",
  );

  loadCart();
}

function checkout() {
  window.location.href = "checkout.html";
}

loadCart();
