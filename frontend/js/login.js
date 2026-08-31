const btn= document.getElementById('btn');
const error= document.getElementById('error');

btn.addEventListener('click', function(){
    const user= document.getElementById('user').value;
    const pwd= document.getElementById('pwd').value;
    if (user==='Admins' && pwd==='123456' ){
    window.location.href = "index.html";
    }else{
      error.textContent = "erreur user ou password";
    }
});