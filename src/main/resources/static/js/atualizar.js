document.getElementById("formulario").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const produto = {
        id: parseInt(document.getElementById("id").value),
        nomeProduto: document.getElementById("name").value,
        preco: parseFloat(document.getElementById("preco").value)
    };

    fetch("http://localhost:8080/produtos", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })

    .then(response => {
        if (response.ok) {
            alert("Produto atualizado com sucesso!");
            document.getElementById("formulario").reset();
        } else {
            alert("Erro ao inserir produto.");
        }
    })
});
