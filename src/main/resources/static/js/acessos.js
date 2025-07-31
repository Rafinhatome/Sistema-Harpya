function atualizarTotalAcessos(dadosFiltrados) {
  const total = dadosFiltrados.reduce((acc, item) => acc + Number(item.acessos), 0)
  document.getElementById('totalAcessos').textContent = total
}
