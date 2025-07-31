document.getElementById("formulario").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById("id").value);

    fetch(`http://localhost:8080/produtos/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Produto deletado com sucesso!");
            document.getElementById("formulario").reset();
        } else {
            alert("Erro ao deletar produto.");
        }
    })
    .catch(error => {
        alert("Erro de conexão com o servidor.");
        console.error(error);
    });
});
