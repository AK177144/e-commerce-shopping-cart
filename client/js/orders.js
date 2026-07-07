const ordersContainer = document.getElementById("ordersContainer");

async function loadOrders() {
  const result = await apiRequest("/orders");

  if (!result.success) {
    ordersContainer.innerHTML = "<h2>No orders found.</h2>";
    return;
  }

  if (result.data.length === 0) {
    ordersContainer.innerHTML = "<h2>No orders placed yet.</h2>";
    return;
  }

  ordersContainer.innerHTML = "";

  result.data.forEach((order) => {
    ordersContainer.innerHTML += `

        <div class="card" style="margin-bottom:20px;">

            <h3>Order ID</h3>

            <p>${order._id}</p>

            <p><strong>Total:</strong> ₹${order.totalAmount}</p>

            <p><strong>Payment:</strong> ${order.paymentMethod}</p>

            <p><strong>Status:</strong> ${order.orderStatus}</p>

            <p><strong>Date:</strong>
            ${new Date(order.createdAt).toLocaleString()}
            </p>

        </div>

        `;
  });
}

loadOrders();
