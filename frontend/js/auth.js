function verifierConnexion() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.replace("login.html");
    }
}

verifierConnexion();

window.addEventListener("pageshow", verifierConnexion);

function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.replace("login.html");
}