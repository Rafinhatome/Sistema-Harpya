document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("emailUsuario").value.trim();
    const senha = document.getElementById("senhaUsuario").value.trim();

    const usuario = {
      emailUsuario: email,
      senha_hash: senha
    };

    console.log("usuario", usuario);
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuario)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Email ou senha inválidos.");
      }
      return response.text(); // ou .json() se preferir
    })

    .then(msg => {
      alert("Login realizado com sucesso!");
      window.location.href = "../html/dashboard_principal.html";
    })
    .catch(err => {
      alert(err.message);
    });
  });
});
