(function () {
  var doc = document.documentElement;
  var fill = document.getElementById('progressFill');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var top = doc.scrollTop || document.body.scrollTop;
    var max = doc.scrollHeight - doc.clientHeight;
    fill.style.width = (max > 0 ? (top / max) * 100 : 0) + '%';
    toTop.classList.toggle('show', top > 600);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Build the table of contents from top-level section headings.
  var container = document.querySelector('.container');
  var links = document.getElementById('tocLinks');
  var entries = [];
  Array.prototype.forEach.call(container.children, function (el) {
    if (el.tagName !== 'H2') return;
    if (!el.id) {
      el.id = el.textContent.trim().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    var a = document.createElement('a');
    a.href = '#' + el.id;
    a.textContent = el.textContent.trim();
    links.appendChild(a);
    entries.push({ head: el, link: a });
  });

  // Highlight the current section while scrolling.
  if ('IntersectionObserver' in window && entries.length) {
    var spy = new IntersectionObserver(function (obs) {
      obs.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entries.forEach(function (m) {
          m.link.classList.toggle('active', m.head === entry.target);
        });
      });
    }, { rootMargin: '0px 0px -75% 0px', threshold: 0 });
    entries.forEach(function (m) { spy.observe(m.head); });
  }
})();
