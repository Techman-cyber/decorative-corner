import {db} from './firebase-config.js';
import {collection,addDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
const form=document.getElementById('newsletter-form');
if(form){form.addEventListener('submit',async()=>{const input=document.getElementById('newsletter-email');const email=input?.value.trim();if(!email)return;try{await addDoc(collection(db,'subscriptions'),{email,verified:false,createdAt:serverTimestamp(),source:'newsletter'});}catch(error){console.warn('Subscription record could not be saved:',error);}},true);}
