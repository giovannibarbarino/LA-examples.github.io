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


function salvaDatabase() {
  localStorage.setItem("database", JSON.stringify(database));
}

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

function renderListaOggetti() {
  const container = document.getElementById("listaOggetti");
  if (database.length === 0) {
    container.innerHTML = "<p>Nessun oggetto disponibile.</p>";
    return;
  }

  container.innerHTML = database.map(obj => `
    <div class="card">
      <strong>${obj.nome}</strong><br/>
      Tags: ${obj.tags.join(", ")}<br/>
      <button onclick="modificaOggetto(${obj.id})">✏️ Modifica</button>
      <button onclick="eliminaOggetto(${obj.id})">❌ Elimina</button>
    </div>
  `).join("");
}

// Avvia
renderListaOggetti();
