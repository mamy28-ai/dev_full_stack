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
            "http://localhost:3000/api/notes"
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

async function chargerGraphiqueNotes() {

    try {
        const response = await fetch(
            "http://localhost:3000/api/notes"
        );

        const notes = await response.json();

        console.log(notes);

        const labels = notes.map(note => note.nom);
        const valeurs = notes.map(note => note.note);

        new Chart(document.getElementById("graphNotes"), {

            type: "bar",

            data: {
                labels: labels,

                datasets: [{
                    label: "Notes des élèves",
                    data: valeurs,
                    borderWidth: 1
                }]
            },

            options: {
                responsive: true,

                scales: {
                    y: {
                        beginAtZero: true,
                        max: 20
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erreur :", error);
    }
}

chargerGraphiqueNotes();