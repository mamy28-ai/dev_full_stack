// ===== parents.js =====
// Ce fichier est fait pour la page "Espace Parent" qui est un document
// HTML autonome (parents.html), séparé de index.html.
// -> pas de #parents, pas de #sidebar, pas de afficher() ici : tout ça
//    n'existe pas dans ce document.

document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------------------------
    // 1. Bouton "Déconnexion" (pas d'id, on cible par la classe)
    // ---------------------------------------------------
    const btnDeconnexion = document.querySelector(".btn-deconnexion");
    if (btnDeconnexion) {
        btnDeconnexion.addEventListener("click", () => {
            // adapte le chemin selon l'emplacement réel de login.html
            window.location.href = "login.html";
        });
    } else {
        console.warn("parents.js : bouton .btn-deconnexion introuvable.");
    }

    // ---------------------------------------------------
    // 2. Charger les vraies données depuis le backend parent
    // ---------------------------------------------------
    chargerDonneesParent();
});


const API_PARENT = "http://localhost:3001/api/parent";
const idParentConnecte = 1; // TODO : remplacer par l'id du parent réellement connecté


// Remplit une section .tab-content en gardant son <h2> existant
function remplirSection(idSection, htmlContenu) {
    const conteneur = document.getElementById(idSection);
    if (!conteneur) return;

    const titre = conteneur.querySelector("h2");
    conteneur.innerHTML = "";
    if (titre) conteneur.appendChild(titre);

    const bloc = document.createElement("div");
    bloc.innerHTML = htmlContenu;
    conteneur.appendChild(bloc);
}


function chargerDonneesParent() {

    fetch(`${API_PARENT}/${idParentConnecte}/enfants`)
        .then(r => r.json())
        .then(enfants => {
            if (!enfants.length) {
                remplirSection("notes", "<p>Aucun enfant trouvé.</p>");
                return;
            }

            const idEleve = enfants[0].id_eleve;

            fetch(`${API_PARENT}/enfants/${idEleve}/notes`)
                .then(r => r.json())
                .then(notes => {
                    const html = notes
                        .map(n => `<p>${n.nom_matiere} : ${n.note}/20 (${n.date_note})</p>`)
                        .join("") || "<p>Aucune note.</p>";
                    remplirSection("notes", html);
                });

            fetch(`${API_PARENT}/enfants/${idEleve}/absences`)
                .then(r => r.json())
                .then(absences => {
                    const html = absences
                        .map(a => `<p>${a.date_absence} - ${a.motif || ""} (${a.justifiee ? "justifiée" : "non justifiée"})</p>`)
                        .join("") || "<p>Aucune absence.</p>";
                    remplirSection("absences", html);
                });

            fetch(`${API_PARENT}/enfants/${idEleve}/paiements`)
                .then(r => r.json())
                .then(paiements => {
                    const html = paiements
                        .map(p => `<p>${p.libelle} : ${p.montant} (${p.statut})</p>`)
                        .join("") || "<p>Aucun paiement.</p>";
                    remplirSection("paiements", html);
                });
        })
        .catch(err => {
            console.error("Erreur chargement enfants :", err);
        });

    fetch(`${API_PARENT}/${idParentConnecte}/messages`)
        .then(r => r.json())
        .then(messages => {
            const html = messages
                .map(m => `<p><strong>${m.sujet}</strong> - ${m.contenu} (de ${m.prenom_expediteur} ${m.nom_expediteur})</p>`)
                .join("") || "<p>Aucun message.</p>";
            remplirSection("messages", html);
        })
        .catch(err => {
            console.error("Erreur chargement messages :", err);
        });
}