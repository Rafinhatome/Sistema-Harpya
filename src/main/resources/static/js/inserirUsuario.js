document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addUserForm");
  const userNameInput = document.getElementById("userName");
  const userEmailInput = document.getElementById("userEmail");
  const userPasswordInput = document.getElementById("userPassword");
  const cardContainer = document.getElementById("cardContainer");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const senha_hash = userPasswordInput.value.trim();

    if (!name || !email || !senha_hash) return;

    // ATENÇÃO: os nomes precisam bater com os nomes do Java (Usuario.java)
    const usuario = {
      nomeUsuario: name,
      emailUsuario: email,
      senha_hash: senha_hash,  // Pode ajustar conforme desejar
      ativo: 1               // Ou true, dependendo de como você trata no back-end
    };

    fetch("http://localhost:8080/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    })
      .then(response => {
        if (!response.ok) throw new Error("Erro ao cadastrar usuário");
        return response.json();
      })
      .then(data => {
        const col = document.createElement("div");
        col.className = "col-sm-6 mb-3 mb-sm-0";
        col.setAttribute("data-id", data.id);

        col.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${data.nomeUsuario}</h5>
              <i class="bi bi-person" style="font-size: 2rem; color: #0d6efd;"></i>
              <p class="card-text">${data.emailUsuario}</p>
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Configuração
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Atualizar login e senha</a></li>
                  <li><a class="dropdown-item text-danger btn-remove" href="#">Desativar</a></li>
                </ul>
              </div>
            </div>
          </div>
        `;

        cardContainer.appendChild(col);

        const modal = bootstrap.Modal.getInstance(document.getElementById("modalAddUser"));
        if (modal) modal.hide();

        form.reset();
      })
      .catch(error => {
        console.error("Erro:", error);
        alert("Falha ao cadastrar usuário.");
      });
  });

  // Lógica de remoção (também faz DELETE no backend)
  cardContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-remove")) {
      const card = e.target.closest(".col-sm-6");
      const userId = card.getAttribute("data-id");

      if (userId) {
        fetch(`http://localhost:8080/usuarios/${userId}`, {
          method: "DELETE"
        })
          .then(response => {
            if (!response.ok) throw new Error("Erro ao deletar usuário");
            card.remove(); // Remove do DOM
          })
          .catch(error => {
            console.error("Erro:", error);
            alert("Falha ao deletar usuário.");
          });
      }
    }
  });
});
