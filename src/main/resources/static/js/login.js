document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // impede o submit padrão

    const email = document.getElementById("emailUsuario").value.trim();
    const senha = document.getElementById("senhaUsuario").value.trim();

    // valida campos obrigatórios
    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return; // impede de continuar para o fetch
    }

    const usuario = {
      emailUsuario: email,
      senha_hash: senha
    };

    fetch("http://localhost:8080/usuarios/html/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuario)
    })
    .then(async response => {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || "Email ou senha inválidos.");
      }
      return text;
    })
    .then(msg => {
      alert(msg); 
      window.location.href = "dashboard_principal.html";
    })
    .catch(err => {
      alert(err.message);
    });
  });
});
