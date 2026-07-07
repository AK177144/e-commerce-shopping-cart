const container = document.getElementById("productContainer");

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem("token");

  window.location.href = "login.html";
});

async function loadProducts() {
  const result = await apiRequest("/products");

  if (!result.success) {
    container.innerHTML = "<h2>No products found.</h2>";

    return;
  }

  container.innerHTML = "";

  result.data.forEach((product) => {
    container.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <div class="price">₹${product.price}</div>

            <button onclick="addToCart('${product._id}')">

                Add to Cart

            </button>

        </div>

        `;
  });
}

async function addToCart(productId) {
  const result = await apiRequest(
    "/cart",

    "POST",

    {
      productId,

      quantity: 1,
    },
  );

  if (result.success) {
    alert("Product added to cart.");
  } else {
    alert(result.message);
  }
}

loadProducts();
