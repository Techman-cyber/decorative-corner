// ============================================
// Decorative Corner — shared site behavior
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initAddToCart();
  initProductNavigation();
  initCartButton();
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
function getProducts() {
  return [
    {id:'blush',name:'Blush Ring',price:1299,image:'images/product-pink.png',tag:'Wall hanging',rating:4.8,description:'A soft blush beaded hanging with pearl strands and a hand-knotted tassel. A beautiful accent for walls, doors, and gifting.',details:['Handmade with care','Pearl and gold-tone bead details','Ready to hang','Made to order']},
    {id:'azure',name:'Azure Ring',price:1499,image:'images/product-blue.png',tag:'Wall hanging',rating:4.9,description:'A calming blue beaded hanging designed to add a refined handmade touch to your home.',details:['Handmade beaded design','Premium decorative materials','Ready to hang','Gift-friendly packaging']},
    {id:'ivy',name:'Ivy Ring',price:1399,image:'images/product-green.png',tag:'Wall hanging',rating:4.7,description:'A fresh green statement piece with layered beads and a handcrafted tassel.',details:['Handmade finish','Elegant green colourway','Easy to hang','Made to order']}
  ];
}
function getCart(){try{return JSON.parse(localStorage.getItem('dc-cart')||'[]')}catch(e){return[]}}
function saveCart(c){localStorage.setItem('dc-cart',JSON.stringify(c)); updateCartCount();}
function updateCartCount(){const n=getCart().reduce((a,i)=>a+i.qty,0);document.querySelectorAll('[data-cart-button]').forEach(b=>{b.textContent=`Cart (${n})`;b.setAttribute('aria-label',`Cart, ${n} items`);});}
function addProduct(id,qty=1){const c=getCart(), item=c.find(i=>i.id===id);if(item)item.qty+=qty;else c.push({id,qty});saveCart(c);}
function initAddToCart(){document.querySelectorAll('.add-btn').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();addProduct(btn.dataset.productId||({ 'Blush Ring':'blush','Azure Ring':'azure','Ivy Ring':'ivy'}[btn.dataset.product]));btn.textContent='Added ✓';setTimeout(()=>btn.textContent='Add to cart',1200);}));updateCartCount();}
function initProductNavigation(){document.querySelectorAll('.product-card').forEach(card=>card.addEventListener('click',()=>location.href=`product.html?id=${card.dataset.productId}`));}
function initCartButton(){document.querySelectorAll('[data-cart-button]').forEach(b=>b.addEventListener('click',()=>location.href='cart.html'));}
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
