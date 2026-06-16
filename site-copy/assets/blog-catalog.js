(function () {
  var catalog = document.querySelector("[data-blog-catalog]");
  if (!catalog) return;

  var list = catalog.querySelector("[data-blog-list]");
  var search = catalog.querySelector("[data-blog-search]");
  var filters = catalog.querySelector("[data-blog-filters]");
  var empty = catalog.querySelector("[data-blog-empty]");
  var posts = [];
  var activeCategory = "All";

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char];
    });
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function postMatches(post, query) {
    if (activeCategory !== "All" && post.category !== activeCategory) return false;
    if (!query) return true;
    var haystack = [
      post.title,
      post.description,
      post.category,
      (post.keywords || []).join(" "),
    ].join(" ");
    return normalize(haystack).indexOf(query) !== -1;
  }

  function renderFilters() {
    var categories = ["All"].concat(
      posts
        .map(function (post) { return post.category; })
        .filter(function (category, index, array) {
          return category && array.indexOf(category) === index;
        })
    );

    filters.innerHTML = categories.map(function (category) {
      var pressed = category === activeCategory ? "true" : "false";
      return '<button type="button" class="filter" aria-pressed="' + pressed + '" data-category="' + escapeHtml(category) + '">' + escapeHtml(category) + '</button>';
    }).join("");
  }

  function renderPosts() {
    var query = normalize(search.value).trim();
    var visiblePosts = posts.filter(function (post) {
      return postMatches(post, query);
    });

    list.innerHTML = visiblePosts.map(function (post) {
      return [
        '<a class="card" href="/blog/' + encodeURIComponent(post.slug) + '/" data-category="' + escapeHtml(post.category) + '">',
        '  <img src="' + escapeHtml(post.image) + '" alt="' + escapeHtml(post.imageAlt) + '" />',
        '  <div class="card-body">',
        '    <div class="meta-row"><span class="tag">' + escapeHtml(post.category) + '</span><span>' + escapeHtml(post.readTime || "") + '</span></div>',
        '    <h2>' + escapeHtml(post.title) + '</h2>',
        '    <p>' + escapeHtml(post.description) + '</p>',
        '    <span class="read">Read article</span>',
        '  </div>',
        '</a>',
      ].join("");
    }).join("");

    empty.hidden = visiblePosts.length > 0;
  }

  filters.addEventListener("click", function (event) {
    var button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.getAttribute("data-category") || "All";
    renderFilters();
    renderPosts();
  });

  search.addEventListener("input", renderPosts);

  fetch("/blog/content/posts.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("Unable to load blog posts");
      return response.json();
    })
    .then(function (data) {
      posts = Array.isArray(data) ? data : [];
      renderFilters();
      renderPosts();
    })
    .catch(function () {
      empty.hidden = false;
      empty.textContent = "Blog posts could not be loaded. Please refresh the page or contact us for help.";
    });
})();
