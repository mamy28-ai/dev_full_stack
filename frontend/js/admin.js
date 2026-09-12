function afficher(page) {
    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");
}

const classe= document.getElementById("totalClasses");

async function afficherTotalClasses() {
    try {
        const response = await fetch("http://localhost:3000/api/classes");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des classes");
        }
        const data = await response.json();
        classe.textContent = data.length;

    } catch (error) {
        console.error("Erreur :", error);
    }
}

afficherTotalClasses();

const prof= document.getElementById("totalProf");

async function afficherTotalprofs() {
    try {
        const response = await fetch("http://localhost:3000/api/profs");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des professeurs");
        }
        const data = await response.json();
        console.log(data);
        prof.textContent = data.length;
    } catch (error) {
        console.error("Erreur :", error);
    }
}

afficherTotalprofs();

const sup = document.getElementById("sup");
const inf = document.getElementById("inf");

async function afficherStatistiquesNotes() {
    try {
        const response = await fetch(
            "http://localhost:3000/api/note"
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des notes");
        }
        const notes = await response.json();
        console.log(notes);
        const notesInf = notes.filter(note => note.note < 10);
        const notesSup = notes.filter(note => note.note >= 10);
        inf.textContent = notesInf.length;
        sup.textContent = notesSup.length;
    } catch (error) {
        console.error("Erreur :", error);
    }
}

afficherStatistiquesNotes();

let graphiqueNotes = null;
let toutesLesNotes = [];

async function chargerNotesParMatiere() {
    const select = document.getElementById("choixMatiere");

    try {
        const response = await fetch("http://localhost:3000/api/note");

        if (!response.ok) {
            throw new Error(`Erreur ${response.status} : impossible de récupérer les notes`);
        }

        const notes = await response.json();

        if (!Array.isArray(notes)) {
            throw new Error("Format de réponse inattendu (tableau attendu)");
        }

        toutesLesNotes = notes;
        console.log("Notes :", notes);
        const matieres = [...new Set(notes.map(note => note.matiere))].sort();
        select.innerHTML = '<option value="">Choisir une matière</option>';

        matieres.forEach(matiere => {
            const option = document.createElement("option");
            option.value = matiere;
            option.textContent = matiere;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur :", error);
        select.innerHTML = '<option value="">Erreur de chargement des notes</option>';
    }
}

function afficherGraphique(notes, matiereChoisie) {
    const canvas = document.getElementById("graphNotes");

    if (!matiereChoisie) {
        if (graphiqueNotes) {
            graphiqueNotes.destroy();
            graphiqueNotes = null;
        }
        return;
    }

    // Garder seulement les notes de la matière choisie, triées par note décroissante
    const notesMatiere = notes
        .filter(note => note.matiere === matiereChoisie)
        .sort((a, b) => Number(b.note) - Number(a.note));

    const labels = notesMatiere.map(note => `${note.nom} ${note.prenom}`);
    const valeurs = notesMatiere.map(note => Number(note.note));

    if (graphiqueNotes) {
        graphiqueNotes.destroy();
    }

    graphiqueNotes = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: `Notes en ${matiereChoisie}`,
                data: valeurs,
                backgroundColor: "#6C63FF",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20,
                    title: { display: true, text: "Note /20" }
                }
            }
        }
    });
}


document.getElementById("choixMatiere").addEventListener("change", function () {
    afficherGraphique(toutesLesNotes, this.value);
});


chargerNotesParMatiere();

const attente= document.getElementById("totalAttente");

async function afficherTotalAttente() {
    try {
        const response = await fetch("http://localhost:3000/api/user/attente");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des classes");
        }
        const data = await response.json();
        attente.textContent = data.length;

    } catch (error) {
        console.error("Erreur :", error);
    }
}

afficherTotalAttente();


async function chargerUser() {

    try {

        const response = await fetch("http://localhost:3000/api/user/attente");

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const user = await response.json();

        console.log("Professeurs reçus :", user);

        const liste = document.getElementById("listeComptes");

        if (!liste) {
            throw new Error("L'élément #listeProfs n'existe pas dans le HTML");
        }

        liste.innerHTML = "";

        user.forEach(utilisateurs => {

            liste.innerHTML += `
                <tr>
                    <td>${utilisateurs.nom}</td>
                    <td>${utilisateurs.prenom}</td>
                    <td>${utilisateurs.email}</td>
                    <td>${utilisateurs.role}</td>
                    <td>${utilisateurs.date_creation}</td>
                    <td>${utilisateurs.actif}</td>
                    <td><button onclick="valide(${utilisateurs.id_utilisateur})" id="valid"><i class="fa-solid fa-check"></i></button>
                    <td><button onclick="supprimerUser(${utilisateurs.id_utilisateur})"><i class="fa-solid fa-trash"></i></i></button>
                </tr>
            `;

        });

    } catch (error) {

        console.error("Erreur :", error);

    }
}
chargerUser();
async function supprimerUser(id) {

    const confirmation= confirm(
        "Voulez-vous vraiment supprimer ce compte ?"
    );

    if(!confirmation){
        return;
    }
    
    try{
        const response= await fetch(`http://localhost:3000/api/user/${id}`,
            {
                method: "DELETE"

            }
        );

        const data= await response.json();
        if(response.ok){
            alert("le compte est supprimer");
            chargerUser();
        }else {

            alert("Erreur : " + (data.error || data.message));

        }

    }catch(error){
        console.error("Erreur :", error);

        alert("Impossible de contacter le serveur.");   
    }
}

chargerUser();

async function valide(id) {
    try{
        const response = await fetch(
            `http://localhost:3000/api/user/valide/${id}`,
            {method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const data = await response.json();

        if (response.ok) {

            alert(data.message);

            afficherTotalAttente();
            chargerUser();

        } else {

            alert(data.message || "Erreur lors de la validation");

        }

    } catch (error) {

        console.error(error);

        alert("Impossible de contacter le serveur");

    }
}

afficherTotalAttente();


