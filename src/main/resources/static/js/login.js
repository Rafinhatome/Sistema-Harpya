document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("emailUsuario");
    const senhaInput = document.getElementById("senhaUsuario");
    const webcamVideo = document.getElementById("webcam-video");
    const statusMessage = document.getElementById("status-message");
    const webcamContainer = document.getElementById("facial-recognition-container");

    let stream = null;

    // Função para iniciar a webcam e mostrar a área
    async function startWebcam() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamVideo.srcObject = stream;
            webcamContainer.style.display = 'block';
            statusMessage.textContent = 'Posicione seu rosto na área de vídeo.';
            return true;
        } catch (err) {
            statusMessage.textContent = 'Erro ao acessar a webcam. Permita o uso da câmera para continuar.';
            console.error("Erro ao acessar a webcam: ", err);
            return false;
        }
    }

    // Função para parar a webcam e esconder a área
    function stopWebcam() {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            webcamVideo.srcObject = null;
        }
        webcamContainer.style.display = 'none';
    }

    // Função principal para iniciar o fluxo de login
    async function handleLogin() {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        const webcamStarted = await startWebcam();
        if (!webcamStarted) {
            return;
        }

        statusMessage.textContent = 'Aguardando 1s para a câmera estabilizar...';
        setTimeout(async () => {
            await loginWithFacialVerification(email, senha);
            stopWebcam();
        }, 1000);
    }
    
    // NOVO FLUXO DE LOGIN: agora com verificação facial
    async function loginWithFacialVerification(email, senha) {
        statusMessage.textContent = 'Verificando credenciais e rosto...';

        try {
            // 1. Envia credenciais para o backend Java
            const response = await fetch("http://localhost:8080/usuarios/login-com-rosto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailUsuario: email, senha_hash: senha })
            });

            if (!response.ok) {
                const errorText = await response.text();
                statusMessage.textContent = errorText || "Email ou senha inválidos.";
                return;
            }

            const data = await response.json();
            const usuarioEmbeddingSalvo = data.faceEmbedding;

            if (!usuarioEmbeddingSalvo) {
                statusMessage.textContent = 'Dados faciais não encontrados para este usuário. Faça login apenas com a senha.';
                alert('Dados faciais não encontrados. Login com senha.');
                window.location.href = "dashboard_principal.html";
                return;
            }

            // 2. Captura a imagem do rosto atual para comparação
            const canvas = document.createElement('canvas');
            canvas.width = webcamVideo.videoWidth;
            canvas.height = webcamVideo.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);

            const imageDataUrl = canvas.toDataURL('image/jpeg');
            const base64Image = imageDataUrl.split(',')[1];

            // 3. Extrai o embedding da imagem atual usando o backend Python
            statusMessage.textContent = 'Verificando o rosto...';
            const embeddingAtualResponse = await fetch('http://localhost:5000/cadastrar_rosto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imagem: base64Image })
            });
            
            const embeddingAtualData = await embeddingAtualResponse.json();
            if (!embeddingAtualResponse.ok || embeddingAtualData.status !== 'sucesso') {
                statusMessage.textContent = `Falha na extração facial: ${embeddingAtualData.mensagem}`;
                return;
            }
            
            const embeddingAtual = embeddingAtualData.embedding;

            // 4. Compara os embeddings usando a API Python
            statusMessage.textContent = 'Comparando rostos...';
            const verificationResponse = await fetch('http://localhost:5000/verificar_rosto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embedding_salvo: JSON.parse(usuarioEmbeddingSalvo),
                    embedding_atual: embeddingAtual
                })
            });

            const verificationData = await verificationResponse.json();

            if (verificationResponse.ok && verificationData.status === 'sucesso') {
                statusMessage.textContent = 'Login com sucesso!';
                alert('Login com sucesso!');
                window.location.href = "dashboard_principal.html";
            } else {
                statusMessage.textContent = `Falha na verificação facial: ${verificationData.mensagem}`;
            }

        } catch (error) {
            statusMessage.textContent = 'Erro ao se comunicar com os servidores de login.';
            console.error('Erro:', error);
        }
    }
    
    // Adiciona o evento de 'submit' ao formulário
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        await handleLogin();
    });
});