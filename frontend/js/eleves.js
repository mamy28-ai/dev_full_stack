const NOTE_API_URL = "http://localhost:3000/api/note";

const listeMatieres = [
  'note-maths',
  'note-angl',
  'note-hg',
  'note-pc',
  'note-svt',
  'note-frnc',
  'note-all',
  'note-philo',
  'note-eps'
];

function afficherNoteEnvoyee(idMatiere, note) {
  const badge = document.getElementById(idMatiere);
  
  if (badge) {
    if (note !== null && note !== undefined) {
      badge.textContent = `${note} / 20`;
      badge.classList.remove('badge-empty');
      badge.classList.add('badge-success');
    } else {
      badge.textContent = 'Non noté';
      badge.classList.remove('badge-success');
      badge.classList.add('badge-empty');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  listeMatieres.forEach(id => {
    const noteEnregistree = localStorage.getItem(id);
    if (noteEnregistree !== null) {
      afficherNoteEnvoyee(id, noteEnregistree);
    }
  });
});

window.addEventListener('storage', (event) => {
  if (listeMatieres.includes(event.key)) {
    afficherNoteEnvoyee(event.key, event.newValue);
  }
});