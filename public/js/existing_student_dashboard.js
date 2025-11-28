// Sidebar toggle
const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Navigation page switching
const links = document.querySelectorAll(".sidebar a");
const sections = document.querySelectorAll(".section");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    // Remove active from all links
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // Show related section
    const target = link.getAttribute("data-section");
    sections.forEach(sec => sec.classList.remove("active"));
    if (document.getElementById(target)) {
      document.getElementById(target).classList.add("active");
    }
  });
});
