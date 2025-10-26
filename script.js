 // ✅ Cancella ogni versione locale salvata al caricamento
  localStorage.removeItem("database");

let database = [];

fetch("https://giovannibarbarino.github.io/LA-examples.github.io/data/database.json")
  .then(response => response.json())
  .then(data => {
    database = data;
    renderListaOggetti();
    buildTagSuggestions(data);
  })
  .catch(error => {
    console.error("Errore nel caricamento del database:", error);
  });

/*
function salvaDatabase() {
  localStorage.setItem("database", JSON.stringify(database));
}
*/

function cercaOggetti() {
  const inclusi = document.getElementById("tagInput").value.toLowerCase()
    .split(",").map(t => t.trim()).filter(t => t);
  const esclusi = document.getElementById("tagEsclusiInput").value.toLowerCase()
    .split(",").map(t => t.trim()).filter(t => t);

  const risultati = database.filter(obj =>
    inclusi.every(tag => obj.tags.includes(tag)) &&
    esclusi.every(tag => !obj.tags.includes(tag))
  );

  const divRisultati = document.getElementById("risultati");
  divRisultati.innerHTML = risultati.length
    ? risultati.map(obj => `<p><strong>${obj.nome}</strong> - Tags: ${obj.tags.join(", ")}</p>`).join("")
    : "<p>Nessun oggetto trovato.</p>";
}

/*
function salvaOggetto() {
  const id = document.getElementById("editId").value;
  const nome = document.getElementById("nomeInput").value.trim();
  const tags = document.getElementById("tagsInput").value.toLowerCase().split(",").map(t => t.trim()).filter(t => t);

  if (!nome || tags.length === 0) {
    alert("Inserisci un nome e almeno un tag.");
    return;
  }

  if (id) {
    const index = database.findIndex(obj => obj.id == id);
    if (index !== -1) {
      database[index] = { id: parseInt(id), nome, tags };
    }
  } else {
    const newId = Date.now();
    database.push({ id: newId, nome, tags });
  }

  salvaDatabase();
  resetForm();
  renderListaOggetti();
}


function modificaOggetto(id) {
  const obj = database.find(o => o.id === id);
  document.getElementById("editId").value = obj.id;
  document.getElementById("nomeInput").value = obj.nome;
  document.getElementById("tagsInput").value = obj.tags.join(", ");
}

function eliminaOggetto(id) {
  if (confirm("Vuoi eliminare questo oggetto?")) {
    database = database.filter(o => o.id !== id);
    salvaDatabase();
    renderListaOggetti();
  }
}

function resetForm() {
  document.getElementById("editId").value = "";
  document.getElementById("nomeInput").value = "";
  document.getElementById("tagsInput").value = "";
}
*/

function renderListaOggetti() {
  const container = document.getElementById("listaOggetti");
  if (database.length === 0) {
    container.innerHTML = "<p>Nessun oggetto disponibile.</p>";
    return;
  }

  container.innerHTML = database.map(obj => `
    <div class="card">
      <strong>${obj.nome}</strong><br/>
      Proprietà: ${obj.tags.join(", ")}<br/>
    </div>
  `).join("");
}

// Costruisce e popola il <datalist> con tutti i tag unici trovati negli oggetti
function buildTagSuggestions(oggetti) {
  try {
    const set = new Set();
    oggetti.forEach(o => {
      if (Array.isArray(o.tags)) {
        o.tags.forEach(t => set.add(String(t).toLowerCase()));
      }
    });

    const datalist = document.getElementById('tagSuggestions');
    if (!datalist) return;
    const tags = Array.from(set).sort();
    // keep a global list for the custom per-token dropdown
    window.__tagList = tags;
    datalist.innerHTML = tags.map(t => `<option value="${t}">`).join('');
  } catch (e) {
    console.error('Impossibile popolare suggerimenti tag:', e);
  }
}

// Initialize multi-token suggestion dropdown for #tagInput
function initTagInputMultiToken() {
  const input = document.getElementById('tagInput');
  const dropdown = document.getElementById('tagDropdown');
  if (!input || !dropdown) return;

  let selectedIndex = -1;
  let currentMatches = [];

  function hide() {
    dropdown.style.display = 'none';
    selectedIndex = -1;
    currentMatches = [];
  }

  function showMatches(matches, rect) {
    if (!matches || matches.length === 0) { hide(); return; }
    currentMatches = matches.slice(0, 20);
    selectedIndex = -1;
    dropdown.innerHTML = currentMatches.map((m, i) => `<div class="tag-sugg" data-index="${i}" style="padding:6px 8px;cursor:pointer;">${m}</div>`).join('');
    // position
    dropdown.style.left = (rect.left + window.scrollX) + 'px';
    dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
    dropdown.style.width = rect.width + 'px';
    dropdown.style.display = 'block';
  }

  function update() {
    const caret = input.selectionStart || 0;
    const value = input.value || '';
    const before = value.slice(0, caret);
    const lastComma = before.lastIndexOf(',');
    const start = lastComma + 1;
    const tokenRaw = before.slice(start);
    const token = tokenRaw.replace(/^\s+/, '');
    const prefix = token.toLowerCase();
    if (!prefix) { hide(); return; }

    const tags = window.__tagList || [];
    const matches = tags.filter(t => t.indexOf(prefix) !== -1);
    if (matches.length === 0) { hide(); return; }

    const rect = input.getBoundingClientRect();
    showMatches(matches, rect);
  }

  function acceptSuggestion(sugg) {
    const caret = input.selectionStart || 0;
    const value = input.value || '';
    const before = value.slice(0, caret);
    const after = value.slice(caret);
    const lastComma = before.lastIndexOf(',');
    const start = lastComma + 1;
    // find end of token (next comma after caret)
    const nextComma = value.indexOf(',', caret);
    const end = nextComma === -1 ? value.length : nextComma;

    const left = value.slice(0, start);
    const right = value.slice(end);
    // ensure single space after comma if needed
    const insert = sugg;
    let newValue = left + insert;
    // append comma+space if there wasn't one after token
    if (right.length === 0 || right[0] !== ',') newValue += ', ' + right.trimStart();
    else newValue += right;

    input.value = newValue;

    // place caret after inserted suggestion + 2 (for ', ')
    const newPos = left.length + insert.length + 2;
    input.focus();
    input.setSelectionRange(newPos, newPos);
    hide();
  }

  dropdown.addEventListener('mousedown', (ev) => {
    // prevent input blur before click
    ev.preventDefault();
  });

  dropdown.addEventListener('click', (ev) => {
    const target = ev.target.closest('.tag-sugg');
    if (!target) return;
    const idx = Number(target.dataset.index || 0);
    const val = currentMatches[idx];
    if (val) acceptSuggestion(val);
  });

  input.addEventListener('input', () => update());

  input.addEventListener('keydown', (ev) => {
    if (dropdown.style.display === 'none') return;
    const items = dropdown.querySelectorAll('.tag-sugg');
    if (!items || items.length === 0) return;
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      Array.from(items).forEach((it, i) => it.style.background = i === selectedIndex ? '#eef' : '');
      return;
    }
    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      Array.from(items).forEach((it, i) => it.style.background = i === selectedIndex ? '#eef' : '');
      return;
    }
    if (ev.key === 'Enter' || ev.key === 'Tab') {
      if (selectedIndex >= 0 && items[selectedIndex]) {
        ev.preventDefault();
        const val = currentMatches[selectedIndex];
        acceptSuggestion(val);
      }
    }
    if (ev.key === 'Escape') {
      hide();
    }
  });

  // hide on blur (with small delay to allow click)
  input.addEventListener('blur', () => setTimeout(hide, 150));
}

// start the multi-token logic (will use window.__tagList when available)
initTagInputMultiToken();

// Avvia
renderListaOggetti();

let regole = [];

// Carica oggetti
fetch('data/database.json')
  .then(res => res.json())
  .then(data => mostraOggetti(data));

// Carica regole
fetch('data/regole.json')
  .then(res => res.json())
  .then(data => {
    regole = data;
    mostraRegole(data);
  });

// Mostra oggetti
function mostraOggetti(oggetti) {
  const div = document.getElementById("listaOggetti");
  div.innerHTML = oggetti.map(o => `
    <div><strong>${o.nome}</strong>: ${o.tags.join(', ')}</div>
  `).join('');
  // Aggiorna suggerimenti tag anche quando gli oggetti sono caricati qui
  buildTagSuggestions(oggetti);
}

// Mostra regole
function mostraRegole(regole) {
  const div = document.getElementById("listaRegole");
  div.innerHTML = regole.map(r => `
    <div>
      <strong>${r.nome}</strong><br/>
      SE: ${r.se.map(t => t.negato ? "¬" + t.tag : t.tag).join(', ')}<br/>
      ALLORA: ${r.allora.map(t => t.negato ? "¬" + t.tag : t.tag).join(', ')}
    </div>
  `).join('<hr/>');
}

// Ricerca
function cercaOggetti() {
  // Normalizza input a lowercase per confronto case-insensitive
  const inclusi = document.getElementById("tagInput").value
    .split(',').map(t => t.trim().toLowerCase()).filter(t => t);
  const esclusi = document.getElementById("tagEsclusiInput").value
    .split(',').map(t => t.trim().toLowerCase()).filter(t => t);

  // Verifica violazione regole
  const violata = regole.find(regola => {
    return regola.se.every(cond => {
      return (cond.negato ? esclusi.includes(cond.tag) : inclusi.includes(cond.tag));
    }) && regola.allora.some(cond => {
      return (cond.negato ? inclusi.includes(cond.tag) : esclusi.includes(cond.tag));
    });
  });

  const risultatiDiv = document.getElementById("risultati");

  if (violata) {
    risultatiDiv.innerHTML = `
      ❌ <strong>Ricerca non valida</strong>: la combinazione viola la regola <em>${violata.nome}</em>
    `;
    return;
  }

  // Se non viola, carica e filtra oggetti (confronti case-insensitive)
  fetch('data/database.json')
    .then(res => res.json())
    .then(oggetti => {
      const filtrati = oggetti.filter(o => {
        const tagsLower = Array.isArray(o.tags) ? o.tags.map(tt => String(tt).toLowerCase()) : [];
        return inclusi.every(t => tagsLower.includes(t)) &&
               esclusi.every(t => !tagsLower.includes(t));
      });

      risultatiDiv.innerHTML = filtrati.length > 0
        ? filtrati.map(o => `<div><strong>${o.nome}</strong>: ${o.tags.join(', ')}</div>`).join('')
        : '🔍 Nessun oggetto trovato.';
    });
}

