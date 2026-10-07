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

// Premium same-site page transitions
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.body.classList.add('page-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('page-entered')));

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.protocol !== location.protocol) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    event.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => { location.href = url.href; }, 360);
  });

  addEventListener('pageshow', () => document.body.classList.remove('page-leaving'));
})();

// Home photographic hero slider
(() => {
  const hero = document.querySelector('[data-hero-slider]');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  if (slides.length < 2) return;
  let active = 0;
  let timer = null;
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === active);
      dot.setAttribute('aria-current', i === active ? 'true' : 'false');
    });
  };
  const start = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => show(active + 1), 5500);
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    show(i);
    start();
  }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (timer) clearInterval(timer);
    } else {
      start();
    }
  });
  show(0);
  start();
})();

// Subtle scroll depth for supplier marquee and catalog layers
(() => {
  if (window.matchMedia('(max-width: 760px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const provider = document.querySelector('.provider-section');
  const catalog = document.querySelector('.catalog-clean');
  let ticking = false;
  const renderDepth = () => {
    const vh = window.innerHeight || 1;
    if (provider) {
      const r = provider.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, (r.top + r.height * .5 - vh * .5) / vh));
      provider.style.setProperty('--provider-parallax', (p * -105).toFixed(1) + 'px');
    }
    if (catalog) {
      const r = catalog.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, (r.top + r.height * .5 - vh * .5) / vh));
      catalog.style.setProperty('--catalog-copy-parallax', (p * -18).toFixed(1) + 'px');
      catalog.style.setProperty('--catalog-motion-parallax', '0px');
      catalog.style.setProperty('--catalog-image-parallax', (p * 82).toFixed(1) + 'px');
    }
    ticking = false;
  };
  const requestDepth = () => {
    if (!ticking) { requestAnimationFrame(renderDepth); ticking = true; }
  };
  addEventListener('scroll', requestDepth, {passive:true});
  addEventListener('resize', requestDepth);
  renderDepth();
})();
