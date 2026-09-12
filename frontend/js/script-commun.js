// ===== script-commun.js =====
// Fonction iombonana hampandehanana ny navigation par onglets (tabs)
// Ampiasao amin'ny pejy rehetra misy tabs: enseignants.html, parent.html, sns.

function afficherOnglet(id, btn) {
  // 1. Manafina ny votoatin'ny onglet rehetra
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');

  // 2. Manala ny class "active" amin'ny bouton (tab) rehetra
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));

  // 3. Mampiseho ilay onglet mifanaraka amin'ny id nalefa
  document.getElementById(id).style.display = 'block';

  // 4. Manisy class "active" amin'ilay bouton notsindriana
  btn.classList.add('active');
}