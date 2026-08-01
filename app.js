/* ==========================================================================
   KAIVEN SOFTWARE - DYNAMIC APPLICATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Soft Ambient Canvas Glows (No Tech Lines)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('oceanCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const mouse = { x: null, y: null, radius: 220 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 3 + 1.5;
        this.color = Math.random() > 0.3 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(224, 169, 56, 0.3)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2;
            this.y -= (dy / dist) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Soft ambient floating ember dots only - NO CONNECTING LINES
    const particles = Array.from({ length: 45 }, () => new Particle());

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  // --------------------------------------------------------------------------
  // 2. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));

  // --------------------------------------------------------------------------
  // 3. Hero Carousel Switcher
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.rs-carousel-dots .dot');
  let currentSlide = 0;
  let carouselTimer = null;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = index % slides.length;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetTimer();
    });
  });

  function startTimer() {
    carouselTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  function resetTimer() {
    clearInterval(carouselTimer);
    startTimer();
  }

  if (slides.length > 1) {
    startTimer();
  }

  // --------------------------------------------------------------------------
  // 4. Interactive Search Modal
  // --------------------------------------------------------------------------
  const searchModal = document.getElementById('searchModal');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');

  openSearchBtn?.addEventListener('click', () => {
    searchModal?.classList.add('active');
    searchInput?.focus();
  });

  closeSearchBtn?.addEventListener('click', () => {
    searchModal?.classList.remove('active');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchModal?.classList.remove('active');
    }
  });

  // --------------------------------------------------------------------------
  // 5. Mobile Navigation & Form Validation
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mainMenu = document.getElementById('mainMenu');

  mobileToggle?.addEventListener('click', () => {
    mainMenu?.classList.toggle('active');
  });

  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMessage = document.getElementById('newsletterMessage');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    if (email) {
      newsletterMessage.className = 'form-feedback success';
      newsletterMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> Subscribed successfully to Kaiven Software!`;
      newsletterForm.reset();
    }
  });

  const contactForm = document.getElementById('contactForm');
  const contactFormStatus = document.getElementById('contactFormStatus');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    contactFormStatus.className = 'form-feedback success';
    contactFormStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Message sent successfully to Kaiven Software.`;
    contactForm.reset();
  });

});
