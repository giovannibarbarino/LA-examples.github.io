 // ✅ Cancella ogni versione locale salvata al caricamento
  localStorage.removeItem("database");

let database = [];

fetch("https://giovannibarbarino.github.io/LA-examples.github.io/data/database.json")
  .then(response => response.json())
  .then(data => {
    database = data;
    renderListaOggetti();
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
  const inclusi = document.getElementById("tagInput").value
    .split(',').map(t => t.trim()).filter(t => t);
  const esclusi = document.getElementById("tagEsclusiInput").value
    .split(',').map(t => t.trim()).filter(t => t);

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

  // Se non viola, carica e filtra oggetti
  fetch('data/database.json')
    .then(res => res.json())
    .then(oggetti => {
      const filtrati = oggetti.filter(o => {
        return inclusi.every(t => o.tags.includes(t)) &&
               esclusi.every(t => !o.tags.includes(t));
      });

      risultatiDiv.innerHTML = filtrati.length > 0
        ? filtrati.map(o => `<div><strong>${o.nome}</strong>: ${o.tags.join(', ')}</div>`).join('')
        : '🔍 Nessun oggetto trovato.';
    });
}

