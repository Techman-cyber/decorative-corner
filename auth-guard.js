const next = (location.pathname.split('/').pop() || 'index.html') + location.search;
(async function(){
  if (!window.Clerk) { location.replace('login.html?next='+encodeURIComponent(next)); return; }
  const clerk = new window.Clerk("pk_live_Y2xlcmsudGVjaG1hbi1jeWJlci5naXRodWIuaW8k");
  await clerk.load();
  if (!clerk.user) { location.replace('login.html?next='+encodeURIComponent(next)); return; }
  document.documentElement.classList.remove('auth-checking');
  document.addEventListener('click', e => {
    const btn=e.target.closest('[data-logout]');
    if(btn) clerk.signOut().then(()=>location.replace('login.html'));
  });
})();
