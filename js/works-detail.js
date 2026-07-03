(function () {
  const modal = document.getElementById('workModal');
  const titleEl = document.getElementById('workModalTitle');
  const imagesEl = document.getElementById('workModalImages');
  const closeBtn = modal && modal.querySelector('.work-modal__close');
  const backdrop = modal && modal.querySelector('.work-modal__backdrop');

  if (!modal || !titleEl || !imagesEl || !closeBtn) return;

  const worksById = {};

  function indexWorks() {
    (window.WORKS || []).forEach(function (work) {
      worksById[work.id] = work;
    });
  }

  indexWorks();

  function renderImages(images) {
    imagesEl.innerHTML = '';
    images.forEach(function (filename) {
      const img = document.createElement('img');
      img.src = 'images/' + filename;
      img.alt = '';
      img.loading = 'lazy';
      imagesEl.appendChild(img);
    });
  }

  function openWork(id) {
    const work = worksById[id];
    if (!work) return;

    titleEl.textContent = work.title;
    renderImages(work.images);

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('work-modal-open');
    closeBtn.focus();
  }

  function closeWork() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('work-modal-open');
    imagesEl.innerHTML = '';
  }

  function onThumbnailActivate(event) {
    const figure = event.target.closest('.works-column__item--clickable');
    if (!figure || !figure.dataset.workId) return;

    event.preventDefault();
    event.stopPropagation();
    openWork(figure.dataset.workId);
  }

  document.addEventListener('click', function (event) {
    if (document.body.classList.contains('work-modal-open')) return;
    onThumbnailActivate(event);
  });

  document.addEventListener('keydown', function (event) {
    const figure = event.target.closest('.works-column__item--clickable');
    if (!figure || !figure.dataset.workId) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    openWork(figure.dataset.workId);
  });

  closeBtn.addEventListener('click', closeWork);

  if (backdrop) {
    backdrop.addEventListener('click', closeWork);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && document.body.classList.contains('work-modal-open')) {
      closeWork();
    }
  });

  window.WorksDetail = {
    open: openWork,
    close: closeWork
  };
})();
