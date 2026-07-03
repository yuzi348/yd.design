(function () {
  function groupByGenre(works, genres) {
    const grouped = {};
    genres.forEach(function (genre) {
      grouped[genre] = [];
    });

    if (!works || !works.length) {
      return grouped;
    }

    works.forEach(function (item) {
      if (grouped[item.genre] && item.images && item.images.length) {
        grouped[item.genre].push(item);
      }
    });

    return grouped;
  }

  function createFigure(work) {
    const figure = document.createElement('figure');
    figure.className = 'works-column__item works-column__item--clickable';
    figure.dataset.workId = work.id;
    figure.setAttribute('role', 'button');
    figure.setAttribute('tabindex', '0');
    figure.setAttribute('aria-label', work.title);

    const img = document.createElement('img');
    img.src = 'images/' + work.images[0];
    img.alt = '';
    img.loading = 'lazy';
    img.draggable = false;

    figure.appendChild(img);
    return figure;
  }

  function renderColumns(container) {
    if (!container) return;

    const genres = window.WORKS_GENRES || [];
    const works = window.WORKS || [];
    const grouped = groupByGenre(works, genres);

    container.innerHTML = '';

    genres.forEach(function (genre) {
      const column = document.createElement('div');
      column.className = 'works-column';
      column.dataset.genre = genre;

      const title = document.createElement('h2');
      title.className = 'works-column__title';
      title.textContent = genre;

      const list = document.createElement('div');
      list.className = 'works-column__list';

      grouped[genre].forEach(function (work) {
        list.appendChild(createFigure(work));
      });

      const body = document.createElement('div');
      body.className = 'works-column__body';
      body.appendChild(list);

      column.appendChild(body);
      column.appendChild(title);
      container.appendChild(column);
    });
  }

  window.WorksRender = {
    renderColumns: renderColumns
  };
})();
