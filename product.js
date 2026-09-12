import {db,auth} from './firebase-config.js';
import {collection,addDoc,query,where,onSnapshot,serverTimestamp,deleteDoc,doc} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

// If the product page is reloaded, return visitors to the shop homepage.
// Normal navigation from a product card still opens the product page.
const navigationEntry = performance.getEntriesByType?.('navigation')?.[0];
const isReload = navigationEntry?.type === 'reload' || (!navigationEntry && performance.navigation?.type === 1);
if (isReload && location.pathname.endsWith('/product.html')) {
  location.replace('./');
  throw new Error('Redirecting after product-page reload');
}
const products={"Blush Ring":{image:'images/product-pink.png',price:0,description:'Handmade pink beaded wall hanging.'},"Azure Ring":{image:'images/product-blue.png',price:0,description:'Handmade blue beaded wall hanging.'},"Ivy Ring":{image:'images/product-green.png',price:0,description:'Handmade green beaded wall hanging.'}};
const name=new URLSearchParams(location.search).get('name')||'Blush Ring',p=products[name]||products['Blush Ring'];
document.getElementById('product-name').textContent=name;document.getElementById('product-image').src=p.image;document.getElementById('product-price').textContent=p.price?'₹'+p.price:'Price coming soon';document.getElementById('product-description').textContent=p.description;
const gallery=document.getElementById('gallery'),img=document.getElementById('product-image');gallery.addEventListener('mousemove',e=>{const r=gallery.getBoundingClientRect();gallery.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');gallery.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');gallery.classList.add('zoomed')});gallery.addEventListener('mouseleave',()=>gallery.classList.remove('zoomed'));
const cart=()=>JSON.parse(localStorage.getItem('dc-cart')||'[]');
document.getElementById('add').onclick=()=>{let c=cart(),q=Math.max(1,+document.getElementById('qty').value||1),x=c.find(i=>i.name===name);if(x)x.qty+=q;else c.push({name,price:p.price,image:p.image,qty:q});localStorage.setItem('dc-cart',JSON.stringify(c));document.getElementById('view-cart').style.display='inline-flex';document.getElementById('add').textContent='Added to cart ✓';};
const reviews=document.getElementById('reviews'),summary=document.getElementById('rating-summary');const q=query(collection(db,'reviews'),where('product','==',name));onSnapshot(q,s=>{let total=0,html='';s.forEach(d=>{const r=d.data();total+=Number(r.rating);html+=`<article class="review"><div><span class="reviewer">${escapeHtml(r.name||'Customer')}</span><span class="review-date">Verified account</span>${auth.currentUser&&auth.currentUser.uid===r.uid?` <button type="button" class="delete-review" data-id="${d.id}">Delete</button>`:''}</div><div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>${r.text?`<p>${escapeHtml(r.text)}</p>`:''}</article>`});reviews.innerHTML=html||'<div class="empty">No reviews yet.</div>';const avg=s.size?total/s.size:0;summary.innerHTML=`<span class="stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</span><small>${s.size?avg.toFixed(1)+' / 5 · ':''}(${s.size} ratings)</small>`;},()=>reviews.textContent='Reviews are not available yet. Check Firebase setup.');
function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
let selectedRating=0;const picker=document.getElementById('star-picker');picker.addEventListener('click',e=>{const b=e.target.closest('[data-rating]');if(!b)return;selectedRating=Number(b.dataset.rating);picker.querySelectorAll('.star-choice').forEach(x=>x.classList.toggle('selected',Number(x.dataset.rating)<=selectedRating));document.getElementById('selected-rating').textContent=`${selectedRating} star${selectedRating===1?'':'s'} selected`;});
let authReady=false; onAuthStateChanged(auth,()=>{authReady=true;});
document.getElementById('review-form').addEventListener('submit',async e=>{e.preventDefault();const user=auth.currentUser;if(!user){document.getElementById('status').textContent='Please log in to submit a review.';return;}const text=document.getElementById('review-text').value.trim();if(!selectedRating){document.getElementById('status').textContent='Choose a star rating.';return;}const accountName=user.displayName||user.email?.split('@')[0]||'Customer';try{await addDoc(collection(db,'reviews'),{product:name,name:accountName,rating:selectedRating,text,uid:user.uid,createdAt:serverTimestamp()});e.target.reset();selectedRating=0;picker.querySelectorAll('.star-choice').forEach(x=>x.classList.remove('selected'));document.getElementById('selected-rating').textContent='Choose 1–5 stars';document.getElementById('status').textContent='Review submitted.';}catch(err){document.getElementById('status').textContent='Could not submit review. Check Firebase rules.';console.error('Review submit error:',err);}});


document.addEventListener('click',async e=>{
 const b=e.target.closest('.delete-review'); if(!b)return;
 if(!auth.currentUser)return;
 if(!confirm('Delete your review?'))return;
 try{await deleteDoc(doc(db,'reviews',b.dataset.id));}catch(err){console.error(err);alert('Could not delete review.');}
});
