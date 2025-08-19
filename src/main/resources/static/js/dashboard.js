(() => {
    'use strict'

    const ctx = document.getElementById('myChart');
    const mesSelect = document.getElementById('mesSelect');
    const anoSelect = document.getElementById('anoSelect');

    let dadosAPI = [];

    // --- Funções do GRÁFICO ---
    function criarGrafico(labels, totalAcessos) {
        if (window.grafico) window.grafico.destroy();

        window.grafico = new Chart(ctx, {
            data: {
                labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Total Acessos',
                        data: totalAcessos,
                        borderColor: '#007bff',
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#007bff',
                    }
                ]
            },
            options: {
                plugins: {
                    legend: { display: true },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Data' }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Número de Acessos' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function agruparAcessosPorDia(dadosParaAgrupar) {
        const somaPorDia = {};
        
        if (!dadosParaAgrupar || dadosParaAgrupar.length === 0) {
            return { labels: [], totalAcessos: [] };
        }
        
        dadosParaAgrupar.forEach(item => {
            if (item && item.dataHora) {
                const dia = item.dataHora.split(' ')[0];
                
                if (!somaPorDia[dia]) {
                    somaPorDia[dia] = 0;
                }
                somaPorDia[dia] += 1;
            }
        });

        const datasOrdenadas = Object.keys(somaPorDia).sort((a, b) => {
            return new Date(a) - new Date(b);
        });

        const labels = datasOrdenadas;
        const totalAcessos = datasOrdenadas.map(d => somaPorDia[d]);

        return { labels, totalAcessos };
    }

    function atualizarTabelaHTML(dados) {
        const tbody = document.querySelector('#tabelaAcessos tbody');
        tbody.innerHTML = '';

        if (!dados || dados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="6">Nenhum dado encontrado para o período.</td>`;
            tbody.appendChild(tr);
            return;
        }

        dados.forEach(item => {
            if (item && item.dataHora) {
                const [data, hora] = item.dataHora.split(' ');
                const [ano, mes, dia] = data.split('-');
                const dataFormatada = `${dia}/${mes}/${ano}`;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${dataFormatada}</td>
                    <td>${hora}</td>
                    <td>${item.nome}</td>
                    <td>${item.ip}</td>
                    <td>${item.localizacao}</td>
                `;
                tbody.appendChild(tr);
            }
        });
    }

    // --- Lógica UNIFICADA para carregar os dados ---
    async function fetchEAtualizarDashboard() {
        const totalAcessosElement = document.getElementById('totalAcessos');
        const totalAcessosDiferentesElement = document.getElementById('totalAcessosDiferentes');
        const totalAcessosLocalizacaoDiferentesElement = document.getElementById('totalAcessosLocalizaçãoDiferentes');
        
        const mes = String(mesSelect.value).padStart(2, '0');
        const ano = anoSelect.value;
        
        // Fetch principal para o gráfico e a tabela (dados por mês/ano)
        try {
            const responseAcessos = await fetch(`http://localhost:8080/dashboard/acessos?mes=${mes}&ano=${ano}`);
            if (!responseAcessos.ok) {
                throw new Error('Erro na resposta da rede: ' + responseAcessos.statusText);
            }
            dadosAPI = await responseAcessos.json();
            totalAcessosElement.textContent = dadosAPI.length;

            const dadosGrafico = agruparAcessosPorDia(dadosAPI);
            criarGrafico(dadosGrafico.labels, dadosGrafico.totalAcessos);
            atualizarTabelaHTML(dadosAPI);

        } catch (error) {
            console.error('Erro ao buscar dados da API de acessos:', error);
            dadosAPI = [];
            totalAcessosElement.textContent = 'Erro';
            atualizarTabelaHTML([]); // Limpa a tabela
            criarGrafico([], []); // Zera o gráfico
        }

        // Fetch para a contagem de acessos com IPs diferentes (independente)
        try {
            const responseIpDiferente = await fetch('http://localhost:8080/dashboard/count-ip-diferente');
            if (!responseIpDiferente.ok) {
                throw new Error('Erro na resposta da rede para IPs diferentes.');
            }
            const totalIpsDiferentes = await responseIpDiferente.json();
            totalAcessosDiferentesElement.textContent =  totalIpsDiferentes;
        } catch (error) {
            console.error('Erro ao buscar contagem de IPs diferentes:', error);
            totalAcessosDiferentesElement.textContent = '0';
        }

        // Fetch para a contagem de acessos com IPs e Localização diferentes (independente)
        try {
            const responseIpLocDiferente = await fetch('http://localhost:8080/dashboard/count-ip-localizacao-diferente');
            if (!responseIpLocDiferente.ok) {
                throw new Error('Erro na resposta da rede para IPs e Localização diferentes.');
            }
            const totalIpLocDiferentes = await responseIpLocDiferente.json();
            totalAcessosLocalizacaoDiferentesElement.textContent = totalIpLocDiferentes;
        } catch (error) {
            console.error('Erro ao buscar contagem de IPs e Localização diferentes:', error);
            totalAcessosLocalizacaoDiferentesElement.textContent = '0';
        }
    }

    // --- Event Listeners ---
    window.onload = fetchEAtualizarDashboard;

    mesSelect.addEventListener('change', fetchEAtualizarDashboard);
    anoSelect.addEventListener('change', fetchEAtualizarDashboard);

})();