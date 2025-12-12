// assets/site.js
(function () {
  // ---------- Theme toggle ----------
  const btnTheme = document.getElementById('btnTheme');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  function isDark() { return document.documentElement.classList.contains('dark'); }
  function setTheme(mode) {
    if (mode === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', mode);
    renderThemeButton();
  }
  function renderThemeButton() {
    if (!themeIcon || !themeLabel) return;
    const dark = isDark();
    themeIcon.textContent = dark ? '☀️' : '🌙';
    themeLabel.textContent = dark ? 'Light' : 'Dark';
  }
  if (btnTheme) {
    btnTheme.addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark'));
    renderThemeButton();
  }

  // ---------- Mobile nav ----------
  const btnMobileNav = document.getElementById('btnMobileNav');
  const sidebarPanel = document.getElementById('sidebarPanel');
  const mobileBackdrop = document.getElementById('mobileBackdrop');

  function openNav() {
    if (!sidebarPanel || !mobileBackdrop || !btnMobileNav) return;
    sidebarPanel.classList.remove('hidden');
    mobileBackdrop.classList.remove('hidden');
    btnMobileNav.setAttribute('aria-expanded', 'true');
  }
  function closeNav(force = false) {
    if (!sidebarPanel || !mobileBackdrop || !btnMobileNav) return;
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!force && desktop) return; // keep open on desktop
    sidebarPanel.classList.add('hidden');
    mobileBackdrop.classList.add('hidden');
    btnMobileNav.setAttribute('aria-expanded', 'false');
  }

  if (btnMobileNav) {
    btnMobileNav.addEventListener('click', () => {
      const open = sidebarPanel && !sidebarPanel.classList.contains('hidden');
      open ? closeNav(true) : openNav();
    });
  }
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', () => closeNav(true));

  window.addEventListener('resize', () => {
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!sidebarPanel || !mobileBackdrop) return;
    if (desktop) {
      sidebarPanel.classList.remove('hidden');
      mobileBackdrop.classList.add('hidden');
    } else {
      sidebarPanel.classList.add('hidden');
    }
  });

  // ---------- Copy buttons ----------
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const raw = btn.getAttribute('data-copy') || '';
      const text = raw.replace(/&#10;/g, '\n');
      const old = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied ✓';
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        btn.textContent = 'Copied ✓';
      }
      setTimeout(() => (btn.textContent = old), 900);
    });
  });

  // ---------- Nav link styling + active highlighting ----------
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.add(
      'block', 'rounded-xl', 'px-3', 'py-2',
      'text-slate-700', 'hover:bg-slate-100', 'hover:text-slate-900',
      'dark:text-slate-200', 'dark:hover:bg-slate-900', 'dark:hover:text-white'
    );

    const here = location.pathname.split('/').pop();
    const target = (a.getAttribute('href') || '').split('/').pop();
    if (here && target && here === target) {
      a.classList.add(
        'bg-indigo-50','text-indigo-900','font-semibold',
        'dark:bg-indigo-950/40','dark:text-indigo-100'
      );
    }
  });

  // ---------- Simple link styling helper ----------
  document.querySelectorAll('.link').forEach(a => {
    a.classList.add(
      'font-semibold', 'text-indigo-700', 'hover:text-indigo-900',
      'dark:text-indigo-300', 'dark:hover:text-indigo-200'
    );
  });

  // ---------- HTML includes ----------
  document.querySelectorAll('[data-include]').forEach(async el => {
    const file = el.getAttribute('data-include');
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(res.statusText);
      el.innerHTML = await res.text();
    } catch (err) {
      el.innerHTML = `<p class="text-sm text-red-600">Failed to load ${file}</p>`;
    }
  });


})();
