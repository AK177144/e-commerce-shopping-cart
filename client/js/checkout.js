const form = document.getElementById("checkoutForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    shippingAddress: {
      fullName: document.getElementById("fullName").value,

      phone: document.getElementById("phone").value,

      address: document.getElementById("address").value,

      city: document.getElementById("city").value,

      state: document.getElementById("state").value,

      postalCode: document.getElementById("postalCode").value,

      country: "India",
    },

    paymentMethod: document.getElementById("paymentMethod").value,
  };

  const result = await apiRequest(
    "/orders",

    "POST",

    body,
  );

  if (result.success) {
    alert("Order Placed Successfully");

    window.location.href = "orders.html";
  } else {
    alert(result.message);
  }
});
