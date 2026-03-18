function initBlogPostPage() {
  const heroContainer = document.getElementById('article-hero');
  const bodyContainer = document.getElementById('article-body');
  const relatedContainer = document.getElementById('related-posts');
  const query = new URLSearchParams(window.location.search);
  const slug = query.get('slug');

  if (!heroContainer || !bodyContainer || !relatedContainer || !window.BLOG_POSTS) {
    return;
  }

  const post = window.BLOG_POSTS.find(item => item.slug === slug) || window.BLOG_POSTS[0];
  const metaDescription = document.querySelector('meta[name="description"]');

  document.title = post.title + ' | IQ-Line Blog';
  if (metaDescription) {
    metaDescription.setAttribute('content', post.excerpt);
  }

  heroContainer.style.background = post.gradient;
  heroContainer.innerHTML = [
    '<div>',
    '<div class="tag" style="background:rgba(255,255,255,0.18); color:white;">' + escapeArticle(post.category) + '</div>',
    '<div class="blog-meta" style="color:rgba(255,255,255,0.8); margin:0 0 12px;">',
    '<span><i class="fas fa-calendar"></i> ' + escapeArticle(post.date) + '</span>',
    '<span><i class="fas fa-clock"></i> ' + escapeArticle(post.readTime) + '</span>',
    '</div>',
    '<h1>' + escapeArticle(post.title) + '</h1>',
    '<p style="color:rgba(255,255,255,0.82); max-width:720px; margin-top:16px;">' + escapeArticle(post.excerpt) + '</p>',
    '</div>'
  ].join('');

  bodyContainer.innerHTML = post.sections
    .map(section => {
      const paragraphs = section.paragraphs
        .map(paragraph => '<p>' + escapeArticle(paragraph) + '</p>')
        .join('');
      return '<section><h2>' + escapeArticle(section.heading) + '</h2>' + paragraphs + '</section>';
    })
    .join('') +
    renderTakeaways(post.takeaways);

  relatedContainer.innerHTML = window.BLOG_POSTS
    .filter(item => item.slug !== post.slug)
    .sort((left, right) => Number(right.category === post.category) - Number(left.category === post.category))
    .slice(0, 3)
    .map(item => {
      return [
        '<div class="related-post">',
        '<div class="blog-meta"><span class="category">' + escapeArticle(item.category) + '</span><span>' + escapeArticle(item.readTime) + '</span></div>',
        '<h4 style="font-size:1rem; margin-bottom:8px;"><a href="blog-post.html?slug=' + encodeURIComponent(item.slug) + '">' + escapeArticle(item.title) + '</a></h4>',
        '<p style="font-size:0.84rem; margin-bottom:10px;">' + escapeArticle(item.excerpt) + '</p>',
        '<a href="blog-post.html?slug=' + encodeURIComponent(item.slug) + '" class="read-more">Open Article <i class="fas fa-arrow-right"></i></a>',
        '</div>'
      ].join('');
    })
    .join('');
}

function renderTakeaways(items) {
  if (!items || !items.length) {
    return '';
  }

  return [
    '<section class="article-takeaways">',
    '<h3 style="margin-bottom:8px;">Key Takeaways</h3>',
    '<ul>',
    items.map(item => '<li><i class="fas fa-check-circle"></i><span>' + escapeArticle(item) + '</span></li>').join(''),
    '</ul>',
    '</section>'
  ].join('');
}

function escapeArticle(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
