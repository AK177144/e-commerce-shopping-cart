document.addEventListener("DOMContentLoaded", async () => {
  loadNavbar();
});

async function loadNavbar() {
  const response = await fetch("components/navbar.html");

  const html = await response.text();

  document.getElementById("navbar").innerHTML = html;

  setupNavbar();
}


async function loadFooter() {
  const response = await fetch("components/footer.html");

  const html = await response.text();

  document.getElementById("footer").innerHTML = html;
}


function setupNavbar() {
  const menuToggle = document.getElementById("menuToggle");

  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  const token = localStorage.getItem("token");

  const authLink = document.getElementById("authLink");

  if (token) {
    authLink.innerHTML = `<a href="#" id="logoutBtn">

        Logout

        </a>`;

    document

      .getElementById("logoutBtn")

      .addEventListener("click", (e) => {
        e.preventDefault();

        localStorage.removeItem("token");

        window.location.href = "login.html";
      });
  }
}
