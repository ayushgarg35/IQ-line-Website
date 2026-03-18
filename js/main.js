// ========================
// IQ-LINE - Global JS
// ========================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Navbar scroll effect ----
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---- Mobile hamburger ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
  }

  // ---- Accordion ----
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('open');
      // Close all
      document.querySelectorAll('.accordion-header').forEach(h => {
        h.classList.remove('open');
        h.nextElementSibling.classList.remove('open');
      });
      // Toggle clicked
      if (!isOpen) {
        header.classList.add('open');
        body.classList.add('open');
      }
    });
  });

  // ---- Scroll to top ----
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Intersection Observer (fade-up / fade-in) ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));

  // ---- Counter animation ----
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
    }, 16);
  }

  // ---- Active nav link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav
        if (mobileNav) {
          mobileNav.classList.remove('open');
          hamburger.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });
  });

});

// ---- Shared nav HTML builder ----
function buildNav(activePage) {
  return `
  <nav class="navbar" id="navbar">
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">
        <img src="images/logo.png" alt="IQ-Line" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <span class="logo-fallback" style="display:none; font-family:'Rajdhani',sans-serif; font-size:1.6rem; font-weight:800; color:#3d3d3d;">IQ<span style="color:#3DBDB1;">-LINE</span></span>
      </a>

      <ul class="nav-menu">
        <li class="nav-item">
          <a href="solutions.html" class="nav-link ${activePage==='solutions'?'active':''}">
            Solutions <i class="fas fa-chevron-down arrow"></i>
          </a>
          <div class="dropdown">
            <a href="solutions-healthcare.html">
              <span class="dd-icon"><i class="fas fa-hospital"></i></span>
              Healthcare Solutions
            </a>
            <a href="solutions-sms.html">
              <span class="dd-icon"><i class="fas fa-graduation-cap"></i></span>
              Student Management System
            </a>
          </div>
        </li>
        <li class="nav-item">
          <a href="products.html" class="nav-link ${activePage==='products'?'active':''}">
            Products <i class="fas fa-chevron-down arrow"></i>
          </a>
          <div class="dropdown">
            <a href="products.html#lims"><span class="dd-icon"><i class="fas fa-flask"></i></span>LIMS</a>
            <a href="products.html#hims"><span class="dd-icon"><i class="fas fa-hospital"></i></span>HIMS</a>
            <a href="products.html#rims"><span class="dd-icon"><i class="fas fa-x-ray"></i></span>RIMS</a>
            <a href="products.html#eprescription"><span class="dd-icon"><i class="fas fa-prescription"></i></span>E-Prescription</a>
            <a href="products.html#bms"><span class="dd-icon"><i class="fas fa-tint"></i></span>BMS</a>
            <a href="products.html#mums"><span class="dd-icon"><i class="fas fa-university"></i></span>MUMS</a>
            <a href="products.html#ews"><span class="dd-icon"><i class="fas fa-exclamation-triangle"></i></span>EWS</a>
          </div>
        </li>
        <li class="nav-item">
          <a href="about.html" class="nav-link ${activePage==='about'?'active':''}">
            About Us <i class="fas fa-chevron-down arrow"></i>
          </a>
          <div class="dropdown">
            <a href="about.html#mission"><span class="dd-icon"><i class="fas fa-bullseye"></i></span>Mission</a>
            <a href="about.html#scale"><span class="dd-icon"><i class="fas fa-chart-line"></i></span>Scale & Impact</a>
            <a href="about.html#compliances"><span class="dd-icon"><i class="fas fa-shield-alt"></i></span>Compliances</a>
            <a href="about.html#founders"><span class="dd-icon"><i class="fas fa-users"></i></span>Founders</a>
          </div>
        </li>
        <li class="nav-item">
          <a href="blogs.html" class="nav-link ${activePage==='blogs'?'active':''}">Blogs</a>
        </li>
        <li class="nav-item">
          <a href="careers.html" class="nav-link ${activePage==='careers'?'active':''}">Careers</a>
        </li>
      </ul>

      <div class="nav-cta">
        <a href="contact.html" class="btn btn-primary btn-sm ${activePage==='contact'?'active':''}">
          <i class="fas fa-phone-alt"></i> Contact Us
        </a>
      </div>

      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Mobile Nav -->
  <div class="mobile-nav" id="mobileNav">
    <a href="index.html"><i class="fas fa-home" style="margin-right:8px;color:#3DBDB1;"></i> Home</a>
    <a href="solutions.html"><i class="fas fa-layer-group" style="margin-right:8px;color:#3DBDB1;"></i> Solutions</a>
    <a href="solutions-healthcare.html" class="sub-link">Healthcare Solutions</a>
    <a href="solutions-sms.html" class="sub-link">Student Management System</a>
    <a href="products.html"><i class="fas fa-box" style="margin-right:8px;color:#3DBDB1;"></i> Products</a>
    <a href="products.html#lims" class="sub-link">LIMS</a>
    <a href="products.html#hims" class="sub-link">HIMS</a>
    <a href="products.html#rims" class="sub-link">RIMS</a>
    <a href="products.html#eprescription" class="sub-link">E-Prescription</a>
    <a href="products.html#bms" class="sub-link">BMS</a>
    <a href="products.html#mums" class="sub-link">MUMS</a>
    <a href="products.html#ews" class="sub-link">EWS</a>
    <a href="about.html"><i class="fas fa-building" style="margin-right:8px;color:#3DBDB1;"></i> About Us</a>
    <a href="about.html#mission" class="sub-link">Mission</a>
    <a href="about.html#founders" class="sub-link">Founders</a>
    <a href="blogs.html"><i class="fas fa-blog" style="margin-right:8px;color:#3DBDB1;"></i> Blogs</a>
    <a href="careers.html"><i class="fas fa-briefcase" style="margin-right:8px;color:#3DBDB1;"></i> Careers</a>
    <a href="contact.html"><i class="fas fa-envelope" style="margin-right:8px;color:#3DBDB1;"></i> Contact Us</a>
    <br>
    <a href="contact.html" style="background:#3DBDB1; color:white; border-radius:8px; text-align:center; font-weight:600; margin-top:12px;">
      Request Demo →
    </a>
  </div>

  <button class="scroll-top" id="scrollTop" title="Back to top">
    <i class="fas fa-chevron-up"></i>
  </button>
  `;
}

// ---- Shared footer HTML builder ----
function buildFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="images/logo.png" alt="IQ-Line" onerror="this.outerHTML='<span style=\'font-family:Rajdhani,sans-serif;font-size:1.8rem;font-weight:800;color:white;\'>IQ<span style=\\\'color:#3DBDB1;\\\'>-LINE</span></span>'">
          </div>
          <p>Elevating Lives Digitally. We build practical, deep tech healthcare solutions for Bharat — powering hospitals, labs, and medical colleges with intelligent, interoperable systems.</p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="social-link" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            <a href="#" class="social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          </div>
        </div>

        <div class="footer-col">
          <h5>Solutions</h5>
          <ul>
            <li><a href="solutions-healthcare.html">Healthcare Solutions</a></li>
            <li><a href="solutions-sms.html">Student Management System</a></li>
            <li><a href="products.html">All Products</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="about.html#mission">Our Mission</a></li>
            <li><a href="about.html#scale">Scale & Impact</a></li>
            <li><a href="about.html#compliances">Compliances</a></li>
            <li><a href="about.html#founders">Founders</a></li>
            <li><a href="blogs.html">Blogs</a></li>
            <li><a href="careers.html">Careers</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h5>Contact</h5>
          <div class="footer-contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>India — Built for Bharat</span>
          </div>
          <div class="footer-contact-item">
            <i class="fas fa-envelope"></i>
            <span>hello@iqline.in</span>
          </div>
          <div class="footer-contact-item">
            <i class="fas fa-phone-alt"></i>
            <span>+91 XXXXX XXXXX</span>
          </div>
          <br>
          <a href="contact.html" class="btn btn-outline btn-sm" style="border-color:rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);">Request Demo</a>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} IQ-Line Technologies Pvt. Ltd. All rights reserved.</span>
        <span>Elevating Lives Digitally 🇮🇳</span>
      </div>
    </div>
  </footer>
  `;
}
