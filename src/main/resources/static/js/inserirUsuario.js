document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addUserForm");
  const userNameInput = document.getElementById("userName");
  const userEmailInput = document.getElementById("userEmail");
  const userPasswordInput = document.getElementById("userPassword");
  const cardContainer = document.getElementById("cardContainer");

  // --- Função para criar e adicionar um card ---
  // Esta função é chamada tanto para um novo cadastro quanto ao carregar a página.
  function createAndAppendCard(userData) {
    const col = document.createElement("div");
    col.className = "col-sm-6 mb-3 mb-sm-0";
    col.setAttribute("data-id", userData.id);

    col.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${userData.nomeUsuario}</h5>
          <i class="bi bi-person" style="font-size: 2rem; color: #0d6efd;"></i>
          <p class="card-text">${userData.emailUsuario}</p>
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
  }

  // --- Função para buscar todos os usuários do backend e exibi-los ---
  function fetchAndDisplayUsers() {
    fetch("http://localhost:8080/usuarios")
      .then(response => {
        if (!response.ok) throw new Error("Erro ao buscar usuários");
        return response.json();
      })
      .then(users => {
        // Limpa os cards existentes antes de carregar os novos
        cardContainer.innerHTML = '';
        
        // Itera sobre a lista de usuários e cria um card para cada um
        users.forEach(user => {
          createAndAppendCard(user);
        });
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
        alert("Não foi possível carregar os usuários.");
      });
  }

  // --- Lógica do formulário de cadastro ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const senha_hash = userPasswordInput.value.trim();

    if (!name || !email || !senha_hash) return;

    const usuario = {
      nomeUsuario: name,
      emailUsuario: email,
      senha_hash: senha_hash,
      ativo: 1
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
        // Usa a função reutilizável para criar e adicionar o card
        createAndAppendCard(data);

        // Fecha o modal e limpa o formulário
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalAddUser"));
        if (modal) modal.hide();
        form.reset();
      })
      .catch(error => {
        console.error("Erro:", error);
        alert("Falha ao cadastrar usuário.");
      });
  });

  // --- Lógica de remoção ---
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
  
  // --- Ação principal: Carregar todos os usuários ao abrir a página ---
  fetchAndDisplayUsers();
});