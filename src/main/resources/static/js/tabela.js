let dadosTabela = []

function atualizarTotalAcessos(dadosFiltrados) {
  const total = dadosFiltrados.reduce((acc, item) => acc + Number(item.acessos), 0)
  document.getElementById('totalAcessos').textContent = total
}

function atualizarTabela(mes, ano) {
  const tbody = document.querySelector('#tabelaAcessos tbody')
  tbody.innerHTML = ''

  const dadosFiltrados = dadosTabela.filter(item => {
    const [dd, mm, yyyy] = item.data.split('/')
    return Number(mm) === mes && Number(yyyy) === ano
  })

  atualizarTotalAcessos(dadosFiltrados)
  atualizarTotalAcessosDiferentes(dadosFiltrados)
  atualizarTotalAcessosIPsLocaisDiferentes(dadosFiltrados)
  
  dadosFiltrados.forEach(item => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${item.data}</td>
      <td>${item.acessos}</td>
      <td>${item.ip}</td>
      <td>${item.localizacao}</td>
    `
    tbody.appendChild(tr)
  })
}

function carregarCSVTabela() {
  fetch('../assets/data/tabela.csv')
    .then(response => response.text())
    .then(csvText => {
      const resultado = Papa.parse(csvText, {
        delimiter: ";",
        header: false,
        skipEmptyLines: true
      })

      dadosTabela = resultado.data.map(linha => ({
        data: linha[0],
        acessos: linha[1],
        ip: linha[2],
        localizacao: linha[3]
      }))

      const mes = Number(document.getElementById('mesSelect').value)
      const ano = Number(document.getElementById('anoSelect').value)
      atualizarTabela(mes, ano)
    })
    .catch(error => console.error('Erro ao carregar CSV da tabela:', error))
}

window.onload = () => {
  carregarCSVTabela()

  document.getElementById('mesSelect').addEventListener('change', () => {
    const mes = Number(document.getElementById('mesSelect').value)
    const ano = Number(document.getElementById('anoSelect').value)
    atualizarTabela(mes, ano)
  })

  document.getElementById('anoSelect').addEventListener('change', () => {
    const mes = Number(document.getElementById('mesSelect').value)
    const ano = Number(document.getElementById('anoSelect').value)
    atualizarTabela(mes, ano)
  })
}
function atualizarTotalAcessosDiferentes(dadosFiltrados) {
  const total = dadosFiltrados
    .filter(item => item.ip !== "192.168.45.103")
    .reduce((acc, item) => acc + Number(item.acessos), 0)

  document.getElementById('totalAcessosDiferentes').textContent = total
}


function atualizarTotalAcessosIPsLocaisDiferentes(dadosFiltrados) {
  const total = dadosFiltrados
    .filter(item => 
      item.ip !== "192.168.45.103" && 
      item.localizacao !== "Rua das Flores, 123, Bairro Primavera, Sao Paulo, SP, Brasil"
    )
    .reduce((acc, item) => acc + Number(item.acessos), 0)

  document.getElementById('totalAcessosLocalizaçãoDiferentes').textContent = total
}