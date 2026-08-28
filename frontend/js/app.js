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
                    <td>
                        <button onclick="supprimerProf(${prof.id_prof})" id="sup">
                        <i class="fa-solid fa-trash"></i>
                        </button>
                        <button onclick="editProf(${prof.id_prof})" id="edit">
                        <i class="fa-solid fa-pen"></i>
                        </button>
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error("Erreur :", error);

    }
}


chargerProfs();

async function supprimerProf(id) {

    const confirmation = confirm(
        "Voulez-vous vraiment supprimer ce professeur ?"
    );

    if (!confirmation) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/profs/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Professeur supprimé avec succès !");


            chargerProfs();

        } else {

            alert("Erreur : " + (data.error || data.message));

        }

    } catch (error) {

        console.error("Erreur :", error);

        alert("Impossible de contacter le serveur.");
    }
}

 function editProf(id) {
  
        const confirmation = confirm(
            "Voulez-vous vraiment modifier ce professeur ?"
        );

        if (!confirmation) {
            return;
        }

        const modif= document.getElementById("modif");



        modif.innerHTML=`
            <div id="modifier">
                <form id="fromModif">
                    <input type="text" id="anarana" placeholder="Nom de l'élève " required>
                    <input type="text" id="fanampiny" placeholder="Prénom"required>
                    <input type="text" id="atao" placeholder="Matière"required>
                    <button type="submit" onclick="valide"> Enregistre</button>
                    <button type="button" id="btn"> Annuler</button>
                </form>
            </div>
        `;

   
    
    document.getElementById("btn").addEventListener("click", function(){
        window.location.href="index.html";
    });

        document.getElementById("fromModif").addEventListener("submit", async function (event) {
            event.preventDefault();
            valide(id);

       });

    }
    
     async function valide(id){
        const nom = document.getElementById("anarana").value;
        const prenom = document.getElementById("fanampiny").value;
        const matiere = document.getElementById("atao").value;

    try{
        const response = await fetch(`http://localhost:3000/api/profs/${id}`,
           { 
            method: "PUT",
            
            headers: {
            "Content-Type": "application/json"
            },

        body: JSON.stringify({
            Nom: nom,
            prénom: prenom,
            matière: matiere
            })

           }
        );
        if(!response.ok){
            throw new error("erreur http:", + response.status);
        }
        const data = response.json();

        console.log(data);

       
         window.location.href ="index.html"

    }catch(error){
        console.error("Erreur:", error);

        alert("Impossible de modifier le professeur.");
    }


}

//CLASSE

document.getElementById("formClasse").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nomClasse = document.getElementById("nomClasse").value;
    const niveau = document.getElementById("niveau").value;
    const nbr = document.getElementById("nbr").value;

    try {

        const response = await fetch("http://localhost:3000/api/classes", {
            method : "POST",

            headers : {
                "content-type": "application/json"
            },

            body : JSON.stringify({

                    nom_classe : nomClasse,
                    niveau : niveau,
                    nbr_eleve : nbr
                })
            });

            const data = await response.json();

        if (response.ok) {

            alert("classe ajouté avec succès !");

            document.getElementById("formClasse").reset();

            chargerClasse();
        }else{
            alert: ("erreur :" + (data.message || data.error));
        }

    } catch (error){
        console.error ("erreur :" ,error);
        alert ("impossible de contacter le serveur");
    }

});


    async function chargerClasse() {
         try {

        const response = await fetch("http://localhost:3000/api/classes");

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const classes = await response.json();

        console.log("classes ok :", classes);

        const liste = document.getElementById("listeClasses");

        if (!liste) {
            throw new Error("L'élément #listeClasses n'existe pas dans le HTML");
        }

        liste.innerHTML = "";

        classes.forEach(classe => {

            liste.innerHTML += `
                <tr>
                    <td>${classe.id_classe}</td>
                    <td>${classe.nom_classe}</td>
                    <td>${classe.niveau}</td>
                    <td>${classe.nbr_eleve}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error("Erreur :", error);

    }
}

chargerClasse();