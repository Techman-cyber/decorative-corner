// ============================================
// Decorative Corner — shared site behavior
// ============================================

const WEB3FORMS_ACCESS_KEY = '086bf4c6-f5d8-4aa3-8c28-eb578ea0adb0';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const EMAILJS_PUBLIC_KEY = 'iqz0F_ZxKI5IhPsib';
const EMAILJS_SERVICE_ID = 'service_ucbrp5r';
const EMAILJS_SUBSCRIPTION_TEMPLATE_ID = 'template_ef70okk';
const EMAILJS_CONTACT_TEMPLATE_ID = 'template_ciivzbg';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initAddToCart();
  if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  initNewsletterForm();
  initContactForm();
  initCollectionSearch();
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

/* ---------- Persistent cart ---------- */
const CART_KEY = 'dc-cart';
const CART_PRODUCTS = {
  'Blush Ring': { id:'blush-ring', name:'Blush Ring', price:125, image:'images/product-pink.png' },
  'Azure Ring': { id:'azure-ring', name:'Azure Ring', price:125, image:'images/product-blue.png' },
  'Ivy Ring': { id:'ivy-ring', name:'Ivy Ring', price:125, image:'images/product-green.png' }
};
function readCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); } catch { return []; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartBadge(); }
function updateCartBadge(){
  const count=readCart().reduce((sum,item)=>sum+(Number(item.qty)||0),0);
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count);
  document.querySelectorAll('[data-cart-link]').forEach(el=>el.setAttribute('aria-label',`Shopping bag, ${count} items`));
}
function addProduct(name, quantity=1){
  const product=CART_PRODUCTS[name]; if(!product) return;
  const cart=readCart(); const existing=cart.find(item=>item.id===product.id);
  if(existing) existing.qty += quantity;
  else cart.push({...product, qty:quantity});
  saveCart(cart);
}
function initAddToCart(){
  document.querySelectorAll('.add-btn:not([disabled])').forEach(btn=>btn.addEventListener('click',()=>{
    addProduct(btn.dataset.product,1);
    const old=btn.textContent; btn.textContent='Added'; btn.disabled=true;
    setTimeout(()=>{btn.textContent=old;btn.disabled=false;},1200);
  }));
  updateCartBadge();
}

/* ---------- Newsletter form ---------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  const note = document.getElementById('newsletter-note');
  const emailInput = document.getElementById('newsletter-email');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      note.textContent = 'Please enter a valid email address.';
      note.style.color = '#b5502e';
      return;
    }
    note.textContent = 'Subscribing…';
    try {
      if (!window.emailjs) throw new Error('EmailJS library is unavailable');
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_SUBSCRIPTION_TEMPLATE_ID, {
        to_email: email,
        email,
        subscriber_email: email,
        subject: 'Verify your Decorative Corner subscription',
        message: 'Please verify your Decorative Corner subscription using the link in this email.'
      });
      note.textContent = 'Verification email sent. Please check your inbox.';
      note.style.color = '#b8923f';
      form.reset();
    } catch (error) {
      console.error('Newsletter error:', error);
      note.textContent = 'Subscription failed. Please try again later.';
      note.style.color = '#b5502e';
    }
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

  form.addEventListener('submit', async (e) => {
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

    status.textContent = 'Sending…';
    status.className = 'form-status';
    try {
      if (!window.emailjs) throw new Error('EmailJS library is unavailable');
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, {
        from_name: fields.name.el.value.trim(),
        from_email: fields.email.el.value.trim(),
        email: fields.email.el.value.trim(),
        replyto: fields.email.el.value.trim(),
        subject: fields.topic.el.value,
        message: fields.message.el.value.trim(),
        submitted_at: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      });
      status.textContent = "Thanks — your message has been sent. We'll reply within one business day.";
      status.className = 'form-status success';
      form.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      status.textContent = 'Could not send your message. Please try again later.';
      status.className = 'form-status error';
    }
  });
}


async function submitWeb3Form(fields) {
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      ...fields
    })
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Web3Forms submission failed');
  }
  return result;
}

/* ---------- Shared helpers ---------- */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ---------- Hidden admin shortcut: Ctrl + A twice ---------- */
(function initAdminShortcut() {
  let presses = 0;
  let lastPress = 0;
  let resetTimer;
  let comboHeld = false;

  document.addEventListener('keydown', (event) => {
    const isCtrlA = event.ctrlKey && event.code === 'KeyA';
    if (!isCtrlA || event.repeat || comboHeld) return;

    comboHeld = true;
    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    if (now - lastPress > 1500) presses = 0;
    lastPress = now;
    presses += 1;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      presses = 0;
      lastPress = 0;
    }, 1500);

    if (presses === 2) {
      presses = 0;
      lastPress = 0;
      clearTimeout(resetTimer);
      const pass = window.prompt('Admin password:');
      if (pass === 'whytofearwhenwearehere') {
        window.location.href = 'admin.html';
      } else if (pass !== null) {
        window.alert('Incorrect admin password.');
      }
    }
  }, true);

  document.addEventListener('keyup', (event) => {
    if (event.code === 'KeyA') comboHeld = false;
  }, true);
})();


function initCollectionSearch(){
  const input=document.getElementById('collection-search');
  if(input){
    const cards=[...document.querySelectorAll('.product-card')];
    input.addEventListener('input',()=>{const term=input.value.trim().toLowerCase();cards.forEach(card=>{card.hidden=!!term&&!card.textContent.toLowerCase().includes(term);});});
  }
  document.querySelectorAll('.product-card').forEach(card=>{
    card.setAttribute('tabindex','0');
    card.setAttribute('role','link');
    const link=card.querySelector('h3 a');
    if(!link)return;
    const open=()=>{window.location.href=link.href;};
    card.addEventListener('click',e=>{
      if(e.target.closest('button, a'))return;
      open();
    });
    card.addEventListener('keydown',e=>{
      if((e.key==='Enter'||e.key===' ') && !e.target.closest('button,a')){e.preventDefault();open();}
    });
  });
}
