const searchInput = document.querySelector('input[type="text"]');
const categoryLinks = document.querySelectorAll('.categories li');
const noticesContainer = document.querySelector('.notice-grid');

async function fetchNotices(category = "All", q = "") {
  const res = await fetch(`/api/notices?category=${category}&q=${q}`);
  const notices = await res.json();

  noticesContainer.innerHTML = notices.length
    ? notices.map(n => `
      <div class="notice">
        <span class="tag ${n.category.toLowerCase()}">${n.category}</span>
        <h4>${n.title}</h4>
        <p>${n.description}</p>
        <p class="expires"><i class="fa fa-clock"></i> Expires: ${new Date(n.expiry).toDateString()}</p>
      </div>`).join("")
    : `<p>No notices found.</p>`;
}

// search
searchInput.addEventListener("input", e => fetchNotices("All", e.target.value));

// category filter
categoryLinks.forEach(li => {
  li.addEventListener("click", () => {
    categoryLinks.forEach(x => x.classList.remove("active"));
    li.classList.add("active");
    fetchNotices(li.textContent.trim());
  });
});

fetchNotices();
