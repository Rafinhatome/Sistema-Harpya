(() => {
  'use strict'

  const ctx = document.getElementById('myChart')
  const mesSelect = document.getElementById('mesSelect')
  const anoSelect = document.getElementById('anoSelect')

  let dados = []

  function criarGrafico(labels, total, diferentes, locaisDiferentes) {
    if (window.grafico) window.grafico.destroy()

    window.grafico = new Chart(ctx, {
      data: {
        labels,
        datasets: [
          {
            type: 'line',
            label: 'Total Acessos',
            data: total,
            borderColor: '#007bff',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0,
            pointBackgroundColor: '#007bff',
            yAxisID: 'y'
          },
          {
            type: 'bar',
            label: 'Acessos IP Diferente',
            data: diferentes,
            backgroundColor: '#28a745',
            yAxisID: 'y',
            barPercentage: 0.5,
            categoryPercentage: 0.7
          },
          {
            type: 'bar',
            label: 'Acessos IP e Localização Diferentes',
            data: locaisDiferentes,
            backgroundColor: '#dc3545',
            yAxisID: 'y',
            barPercentage: 0.5,
            categoryPercentage: 0.7
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
            title: { display: true, text: 'Total Acessos (linha)' },
            beginAtZero: true
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Acessos Diferentes (colunas)' },
            beginAtZero: true,
            max: 3
          }
        }
      }
    })
  }

  function filtrarEAgruparDados(mes, ano) {
    const dadosFiltrados = dados.filter(item => {
      const [dd, mm, yyyy] = item.data.split('/')
      return Number(mm) === mes && Number(yyyy) === ano
    })

    const somaPorDia = {}

    dadosFiltrados.forEach(item => {
      const dia = item.data
      if (!somaPorDia[dia]) {
        somaPorDia[dia] = {
          total: 0,
          diferentes: 0,
          locaisDiferentes: 0
        }
      }

      const acessosNum = Number(item.acessos)
      somaPorDia[dia].total += acessosNum

      if (item.ip !== "192.168.45.103") {
        somaPorDia[dia].diferentes += acessosNum
      }

      if (
        item.ip !== "192.168.45.103" &&
        item.localizacao !== "Rua das Flores, 123, Bairro Primavera, Sao Paulo, SP, Brasil"
      ) {
        somaPorDia[dia].locaisDiferentes += acessosNum
      }
    })

    const datasOrdenadas = Object.keys(somaPorDia).sort((a, b) => {
      const [d1, m1, y1] = a.split('/')
      const [d2, m2, y2] = b.split('/')
      return (y1 + m1 + d1).localeCompare(y2 + m2 + d2)
    })

    const labels = datasOrdenadas
    const total = datasOrdenadas.map(d => somaPorDia[d].total)
    const diferentes = datasOrdenadas.map(d => somaPorDia[d].diferentes)
    const locaisDiferentes = datasOrdenadas.map(d => somaPorDia[d].locaisDiferentes)

    return { labels, total, diferentes, locaisDiferentes }
  }

  function atualizarGrafico() {
    const mes = Number(mesSelect.value)
    const ano = Number(anoSelect.value)

    const { labels, total, diferentes, locaisDiferentes } = filtrarEAgruparDados(mes, ano)
    criarGrafico(labels, total, diferentes, locaisDiferentes)
  }

  fetch('../assets/data/tabela.csv')
    .then(response => response.text())
    .then(csvText => {
      const resultado = Papa.parse(csvText, {
        delimiter: ";",
        header: false,
        skipEmptyLines: true
      })

      dados = resultado.data.map(linha => ({
        data: linha[0],
        acessos: linha[1],
        ip: linha[2],
        localizacao: linha[3]
      }))

      atualizarGrafico()
    })
    .catch(err => console.error('Erro ao carregar CSV:', err))

  mesSelect.addEventListener('change', atualizarGrafico)
  anoSelect.addEventListener('change', atualizarGrafico)

})()
