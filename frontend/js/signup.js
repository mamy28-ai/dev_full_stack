const signupForm = document.getElementById("signupForm");

const message = document.getElementById("message");

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {

        message.textContent =
            "Les mots de passe ne sont pas identiques.";

        message.style.color = "red";

        return;
    }


    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/signup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nom: nom,
                    email: email,
                    password: password,
                    role:role
                })
            }
        );
        const data = await response.json();
        if (!response.ok) {
            message.textContent = data.message || "Erreur lors de l'inscription.";
            message.style.color = "red";
            return;
        }
        message.textContent = "Compte créé avec succès !";
        message.style.color = "green";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    } catch (error) {
        console.error(error);
        message.textContent = "Impossible de contacter le serveur.";
        message.style.color = "red";
    }

});