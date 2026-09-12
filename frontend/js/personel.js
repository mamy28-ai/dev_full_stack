// navigation principale
const menuItems = document.querySelectorAll('.menu-item');
const panels = document.querySelectorAll('.panel');
const menu = document.getElementById('menu');
 
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.panel;
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + target).classList.add('active');
    menu.classList.remove('open');
  });
});
 
// menu mobile
document.getElementById('burgerBtn').addEventListener('click', () => {
  menu.classList.toggle('open');
});
 
// sous-onglets dossiers
const subtabs = document.querySelectorAll('.subtab');
subtabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.sub;
    subtabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.subpanel').forEach(p => p.classList.remove('active'));
    document.getElementById('sub-' + target).classList.add('active');
  });
});
 
// formulaires de démonstration
['inscriptionForm','financeForm','eleveForm','personnelForm'].forEach(id => {
  const form = document.getElementById(id);
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Enregistré (démonstration).');
      form.reset();
    });
  }
});
 