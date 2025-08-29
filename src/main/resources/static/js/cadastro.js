document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addUserForm");
    const nomeInput = document.getElementById("nomeCompleto");
    const emailInput = document.getElementById("emailCadastro");
    const senhaInput = document.getElementById("senhaCadastro");
    const confirmaSenhaInput = document.getElementById("confirmaSenha");
    const passwordError = document.getElementById("passwordError");

    // Novos elementos para o cadastro facial
    const modalAddUser = document.getElementById('modalAddUser');
    const webcamRegisterVideo = document.getElementById('webcam-register-video');
    const registerStatusMessage = document.getElementById('register-status-message');
    const facialRegisterContainer = document.getElementById('facial-register-container');
    const captureFaceBtn = document.getElementById('capture-face-btn');
    const faceEmbeddingInput = document.getElementById('faceEmbeddingInput');

    let streamCadastro = null;

    // Quando o modal de cadastro é aberto, inicia a câmera
    modalAddUser.addEventListener('shown.bs.modal', async () => {
        facialRegisterContainer.style.display = 'block';
        try {
            streamCadastro = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamRegisterVideo.srcObject = streamCadastro;
            registerStatusMessage.textContent = 'Posicione seu rosto para o cadastro.';
        } catch (err) {
            registerStatusMessage.textContent = 'Erro ao acessar a webcam para cadastro.';
            console.error("Erro ao acessar a webcam: ", err);
        }
    });

    // Quando o modal de cadastro é fechado, para a câmera
    modalAddUser.addEventListener('hidden.bs.modal', () => {
        if (streamCadastro) {
            const tracks = streamCadastro.getTracks();
            tracks.forEach(track => track.stop());
        }
        facialRegisterContainer.style.display = 'none';
        faceEmbeddingInput.value = ''; // Limpa o embedding salvo
        captureFaceBtn.disabled = false;
        captureFaceBtn.textContent = 'Capturar Rosto';
        registerStatusMessage.textContent = '';
    });

    // Evento do botão "Capturar Rosto"
    captureFaceBtn.addEventListener('click', async () => {
        if (!webcamRegisterVideo.srcObject) {
            registerStatusMessage.textContent = 'Webcam não está ativa.';
            return;
        }
        registerStatusMessage.textContent = 'Capturando e analisando rosto...';
        
        // Captura o frame
        const canvas = document.createElement('canvas');
        canvas.width = webcamRegisterVideo.videoWidth;
        canvas.height = webcamRegisterVideo.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(webcamRegisterVideo, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL('image/jpeg');
        const base64Image = imageDataUrl.split(',')[1];

        try {
            // Envia a imagem para a API de cadastro Python
            const response = await fetch('http://localhost:5000/cadastrar_rosto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imagem: base64Image })
            });

            const data = await response.json();

            if (response.ok && data.status === 'sucesso') {
                registerStatusMessage.textContent = 'Rosto capturado com sucesso!';
                // Salva o embedding no campo oculto do formulário
                faceEmbeddingInput.value = JSON.stringify(data.embedding);
                // Desabilita o botão para evitar múltiplas capturas
                captureFaceBtn.disabled = true;
                captureFaceBtn.textContent = 'Rosto Cadastrado!';
            } else {
                registerStatusMessage.textContent = `Falha no cadastro facial: ${data.mensagem}`;
            }
        } catch (error) {
            registerStatusMessage.textContent = 'Erro ao conectar com o servidor de reconhecimento facial.';
            console.error('Erro na requisição:', error);
        }
    });

    // Evento de 'submit' do formulário de cadastro
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        const confirmaSenha = confirmaSenhaInput.value.trim();
        const faceEmbedding = faceEmbeddingInput.value; // Aqui já é uma string!

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

        // Verifica se o embedding foi capturado
        if (!faceEmbedding) {
            passwordError.textContent = "Por favor, capture seu rosto para o cadastro.";
            passwordError.style.display = "block";
            return;
        }

        const usuario = {
            nomeUsuario: nome,
            emailUsuario: email,
            senha_hash: senha,
            faceEmbedding: faceEmbedding // Envia a string diretamente
        };

        // Envia os dados para a API de cadastro (agora incluindo o embedding)
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
            window.location.href = "login.html";
        })
        .catch(error => {
            console.error("Erro:", error);
            let errorMessage = "Falha ao cadastrar usuário. Tente novamente.";
            if (error.message.includes("Duplicate entry") || error.message.includes("email")) {
                errorMessage = "Este e-mail já está cadastrado. Por favor, use outro.";
            }
            passwordError.textContent = errorMessage;
            passwordError.style.display = "block";
        });
    });
});
