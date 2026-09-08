// Load navbar dynamically
fetch("navbar.html")
  .then(res => {
    if (!res.ok) throw new Error("Navbar not found");
    return res.text();
  })
  .then(data => {
    const container = document.getElementById("navbar-container");
    if (container) {
      container.innerHTML = data;
    } else {
      console.error("Navbar container not found in the page");
    }
  })
  .catch(err => console.error("Failed to load navbar:", err));
