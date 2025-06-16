const database = [
  { id: 1, nome: "Oggetto A", tags: ["html", "css"] },
  { id: 2, nome: "Oggetto B", tags: ["javascript", "css"] },
  { id: 3, nome: "Oggetto C", tags: ["python", "ai"] },
  { id: 4, nome: "Oggetto D", tags: ["html", "js", "design"] }
];

function cercaOggetti() {
  const input = document.getElementById("tagInput").value.toLowerCase();
  const tagList = input.split(",").map(t => t.trim());

  const risultati = database.filter(obj =>
    tagList.every(tag => obj.tags.includes(tag))
  );

  const divRisultati = document.getElementById("risultati");
  divRisultati.innerHTML = risultati.length
    ? risultati.map(obj => `<p><strong>${obj.nome}</strong> - Tags: ${obj.tags.join(", ")}</p>`).join("")
    : "<p>Nessun oggetto trovato.</p>";
}
