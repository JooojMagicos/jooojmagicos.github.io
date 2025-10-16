document.addEventListener('DOMContentLoaded', function()
{

    carregarProdutos(produtos);

});

function carregarProdutos(produtos) {
  
  const section = document.createElement("section");
  section.id = "lista-produtos";
  document.body.appendChild(section);

  produtos.forEach((produto) => {

    const article = document.createElement("article");
    article.classList.add("produto");

    article.innerHTML = `
      <h2>${produto.title}</h2>
      <img src="${produto.image}" alt="${produto.title}" width="150">
      <p><strong>ID:</strong> ${produto.id}</p>
      <p><strong>Categoria:</strong> ${produto.category}</p>
      <p><strong>Preço:</strong> €${produto.price.toFixed(2)}</p>
      <p><strong>Classificação:</strong> ${produto.rating.rate} ⭐ (${produto.rating.count} avaliações)</p>
    `;

    section.appendChild(article);
  });
}

