document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    if (!userId) {
        alert("ID do usuário não encontrado.");
        // Opcional: redirecionar para a página de listagem
        window.location.href = 'usuarios.html';
        return;
    }

    // --- Captura de elementos do DOM ---
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const cepInput = document.getElementById("cep");
    const ruaInput = document.getElementById("rua");
    const numeroInput = document.getElementById("numero");
    const complementoInput = document.getElementById("complemento");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");
    const salvarBtn = document.querySelector(".btn-success");
    
    // --- Funções de utilidade ---
    function mostraMensagem(mensagem, tipo = 'info') {
        // Você pode implementar uma lógica de mensagens na tela aqui
        // Por exemplo, usando um alert ou um modal
        alert(mensagem);
    }
    
    function limpaCamposEndereco() {
        ruaInput.value = '';
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
                ruaInput.value = dados.logradouro;
                bairroInput.value = dados.bairro;
                cidadeInput.value = dados.localidade;
                estadoInput.value = dados.uf;
                // Deixa o número e complemento vazios para que o usuário preencha
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
            const response = await fetch(`http://localhost:8080/usuarios/${id}`);
            if (!response.ok) {
                throw new Error("Erro ao buscar dados do usuário");
            }
            const usuario = await response.json();
            
            // Preenche os campos do usuário
            nomeInput.value = usuario.nomeUsuario;
            emailInput.value = usuario.emailUsuario;

            // Preenche os campos de endereço se existirem
            if (usuario.enderecoUsuario) {
                cepInput.value = usuario.enderecoUsuario.cep;
                ruaInput.value = usuario.enderecoUsuario.logradouro;
                numeroInput.value = usuario.enderecoUsuario.numero;
                complementoInput.value = usuario.enderecoUsuario.complemento;
                bairroInput.value = usuario.enderecoUsuario.bairro;
                cidadeInput.value = usuario.enderecoUsuario.cidade;
                estadoInput.value = usuario.enderecoUsuario.estado;
            } else {
                console.warn("Usuário sem endereço cadastrado.");
            }
        } catch (error) {
            console.error("Erro:", error);
            mostraMensagem("Não foi possível carregar os dados do usuário.", 'erro');
        }
    }

    // --- Lógica para salvar/atualizar dados do usuário ---
    async function salvarDados(event) {
        // Evita que o formulário seja enviado da forma padrão do navegador
        if (event) {
            event.preventDefault(); 
        }
        
        const dadosParaSalvar = {
            nomeUsuario: nomeInput.value,
            emailUsuario: emailInput.value,
            // A estrutura do objeto de endereço deve ser a mesma do seu backend
            enderecoUsuario: {
                cep: cepInput.value,
                logradouro: ruaInput.value,
                numero: numeroInput.value,
                complemento: complementoInput.value,
                bairro: bairroInput.value,
                cidade: cidadeInput.value,
                estado: estadoInput.value
            }
        };

        try {
            const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
                method: 'PUT', // ou 'PATCH', dependendo da sua API
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaSalvar)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao salvar dados.");
            }

            mostraMensagem("Dados atualizados com sucesso!", 'sucesso');
            // Redireciona para a página de listagem após o sucesso
            window.location.href = 'usuarios.html';
            
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
            mostraMensagem(`Erro ao salvar dados: ${error.message}`, 'erro');
        }
    }

    // --- Adicionando Event Listeners ---
    // Chama a função de busca do usuário quando a página é carregada
    buscarUsuario(userId);

    // Adiciona o listener para a busca automática de CEP
    if (cepInput) {
        cepInput.addEventListener("blur", function() {
            getAddressByCep(this.value);
        });
    }

    // Adiciona o listener para o botão de salvar
    if (salvarBtn) {
        salvarBtn.addEventListener('click', salvarDados);
    }
});