const API_URL = 'https://rickandmortyapi.com/api/character';

const elements = {
  form: document.getElementById('searchForm'),
  nameInput: document.getElementById('nameInput'),
  statusSelect: document.getElementById('statusSelect'),
  genderSelect: document.getElementById('genderSelect'),
  clearBtn: document.getElementById('clearBtn'),
  randomBtn: document.getElementById('randomBtn'),
  grid: document.getElementById('charactersGrid'),
  feedback: document.getElementById('feedback'),
  requestBadge: document.getElementById('requestBadge'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  pageInfo: document.getElementById('pageInfo'),
  dialog: document.getElementById('characterDialog'),
  dialogContent: document.getElementById('dialogContent'),
  closeDialog: document.getElementById('closeDialog'),
  metricCharacters: document.getElementById('metricCharacters')
};

const state = {
  page: 1,
  pages: 1,
  total: 0
};

function buildUrl(page = 1) {
  const params = new URLSearchParams();
  params.set('page', page);

  const name = elements.nameInput.value.trim();
  const status = elements.statusSelect.value;
  const gender = elements.genderSelect.value;

  if (name) params.set('name', name);
  if (status) params.set('status', status);
  if (gender) params.set('gender', gender);

  return `${API_URL}?${params.toString()}`;
}

function setRequestStatus(type, text) {
  elements.requestBadge.className = `request-badge ${type || ''}`.trim();
  elements.requestBadge.textContent = text;
}

function showSkeletons() {
  elements.grid.innerHTML = Array.from({ length: 8 }, () => '<div class="skeleton"></div>').join('');
}

function getStatusClass(status) {
  if (status === 'Alive') return 'status-alive';
  if (status === 'Dead') return 'status-dead';
  return 'status-unknown';
}

function translateStatus(status) {
  return { Alive: 'Vivo', Dead: 'Muerto', unknown: 'Desconocido' }[status] || status;
}

function translateGender(gender) {
  return { Female: 'Femenino', Male: 'Masculino', Genderless: 'Sin género', unknown: 'Desconocido' }[gender] || gender;
}

function createCharacterCard(character) {
  return `
    <article class="character-card">
      <div class="character-image-wrap">
        <img class="character-image" src="${character.image}" alt="${character.name}" loading="lazy">
        <span class="status-pill ${getStatusClass(character.status)}">${translateStatus(character.status)}</span>
      </div>
      <div class="character-body">
        <h3>${character.name}</h3>
        <p class="character-meta">${character.species} · ${translateGender(character.gender)}</p>
        <p class="character-location">Última ubicación: <strong>${character.location.name}</strong></p>
        <button class="card-action" data-character-id="${character.id}" type="button">Ver detalles</button>
      </div>
    </article>
  `;
}

function renderCharacters(characters) {
  elements.grid.innerHTML = characters.map(createCharacterCard).join('');

  document.querySelectorAll('[data-character-id]').forEach(button => {
    button.addEventListener('click', () => loadCharacterDetail(button.dataset.characterId));
  });
}

function updatePagination(info) {
  state.pages = info.pages;
  state.total = info.count;
  elements.pageInfo.textContent = `Página ${state.page} de ${state.pages}`;
  elements.prevBtn.disabled = state.page <= 1;
  elements.nextBtn.disabled = state.page >= state.pages;
  elements.feedback.textContent = `${state.total} resultado(s) encontrado(s).`;
}

// Implementación principal con async / await.
async function loadCharacters(page = 1) {
  state.page = page;
  const url = buildUrl(page);
  const start = performance.now();

  showSkeletons();
  setRequestStatus('loading', 'Consultando API...');
  elements.feedback.textContent = 'Cargando información desde el servicio web...';

  try {
    const response = await fetch(url);
    const elapsed = Math.round(performance.now() - start);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No se encontraron personajes con esos filtros.');
      }
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    renderCharacters(data.results);
    updatePagination(data.info);
    setRequestStatus('success', `200 OK · ${elapsed} ms`);
  } catch (error) {
    elements.grid.innerHTML = '';
    elements.feedback.textContent = error.message;
    elements.pageInfo.textContent = 'Sin resultados';
    elements.prevBtn.disabled = true;
    elements.nextBtn.disabled = true;
    setRequestStatus('error', 'Error en la consulta');
  }
}

// Segunda demostración de fetch usando Promesas (.then / .catch),
// igual que los mecanismos vistos en la guía del docente.
function loadRandomCharacterWithPromises() {
  const randomId = Math.floor(Math.random() * 826) + 1;
  setRequestStatus('loading', 'Buscando personaje aleatorio...');

  fetch(`${API_URL}/${randomId}`)
    .then(response => {
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
      return response.json();
    })
    .then(character => {
      renderCharacterDialog(character);
      setRequestStatus('success', 'Petición con Promesas completada');
    })
    .catch(error => {
      setRequestStatus('error', error.message);
    });
}

async function loadCharacterDetail(id) {
  setRequestStatus('loading', 'Cargando detalle...');

  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    const character = await response.json();
    renderCharacterDialog(character);
    setRequestStatus('success', 'Detalle cargado');
  } catch (error) {
    setRequestStatus('error', error.message);
  }
}

function renderCharacterDialog(character) {
  elements.dialogContent.innerHTML = `
    <div class="dialog-layout">
      <img src="${character.image}" alt="${character.name}">
      <div class="dialog-info">
        <span class="eyebrow">PERSONAJE #${character.id}</span>
        <h2>${character.name}</h2>
        <p>${character.species}${character.type ? ` · ${character.type}` : ''}</p>
        <div class="dialog-stats">
          <div class="dialog-stat"><span>Estado</span><strong>${translateStatus(character.status)}</strong></div>
          <div class="dialog-stat"><span>Género</span><strong>${translateGender(character.gender)}</strong></div>
          <div class="dialog-stat"><span>Origen</span><strong>${character.origin.name}</strong></div>
          <div class="dialog-stat"><span>Ubicación</span><strong>${character.location.name}</strong></div>
          <div class="dialog-stat"><span>Apariciones</span><strong>${character.episode.length} episodio(s)</strong></div>
          <div class="dialog-stat"><span>ID API</span><strong>${character.id}</strong></div>
        </div>
      </div>
    </div>
  `;
  elements.dialog.showModal();
}

function resetFilters() {
  elements.form.reset();
  loadCharacters(1);
}

elements.form.addEventListener('submit', event => {
  event.preventDefault();
  loadCharacters(1);
});

elements.clearBtn.addEventListener('click', resetFilters);
elements.randomBtn.addEventListener('click', loadRandomCharacterWithPromises);
elements.prevBtn.addEventListener('click', () => loadCharacters(state.page - 1));
elements.nextBtn.addEventListener('click', () => loadCharacters(state.page + 1));
elements.closeDialog.addEventListener('click', () => elements.dialog.close());

elements.dialog.addEventListener('click', event => {
  const rect = elements.dialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) elements.dialog.close();
});

loadCharacters();
