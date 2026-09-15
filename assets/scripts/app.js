const ROOT = document.documentElement.dataset.root || '';

const nav = [
  ['INICIO', '/'],
  ['NOSOTROS', '/nosotros/'],
  ['PRODUCTOS', '/productos/'],
  ['CATÁLOGO', '/catalogo/'],
  ['CONTACTO', '/contacto/']
];

const resolve = (path) => `${ROOT}${path.replace(/^\//, '')}`;
const current = window.location.pathname;

const header = document.querySelector('[data-site-header]');
if (header) {
  header.innerHTML = `
    <header class="site-header" data-header>
      <a class="brand" href="${resolve('index.html')}" aria-label="AINSA, inicio">
        <img src="${resolve('assets/logos/ainsa-blanco.png')}" alt="AINSA — Abastecedora Industrial Naher">
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu">
        <span></span><span></span><span></span><span class="sr-only">Abrir menú</span>
      </button>
      <nav id="site-menu" class="site-nav" aria-label="Navegación principal">
        ${nav.map(([label, path]) => `<a href="${resolve(path)}" ${current === path || (path !== '/' && current.startsWith(path)) ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
        <a class="nav-quote" href="https://wa.me/528114982892?text=Hola%20AINSA%2C%20quisiera%20solicitar%20una%20cotizaci%C3%B3n." target="_blank" rel="noopener">COTIZAR</a>
      </nav>
    </header>`;
}

const footer = document.querySelector('[data-site-footer]');
if (footer) {
  footer.innerHTML = `
    <footer class="site-footer">
      <div class="footer-grid shell">
        <div class="footer-brand">
          <img src="${resolve('assets/logos/ainsa-blanco.png')}" alt="AINSA">
          <p>Materiales que impulsan grandes ideas.</p>
        </div>
        <div><h2>Navegación</h2><a href="${resolve('index.html')}">Inicio</a><a href="${resolve('nosotros/')}">Nosotros</a><a href="${resolve('productos/')}">Productos</a><a href="${resolve('catalogo/')}">Catálogo</a></div>
        <div><h2>Contacto</h2><a href="tel:+528111687679">Oficina: 81 1168 7679</a><a href="https://wa.me/528114982892" target="_blank" rel="noopener">WhatsApp: 81 1498 2892</a><a href="mailto:contacto@ainsa-mx.com">contacto@ainsa-mx.com</a></div>
        <div><h2>Dirección</h2><a href="https://maps.app.goo.gl/PdrwyqY3MYTCWKSQ9" target="_blank" rel="noopener">Altamisa No. 1001, Bodega 11<br>Barrio Estrella Norte y Sur<br>Monterrey, N.L. C.P. 64102</a></div>
      </div>
      <div class="footer-base shell"><span>© <span data-year></span> AINSA. Todos los derechos reservados.</span><span>Abastecedora Industrial Naher, S.A. de C.V.</span></div>
    </footer>`;
}

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

document.body.insertAdjacentHTML('beforeend', `<a class="mobile-quote" href="https://wa.me/528114982892?text=Hola%20AINSA%2C%20necesito%20cotizar%20material." target="_blank" rel="noopener" aria-label="Cotizar material por WhatsApp">Cotizar por WhatsApp</a>`);

const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menu.setAttribute('aria-expanded', String(open));
});

window.addEventListener('scroll', () => document.querySelector('[data-header]')?.classList.toggle('scrolled', scrollY > 24), {passive:true});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
}), {threshold: .12});
document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const layers = document.querySelectorAll('[data-parallax]');
  const planes = document.querySelectorAll('[data-parallax-plane]');
  let ticking = false;
  const update = () => {
    layers.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) el.style.transform = `translate3d(0, ${Math.round(rect.top * -.045)}px, 0) scale(1.06)`;
    });
    planes.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) el.style.transform = `translate3d(0, ${Math.round(rect.top * -.018)}px, 0)`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, {passive:true});
}

const search = document.querySelector('[data-product-search]');
const filterButtons = document.querySelectorAll('[data-filter]');
let activeFilter = 'todos';
const applyProductFilter = () => {
  const term = (search?.value || '').toLowerCase().trim();
  document.querySelectorAll('[data-product]').forEach(card => {
    const matchesText = card.textContent.toLowerCase().includes(term);
    const matchesFilter = activeFilter === 'todos' || card.dataset.category === activeFilter;
    card.hidden = !(matchesText && matchesFilter);
  });
};
search?.addEventListener('input', applyProductFilter);
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  applyProductFilter();
}));