const btn = document.getElementById("btn");
const error = document.getElementById("error");

async function entre() {

    const user = document.getElementById("user").value;
    const pwd = document.getElementById("pwd").value;

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: user,
                    mot_de_passe: pwd
                })
            }
        );

        const data = await response.json();
        console.log("Status :", response.status);
console.log("Réponse serveur :", data);

        if (!response.ok) {

            error.textContent =
                data.message || "Utilisateur ou mot de passe incorrect";

            return;
        }

        // Sauvegarder le token JWT
        localStorage.setItem("token", data.token);

        // Sauvegarder les informations de l'utilisateur
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        // Aller vers la page principale
        window.location.href = "index.html";

    } catch (err) {

        console.error(err);

        error.textContent = "Une erreur est survenue";

    }
} 

btn.addEventListener("click", entre);