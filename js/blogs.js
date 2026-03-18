function initBlogPage() {
  const featuredContainer = document.getElementById('featured-post');
  const filtersContainer = document.getElementById('category-filters');
  const gridContainer = document.getElementById('blog-grid');
  const paginationContainer = document.getElementById('blog-pagination');

  if (!featuredContainer || !filtersContainer || !gridContainer || !paginationContainer || !window.BLOG_POSTS) {
    return;
  }

  const featuredPost = window.BLOG_POSTS.find(post => post.featured) || window.BLOG_POSTS[0];
  const allPosts = window.BLOG_POSTS.filter(post => !post.featured);
  const categories = ['All'].concat(
    Array.from(new Set(allPosts.map(post => post.category)))
  );

  const state = {
    category: 'All',
    page: 1,
    pageSize: 6
  };

  renderFeaturedPost(featuredContainer, featuredPost);
  renderFilters();
  renderListing();

  function renderFilters() {
    filtersContainer.innerHTML = categories
      .map(category => {
        const activeClass = category === state.category ? 'cat-btn active' : 'cat-btn';
        return '<button class="' + activeClass + '" data-category="' + escapeHtml(category) + '">' + escapeHtml(category) + '</button>';
      })
      .join('');

    filtersContainer.querySelectorAll('[data-category]').forEach(button => {
      button.addEventListener('click', () => {
        state.category = button.getAttribute('data-category');
        state.page = 1;
        renderFilters();
        renderListing();
      });
    });
  }

  function renderListing() {
    const filteredPosts = state.category === 'All'
      ? allPosts
      : allPosts.filter(post => post.category === state.category);
    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / state.pageSize));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.pageSize;
    const visiblePosts = filteredPosts.slice(start, start + state.pageSize);

    if (!visiblePosts.length) {
      gridContainer.innerHTML = '<div class="empty-state"><h3>No posts in this category yet</h3><p>Try another topic or check back soon for more IQ-Line insights.</p></div>';
    } else {
      gridContainer.innerHTML = visiblePosts.map(renderCard).join('');
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let buttons = '';
    for (let page = 1; page <= totalPages; page += 1) {
      const activeClass = page === state.page ? 'page-btn active' : 'page-btn';
      buttons += '<button class="' + activeClass + '" data-page="' + page + '">' + page + '</button>';
    }

    paginationContainer.innerHTML = buttons;
    paginationContainer.querySelectorAll('[data-page]').forEach(button => {
      button.addEventListener('click', () => {
        state.page = Number(button.getAttribute('data-page'));
        renderListing();
        paginationContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }
}

function renderFeaturedPost(container, post) {
  container.innerHTML = [
    '<div style="position:relative;z-index:1;">',
    '<span class="tag blog-featured-tag">Featured</span>',
    '<h2>' + escapeHtml(post.title) + '</h2>',
    '<p>' + escapeHtml(post.excerpt) + '</p>',
    '<div style="display:flex; gap:16px; align-items:center; margin-bottom:24px; flex-wrap:wrap;">',
    '<div style="display:flex; align-items:center; gap:8px; font-size:0.83rem; color:rgba(255,255,255,0.55);"><i class="fas fa-calendar"></i> ' + escapeHtml(post.date) + '</div>',
    '<div style="display:flex; align-items:center; gap:8px; font-size:0.83rem; color:rgba(255,255,255,0.55);"><i class="fas fa-clock"></i> ' + escapeHtml(post.readTime) + '</div>',
    '</div>',
    '<a href="blog-post.html?slug=' + encodeURIComponent(post.slug) + '" class="btn btn-white">Read Article <i class="fas fa-arrow-right"></i></a>',
    '</div>',
    '<div class="blog-featured-img">' + escapeHtml(post.icon) + '</div>'
  ].join('');
}

function renderCard(post) {
  return [
    '<article class="blog-card fade-up">',
    '<div class="blog-card-img" style="background:' + escapeHtml(post.gradient) + ';">' + escapeHtml(post.icon) + '</div>',
    '<div class="blog-card-body">',
    '<div class="blog-meta">',
    '<span class="category">' + escapeHtml(post.category) + '</span>',
    '<span><i class="fas fa-calendar"></i> ' + escapeHtml(post.date) + '</span>',
    '</div>',
    '<h3><a href="blog-post.html?slug=' + encodeURIComponent(post.slug) + '">' + escapeHtml(post.title) + '</a></h3>',
    '<p>' + escapeHtml(post.excerpt) + '</p>',
    '<a href="blog-post.html?slug=' + encodeURIComponent(post.slug) + '" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>',
    '</div>',
    '</article>'
  ].join('');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
