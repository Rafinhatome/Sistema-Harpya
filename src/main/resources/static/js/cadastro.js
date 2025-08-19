document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addUserForm");
    const nomeInput = document.getElementById("nomeCompleto");
    const emailInput = document.getElementById("emailCadastro");
    const senhaInput = document.getElementById("senhaCadastro");
    const confirmaSenhaInput = document.getElementById("confirmaSenha");
    const passwordError = document.getElementById("passwordError");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        const confirmaSenha = confirmaSenhaInput.value.trim();

        // Limpa a mensagem de erro anterior
        passwordError.style.display = "none";
        passwordError.textContent = "";

        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (!nome || !email || !senha || !confirmaSenha) {
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
            nomeUsuario: nome,
            emailUsuario: email,
            senha_hash: senha
        };

        // Envia os dados para a API de cadastro
        fetch("http://localhost:8080/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || "Erro desconhecido");
                });
            }
            return response.json();
        })
        .then(data => {
            alert("Usuário cadastrado com sucesso!");
            
            // Redireciona para a tela de login
            window.location.href = "login.html"; // Altere isso para a URL correta da sua página de login
        })
        .catch(error => {
            console.error("Erro:", error);
            let errorMessage = "Falha ao cadastrar usuário. Tente novamente.";

            // Verifica se a mensagem de erro do servidor indica um email duplicado
            if (error.message.includes("Duplicate entry") || error.message.includes("email")) {
                errorMessage = "Este e-mail já está cadastrado. Por favor, use outro.";
            }

            passwordError.textContent = errorMessage;
            passwordError.style.display = "block";
        });
    });
});