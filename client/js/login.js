const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value;

  const result = await apiRequest("/auth/login", "POST", {
    email,
    password,
  });

  if (result.success) {
    // Save JWT
    localStorage.setItem("token", result.token);

    alert("Login Successful");

    window.location.href = "index.html";
  } else {
    alert(result.message);
  }
});
