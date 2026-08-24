function afficher(page) {
    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");
}


document.getElementById("formProf").addEventListener("submit", async function(event) {

    event.preventDefault();

    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const matiere = document.getElementById("matiere").value;

    try {

        const response = await fetch("http://localhost:3000/api/profs", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                Nom: nom,
                prénom: prenom,
                matière: matiere
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert("Professeur ajouté avec succès !");

            document.getElementById("formProf").reset();

            // Actualiser la liste
            chargerProfs();

        } else {

            alert("Erreur : " + (data.message || data.error));

        }

    } catch (error) {

        console.error("Erreur :", error);
        alert("Impossible de contacter le serveur.");

    }
});


async function chargerProfs() {

    try {

        const response = await fetch("http://localhost:3000/api/profs");

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const profs = await response.json();

        console.log("Professeurs reçus :", profs);

        const liste = document.getElementById("listeProfs");

        if (!liste) {
            throw new Error("L'élément #listeProfs n'existe pas dans le HTML");
        }

        liste.innerHTML = "";

        profs.forEach(prof => {

            liste.innerHTML += `
                <tr>
                    <td>${prof.id_prof}</td>
                    <td>${prof.nom}</td>
                    <td>${prof.prénom}</td>
                    <td>${prof.matière}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error("Erreur :", error);

    }
}


chargerProfs();