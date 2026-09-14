const next = (location.pathname.split('/').pop() || 'index.html') + location.search;
(async function(){
  if (!window.Clerk) { location.replace('login.html?next='+encodeURIComponent(next)); return; }
  await Clerk.load();
  if (!Clerk.user) { location.replace('login.html?next='+encodeURIComponent(next)); return; }
  document.documentElement.classList.remove('auth-checking');
  document.addEventListener('click', e => {
    const btn=e.target.closest('[data-logout]');
    if(btn) Clerk.signOut().then(()=>location.replace('login.html'));
  });
})();
