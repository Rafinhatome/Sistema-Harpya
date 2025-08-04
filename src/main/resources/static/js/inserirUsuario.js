document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addUserForm");
    const userNameInput = document.getElementById("userName");
    const userEmailInput = document.getElementById("userEmail");
    const userPasswordInput = document.getElementById("userPassword");
    const userConfirmPasswordInput = document.getElementById("userConfirmPassword"); // Novo elemento de confirmação
    const cardContainer = document.getElementById("cardContainer");
    const passwordError = document.getElementById("passwordError"); // Elemento de erro

    // --- Função para criar e adicionar um card (mantida) ---
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

    // --- Função para buscar todos os usuários do backend e exibi-los (mantida) ---
    function fetchAndDisplayUsers() {
      fetch("http://localhost:8080/usuarios")
        .then(response => {
          if (!response.ok) throw new Error("Erro ao buscar usuários");
          return response.json();
        })
        .then(users => {
          cardContainer.innerHTML = '';
          users.forEach(user => {
            createAndAppendCard(user);
          });
        })
        .catch(error => {
          console.error("Erro ao buscar usuários:", error);
          alert("Não foi possível carregar os usuários.");
        });
    }

    // --- Lógica do formulário de cadastro (atualizada) ---
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = userNameInput.value.trim();
      const email = userEmailInput.value.trim();
      const senha = userPasswordInput.value.trim();
      const confirmaSenha = userConfirmPasswordInput.value.trim();

      // Limpa a mensagem de erro anterior
      passwordError.style.display = "none";
      passwordError.textContent = "";

      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      
      if (!name || !email || !senha || !confirmaSenha) {
        passwordError.textContent = "Por favor, preencha todos os campos.";
        passwordError.style.display = "block";
        return;
      }
      
      if (senha !== confirmaSenha) {
        passwordError.textContent = "As senhas não coincidem. Por favor, digite novamente.";
        passwordError.style.display = "block";
        return;
      }

      if (!passwordRegex.test(senha)) {
        passwordError.textContent = "A senha deve ter no mínimo 8 caracteres e conter pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial.";
        passwordError.style.display = "block";
        return;
      }

      const usuario = {
        nomeUsuario: name,
        emailUsuario: email,
        senha_hash: senha, // Apenas a senha principal é enviada para o backend
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
          createAndAppendCard(data);
          const modal = bootstrap.Modal.getInstance(document.getElementById("modalAddUser"));
          if (modal) modal.hide();
          form.reset();
        })
        .catch(error => {
          console.error("Erro:", error);
          passwordError.textContent = "Falha ao cadastrar usuário. Tente novamente.";
          passwordError.style.display = "block";
        });
    });

    // --- Lógica de remoção (mantida) ---
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
              card.remove();
            })
            .catch(error => {
              console.error("Erro:", error);
              alert("Falha ao deletar usuário.");
            });
        }
      }
    });
    
    fetchAndDisplayUsers();
});