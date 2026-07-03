(function () {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const tabButtons = document.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('.panel');

  if (!tabButtons.length || !panels.length) return;

  function closeMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'メニューを開く');
  }

  function switchTab(tabName) {
    tabButtons.forEach(function (btn) {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('is-active', isActive);
      if (btn.getAttribute('role') === 'tab') {
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      }
    });

    panels.forEach(function (panel) {
      const isActive = panel.dataset.panel === tabName;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });

    document.body.className = 'tab-' + tabName;
    window.scrollTo(0, 0);
    closeMenu();
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchTab(btn.dataset.tab);
    });
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        navToggle.classList.add('is-active');
        navMenu.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'メニューを閉じる');
      }
    });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) closeMenu();
  });

  function applyHashTab() {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'about' || hash === 'contact' || hash === 'works') {
      switchTab(hash);
    }
  }

  window.addEventListener('hashchange', applyHashTab);
  applyHashTab();
})();

(function () {
  const columnsEl = document.getElementById('worksColumns');
  if (!columnsEl || !window.WorksRender) return;

  WorksRender.renderColumns(columnsEl);
  initColumnScroll(columnsEl);
})();

function initColumnScroll(container) {
  container.querySelectorAll('.works-column').forEach(setupColumn);
}

function setupColumn(column) {
  const body = column.querySelector('.works-column__body');
  const list = column.querySelector('.works-column__list');
  if (!body || !list) return;

  let currentY = 0;
  let maxScroll = 0;
  let touchStartY = 0;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function applyTransform() {
    list.style.transform = 'translateY(' + (-currentY) + 'px)';
  }

  function getViewportHeight() {
    return column.clientHeight;
  }

  function measure() {
    maxScroll = Math.max(0, list.scrollHeight - getViewportHeight());
    currentY = clamp(currentY, 0, maxScroll);
    applyTransform();
  }

  function tryMeasure(attempts) {
    measure();
    if (maxScroll <= 0 && attempts < 12) {
      requestAnimationFrame(function () {
        tryMeasure(attempts + 1);
      });
    }
  }

  function onWheel(e) {
    if (!document.body.classList.contains('tab-works')) return;
    if (document.body.classList.contains('work-modal-open')) return;

    if (maxScroll <= 0) {
      measure();
      if (maxScroll <= 0) return;
    }

    const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    currentY = clamp(currentY + delta, 0, maxScroll);
    applyTransform();
    e.preventDefault();
    e.stopPropagation();
  }

  function onTouchStart(e) {
    if (!e.touches.length) return;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    if (!document.body.classList.contains('tab-works') || !e.touches.length) return;
    if (document.body.classList.contains('work-modal-open')) return;

    if (maxScroll <= 0) measure();
    if (maxScroll <= 0) return;

    const touchY = e.touches[0].clientY;
    currentY = clamp(currentY + (touchStartY - touchY), 0, maxScroll);
    touchStartY = touchY;
    applyTransform();
    e.preventDefault();
  }

  column.addEventListener('wheel', onWheel, { passive: false });
  column.addEventListener('touchstart', onTouchStart, { passive: true });
  column.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('resize', measure);

  const images = list.querySelectorAll('img');
  if (!images.length) {
    tryMeasure(0);
    return;
  }

  let loaded = 0;
  const total = images.length;

  function onImageReady() {
    loaded++;
    if (loaded >= total) tryMeasure(0);
  }

  images.forEach(function (img) {
    if (img.complete) {
      onImageReady();
    } else {
      img.addEventListener('load', onImageReady);
      img.addEventListener('error', onImageReady);
    }
  });
}
