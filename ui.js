// Pestañas y carrusel. Sin JS, las secciones se ven completas una bajo otra.
document.querySelectorAll('.pestanas').forEach((grupo, g) => {
  const paneles = [...grupo.querySelectorAll(':scope > [data-tab]')];
  const barra = document.createElement('div');
  barra.className = 'barra-tabs';
  barra.setAttribute('role', 'tablist');
  barra.setAttribute('aria-label', grupo.dataset.nombre);
  const botones = paneles.map((panel, i) => {
    const b = barra.appendChild(document.createElement('button'));
    b.type = 'button';
    b.textContent = panel.dataset.tab;
    b.id = `tab-${g}-${i}`;
    panel.id = `panel-${g}-${i}`;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', b.id);
    panel.tabIndex = 0;
    b.addEventListener('click', () => abrir(i));
    return b;
  });
  const abrir = n => botones.forEach((b, i) => {
    b.setAttribute('aria-selected', i === n);
    b.tabIndex = i === n ? 0 : -1;
    paneles[i].hidden = i !== n;
  });
  barra.addEventListener('keydown', e => {
    const paso = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (!paso) return;
    const n = (botones.indexOf(e.target) + paso + botones.length) % botones.length;
    abrir(n);
    botones[n].focus();
  });
  grupo.prepend(barra);
  grupo.classList.add('con-tabs');
  abrir(0);
});

const carrusel = document.querySelector('.videos');
document.querySelectorAll('.flecha').forEach(f => {
  f.hidden = false;
  f.addEventListener('click', () => {
    const paso = carrusel.querySelector('figure').offsetWidth + parseFloat(getComputedStyle(carrusel).columnGap);
    carrusel.scrollBy({ left: paso * f.dataset.dir });
  });
});
carrusel.style.scrollBehavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

// Menú móvil: se cierra al elegir una sección
const menu = document.getElementById('menu');
menu?.addEventListener('click', e => { if (e.target.closest('a') && menu.matches(':popover-open')) menu.hidePopover(); });
