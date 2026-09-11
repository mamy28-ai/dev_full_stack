const ENSEIGNANTS_API_URL = "http://localhost:3000/api/enseignants";
const NOTE_API_URL = "http://localhost:3000/api/note";
const MATIERE_API_URL = "https://localhost:3000/api/matiere";

function switchTab(tabId, event) {
    if (event) event.preventDefault();

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.display = 'block';
    }

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}
function chargerNotesSauvegardees() {
  const tbody = document.querySelector('#tableauResultats tbody');
  if (!tbody) return;

  const notesStockees = JSON.parse(localStorage.getItem('notes_enregistrees') || '[]');
  
  tbody.innerHTML = '';
  notesStockees.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.idEleve}</td>
      <td>${item.noteValue} / 20</td>
      <td>${item.appreciation}</td>
      <td><button onclick="supprimerNoteIndex(${index})">Supprimer</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function supprimerNoteIndex(index) {
  const notesStockees = JSON.parse(localStorage.getItem('notes_enregistrees') || '[]');
  notesStockees.splice(index, 1);
  localStorage.setItem('notes_enregistrees', JSON.stringify(notesStockees));
  chargerNotesSauvegardees();
}

async function enregistrerNote(buttonElement) {
  const row = buttonElement.closest('tr');
  
  const idEleveInput = row.querySelector('.input-id-eleve').value;
  const idEleve = parseInt(idEleveInput, 10);
  
  const noteValue = parseFloat(row.querySelector('.input-note').value);

  const selectMatiere = document.getElementById('notes-matiere');
  const idMatiere = parseInt(selectMatiere.value, 10);

  const inputAppreciation = row.querySelector('.input-appreciation');
  const appreciation = inputAppreciation ? inputAppreciation.value : '';

  if (isNaN(idMatiere)) {
    alert("Veuillez sélectionner une matière valide.");
    return;
  }

  if (isNaN(idEleve)) {
    alert("Veuillez saisir un ID d'élève valide.");
    return;
  }

  if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
    alert("Veuillez saisir une note valide entre 0 et 20.");
    return;
  }

  buttonElement.disabled = true;

  try {
    const response = await fetch("http://localhost:3000/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_eleve: idEleve,
        id_matiere: idMatiere,
        note: noteValue,
        appreciation: appreciation,
        date_note: new Date().toISOString().split('T')[0]
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert("Note enregistrée avec succès !");

      // SAUVEGARDE LOCALE DANS LE NAVIGATEUR (persistance F5)
      const nouvelleNote = { idEleve, noteValue, appreciation };
      const notesStockees = JSON.parse(localStorage.getItem('notes_enregistrees') || '[]');
      notesStockees.push(nouvelleNote);
      localStorage.setItem('notes_enregistrees', JSON.stringify(notesStockees));

      chargerNotesSauvegardees();

      row.querySelector('.input-note').value = "";
      if (inputAppreciation) inputAppreciation.value = "";
      
    } else {
      alert(`Erreur : ${result.error || "Problème d'enregistrement"}`);
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Impossible de contacter le serveur.");
  } finally {
    buttonElement.disabled = false;
  }
}


function envoyerNote(idMatiere, note) {
  if (note === '' || note === null || note === undefined) return;

  localStorage.removeItem(idMatiere);

  localStorage.setItem(idMatiere, note);
}