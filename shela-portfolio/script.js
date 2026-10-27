(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const defaultContent = {
    summary: 'A Computer Science and Engineering graduate from Daffodil International University, interested in building useful technology through machine learning, software development, networking, and IoT.',
    roles: ['AI & machine learning', 'software development', 'connected technology']
  };
  let content = { ...defaultContent };
  try { const saved = JSON.parse(localStorage.getItem('shelaPortfolioContent') || 'null'); if (saved) content = { ...content, ...saved }; } catch (_) {}
  const summary = $('.hero-summary');
  const role = $('#typedRole');
  if (summary) summary.textContent = content.summary;
  let roleIndex = 0, charIndex = 0, deleting = false;
  const type = () => {
    if (!role) return;
    const roles = Array.isArray(content.roles) && content.roles.length ? content.roles : defaultContent.roles;
    roleIndex %= roles.length;
    const word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    role.textContent = word.slice(0, charIndex);
    let delay = deleting ? 38 : 75;
    if (!deleting && charIndex === word.length) { deleting = true; delay = 1300; }
    else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 300; }
    window.setTimeout(type, delay);
  };
  type();

  $('#year').textContent = new Date().getFullYear();
  const nav = $('#nav'), menuToggle = $('#menuToggle');
  menuToggle?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); });
  $$('#nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuToggle?.setAttribute('aria-expanded', 'false'); }));
  $('#themeToggle')?.addEventListener('click', () => { document.body.classList.toggle('light'); try { localStorage.setItem('shelaPortfolioTheme', document.body.classList.contains('light') ? 'light' : 'dark'); } catch (_) {} });
  try { if (localStorage.getItem('shelaPortfolioTheme') === 'light') document.body.classList.add('light'); } catch (_) {}

  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: .12 }) : null;
  $$('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('visible'));
  const progress = $('#scrollProgress');
  window.addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`; }, { passive: true });
  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) $$('#nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  $$('.skill-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.skill-tab').forEach(other => { const selected = other === tab; other.classList.toggle('selected', selected); other.setAttribute('aria-selected', String(selected)); });
    const category = tab.dataset.skill;
    $$('.skill-card').forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
  }));

  const panel = $('#editorPanel'), status = $('#editorStatus');
  const openEditor = () => { panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); $('#editIntro').value = content.summary; $('#editRole1').value = content.roles[0] || ''; $('#editRole2').value = content.roles[1] || ''; $('#editRole3').value = content.roles[2] || ''; };
  const closeEditor = () => { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); };
  $('#editToggle')?.addEventListener('click', openEditor);
  $('#closeEditor')?.addEventListener('click', closeEditor);
  $('#saveEdits')?.addEventListener('click', () => {
    const roles = [$('#editRole1').value.trim(), $('#editRole2').value.trim(), $('#editRole3').value.trim()].filter(Boolean);
    content = { summary: $('#editIntro').value.trim() || defaultContent.summary, roles: roles.length ? roles : defaultContent.roles };
    summary.textContent = content.summary;
    roleIndex = 0; charIndex = 0; deleting = false;
    try { localStorage.setItem('shelaPortfolioContent', JSON.stringify(content)); status.textContent = 'Saved in this browser. Export the JSON and update script.js to publish changes for everyone.'; } catch (_) { status.textContent = 'Content updated for this page, but browser storage is unavailable.'; }
  });
  $('#exportEdits')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'shela-portfolio-content.json'; link.click(); URL.revokeObjectURL(url); status.textContent = 'JSON backup downloaded.';
  });
  $('#resetEdits')?.addEventListener('click', () => { content = { ...defaultContent, roles: [...defaultContent.roles] }; try { localStorage.removeItem('shelaPortfolioContent'); } catch (_) {} summary.textContent = content.summary; roleIndex = 0; charIndex = 0; deleting = false; openEditor(); status.textContent = 'Reset to the original portfolio content.'; });
})();
