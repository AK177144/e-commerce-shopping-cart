const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value;

  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");

    return;
  }

  const result = await apiRequest(
    "/auth/register",

    "POST",

    {
      name,
      email,
      password,
    },
  );

  if (result.success) {
    alert("Registration Successful");

    window.location.href = "login.html";
  } else {
    alert(result.message);
  }
});
