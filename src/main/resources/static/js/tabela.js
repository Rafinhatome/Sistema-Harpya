// Este código foi ajustado para funcionar com a sua API.
// Ele deve ser usado em um arquivo separado ou combinado com o código do gráfico.

let dadosTabela = []

// Funções para atualizar os totais e a tabela
function atualizarTotalAcessos(dados) {
    // Como a API retorna um registro por acesso, o total é o tamanho do array
    const total = dados.length;
    document.getElementById('totalAcessos').textContent = total;
}

function atualizarTabelaHTML(dados) {
    const tbody = document.querySelector('#tabelaAcessos tbody');
    tbody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    if (!dados || dados.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4">Nenhum dado encontrado para o período.</td>`;
        tbody.appendChild(tr);
        return;
    }

    // A função de atualização de totais agora usa os dados completos
    atualizarTotalAcessos(dados);
    atualizarTotalAcessosDiferentes(dados);
    atualizarTotalAcessosIPsLocaisDiferentes(dados);
    
    dados.forEach(item => {
        // A data vem como "YYYY-MM-DD HH:mm:ss", vamos formatá-la
        const dataHora = new Date(item.dataHora);
        const dia = String(dataHora.getDate()).padStart(2, '0');
        const mes = String(dataHora.getMonth() + 1).padStart(2, '0');
        const ano = dataHora.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>1</td> <td>${item.ip}</td>
            <td>${item.localizacao}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Funções de atualização dos totais (mantidas)
function atualizarTotalAcessosDiferentes(dados) {
    const total = dados.filter(item => item.ip !== "0:0:0:0:0:0:0:1").length;
    document.getElementById('totalAcessosDiferentes').textContent = total;
}

function atualizarTotalAcessosIPsLocaisDiferentes(dados) {
    const total = dados.filter(item => 
        item.ip !== "0:0:0:0:0:0:0:1" && 
        item.localizacao !== "Localização desconhecida"
    ).length;
    document.getElementById('totalAcessosLocalizaçãoDiferentes').textContent = total;
}


// Nova função para buscar os dados da API
async function fetchTabelaData(mes, ano) {
    try {
        const response = await fetch(`http://localhost:8080/dashboard/acessos?mes=${mes}&ano=${ano}`);
        if (!response.ok) {
            throw new Error('Erro na resposta da rede: ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados da API para a tabela:', error);
        return [];
    }
}

// Função para atualizar a tabela baseada nos seletores
async function atualizarTabela() {
    const mes = String(document.getElementById('mesSelect').value).padStart(2, '0');
    const ano = document.getElementById('anoSelect').value;

    const dadosDoBanco = await fetchTabelaData(mes, ano);
    dadosTabela = dadosDoBanco; // Atualiza a variável global (se necessário)

    atualizarTabelaHTML(dadosTabela);
}

// Eventos para carregar a tabela ao carregar a página e ao mudar os seletores
window.onload = () => {
    atualizarTabela();
}

document.getElementById('mesSelect').addEventListener('change', atualizarTabela);
document.getElementById('anoSelect').addEventListener('change', atualizarTabela);