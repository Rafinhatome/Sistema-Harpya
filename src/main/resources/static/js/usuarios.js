document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addUserForm");
  const userNameInput = document.getElementById("userName");
  const userEmailInput = document.getElementById("userEmail");
  const cardContainer = document.getElementById("cardContainer"); // local onde os cards vão aparecer

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (!name || !email) return;

    const col = document.createElement("div");
    col.className = "col-sm-6 mb-3 mb-sm-0";
    col.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <i class="bi bi-person" style="font-size: 2rem; color: #0d6efd;"></i>
          <p class="card-text">${email}</p>
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

    // Fecha o modal (caso esteja usando modal Bootstrap)
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalAddUser"));
    if (modal) modal.hide();

    form.reset();
  });

  // Remoção de cards
  cardContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-remove")) {
      const card = e.target.closest(".col-sm-6");
      if (card) {
        card.remove();
      }
    }
  });
});
