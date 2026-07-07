const container = document.getElementById("productContainer");

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");

  window.location.href = "login.html";
});

async function loadProducts() {
  const result = await apiRequest("/products");

  if (!result.success) {
    container.innerHTML = "<h3>No products found.</h3>";

    return;
  }

  container.innerHTML = "";

  result.data.forEach((product) => {
    container.innerHTML += `
    <div class="product-card">

       <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/no-image.png'">

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

function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

async function addToCart(productId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  const result = await apiRequest("/cart", "POST", {
    productId: productId,
    quantity: 1,
  });

  if (result.success) {
    alert("Product added to cart.");
  } else {
    alert(result.message);
  }
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
    alert("Added to cart");
  } else {
    alert(result.message);
  }
}

loadProducts();
