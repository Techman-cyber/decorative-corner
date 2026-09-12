// ============================================
// Decorative Corner — shared site behavior
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initAddToCart();
  initNewsletterForm();
  initContactForm();
});

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.hidden = isOpen;
  });
}

/* ---------- Add to cart (front-end only, no backend wired up) ---------- */
function initAddToCart() {
  const buttons = document.querySelectorAll('.add-btn:not([disabled])');
  let cartCount = 0;
  const cartBtn = document.querySelector('[aria-label^="Cart"]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const alreadyAdded = btn.getAttribute('data-added') === 'true';
      if (alreadyAdded) return;

      btn.setAttribute('data-added', 'true');
      btn.textContent = 'Added';
      cartCount += 1;
      if (cartBtn) {
        cartBtn.textContent = `Cart (${cartCount})`;
        cartBtn.setAttribute('aria-label', `Cart, ${cartCount} items`);
      }

      setTimeout(() => {
        btn.removeAttribute('data-added');
        btn.textContent = 'Add to cart';
      }, 1600);
    });
  });
}

/* ---------- Newsletter form ---------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  const note = document.getElementById('newsletter-note');
  const emailInput = document.getElementById('newsletter-email');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      note.textContent = 'Please enter a valid email address.';
      note.style.color = '#b5502e';
      return;
    }

    // No backend connected yet — this just confirms the input locally.
    note.textContent = `Thanks — we'll let you know at ${email} when new pieces launch.`;
    note.style.color = '#b8923f';
    form.reset();
  });
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('name'), row: document.getElementById('row-name') },
    email: { el: document.getElementById('email'), row: document.getElementById('row-email') },
    topic: { el: document.getElementById('topic'), row: document.getElementById('row-topic') },
    message: { el: document.getElementById('message'), row: document.getElementById('row-message') },
  };

  const status = document.getElementById('form-status');

  Object.values(fields).forEach(({ el, row }) => {
    el.addEventListener('input', () => row.classList.remove('has-error'));
    el.addEventListener('change', () => row.classList.remove('has-error'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    if (!fields.name.el.value.trim()) {
      fields.name.row.classList.add('has-error');
      hasError = true;
    }

    if (!isValidEmail(fields.email.el.value.trim())) {
      fields.email.row.classList.add('has-error');
      hasError = true;
    }

    if (!fields.topic.el.value) {
      fields.topic.row.classList.add('has-error');
      hasError = true;
    }

    if (fields.message.el.value.trim().length < 10) {
      fields.message.row.classList.add('has-error');
      hasError = true;
    }

    if (hasError) {
      status.textContent = 'Please fix the highlighted fields and try again.';
      status.className = 'form-status error';
      const firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // No backend connected yet — swap this for a real fetch() call to your
    // form endpoint (e.g. Formspree, a serverless function, your own API).
    status.textContent = "Thanks — your message is in. We'll reply within one business day.";
    status.className = 'form-status success';
    form.reset();
  });
}

/* ---------- Shared helpers ---------- */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ---------- Hidden admin shortcut: Ctrl + A twice ---------- */
(function initAdminShortcut() {
  let presses = 0;
  let resetTimer;
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      presses += 1;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { presses = 0; }, 1200);
      if (presses === 2) {
        presses = 0;
        const pass = window.prompt('Admin password:');
        if (pass === 'whytofearwhenwearehere') {
          window.location.href = 'admin.html';
        } else if (pass !== null) {
          window.alert('Incorrect admin password.');
        }
      }
    }
  });
})();
