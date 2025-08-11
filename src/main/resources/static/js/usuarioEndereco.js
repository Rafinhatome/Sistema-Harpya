document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    if (!userId) {
        alert("ID do usuário não encontrado.");
        window.location.href = 'usuarios.html';
        return;
    }

    // --- Captura de elementos do DOM ---
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const cepInput = document.getElementById("cep");
    const logradouroInput = document.getElementById("logradouro");
    const numeroInput = document.getElementById("numero");
    const complementoInput = document.getElementById("complemento");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");
    const salvarBtn = document.querySelector(".btn-success");

    const enderecoIdInput = document.createElement('input');
    enderecoIdInput.type = 'hidden';
    enderecoIdInput.id = 'enderecoId';
    document.body.appendChild(enderecoIdInput);
    
    // --- Funções de utilidade ---
    function mostraMensagem(mensagem, tipo = 'info') {
        alert(mensagem);
    }
    
    function limpaCamposEndereco() {
        logradouroInput.value = '';
        numeroInput.value = '';
        complementoInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        estadoInput.value = '';
    }

    // --- Lógica para buscar CEP na API ViaCEP ---
    async function getAddressByCep(cep) {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            console.error("CEP inválido. Deve conter 8 dígitos.");
            limpaCamposEndereco();
            return;
        }

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                mostraMensagem("CEP não encontrado.", 'erro');
                limpaCamposEndereco();
            } else {
                logradouroInput.value = dados.logradouro;
                bairroInput.value = dados.bairro;
                cidadeInput.value = dados.localidade;
                estadoInput.value = dados.estado;
                numeroInput.value = ''; 
                complementoInput.value = '';
            }
        } catch (error) {
            mostraMensagem("Erro ao buscar o CEP.", 'erro');
            console.error("Erro ao buscar o CEP:", error);
        }
    }

    // --- Lógica para buscar e preencher dados do usuário ---
    async function buscarUsuario(id) {
        try {
            const responseUsuario = await fetch(`http://localhost:8080/usuarios/${id}`);
            if (!responseUsuario.ok) {
                throw new Error("Erro ao buscar dados do usuário");
            }
            const usuario = await responseUsuario.json();
            
            nomeInput.value = usuario.nomeUsuario;
            emailInput.value = usuario.emailUsuario;

            const responseEndereco = await fetch(`http://localhost:8080/enderecos/usuario/${id}`);
            if (responseEndereco.ok) {
                const endereco = await responseEndereco.json();
                if (endereco) {
                    enderecoIdInput.value = endereco.id;
                    cepInput.value = endereco.cep;
                    logradouroInput.value = endereco.logradouro;
                    numeroInput.value = endereco.numero;
                    complementoInput.value = endereco.complemento;
                    bairroInput.value = endereco.bairro;
                    estadoInput.value = endereco.estado; // Mantendo o seu valor original
                    cidadeInput.value = endereco.cidade;
                }
            } else {
                console.warn("Usuário sem endereço cadastrado ou erro ao buscar endereço.");
            }
        } catch (error) {
            console.error("Erro:", error);
            mostraMensagem("Não foi possível carregar os dados do usuário.", 'erro');
        }
    }

    // --- Lógica para salvar/atualizar dados do usuário ---
    async function salvarDados(event) {
        event.preventDefault(); 
        
        const enderecoId = enderecoIdInput.value;
        const method = enderecoId ? 'PUT' : 'POST';
        
        const url = enderecoId 
            ? `http://localhost:8080/enderecos/usuario/${userId}` 
            : `http://localhost:8080/enderecos/${userId}`;

        const dadosParaSalvar = {
            cep: cepInput.value,
            logradouro: logradouroInput.value,
            numero: numeroInput.value,
            complemento: complementoInput.value,
            bairro: bairroInput.value,
            cidade: cidadeInput.value,
            estado: estadoInput.value
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaSalvar)
            });

            if (!response.ok) {
                // A requisição falhou. Vamos tentar pegar o erro do servidor
                const errorData = await response.json().catch(() => null);
                if (errorData) {
                    throw new Error(errorData.message || "Erro ao salvar dados.");
                } else {
                    // Erro 405 não tem corpo. Apenas joga o erro da requisição
                    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                }
            }

            mostraMensagem("Dados atualizados com sucesso!", 'sucesso');
            window.location.href = 'usuarios.html';
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
            mostraMensagem(`Erro ao salvar dados: ${error.message}`, 'erro');
        }
    }

    // --- Adicionando Event Listeners ---
    buscarUsuario(userId);

    if (cepInput) {
        cepInput.addEventListener("blur", function() {
            getAddressByCep(this.value);
        });
    }

    if (salvarBtn) {
        salvarBtn.addEventListener('click', salvarDados);
    }
});