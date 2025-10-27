let todosProdutos = [];
let carrinho = [];

document.addEventListener('DOMContentLoaded', async function () {
  try {
    const categorias = await carregarCategorias();
    criarMenuCategorias(categorias);

    todosProdutos = await carregarProdutosDaAPI();
    renderizarProdutos(todosProdutos);

    // Eventos
    document.getElementById('finalizar-btn').addEventListener('click', finalizarCompra);
    document.getElementById('search-input').addEventListener('input', filtrarEOrdenarProdutos);
    document.getElementById('sort-select').addEventListener('change', filtrarEOrdenarProdutos);

  } catch (erro) {
    console.error('Erro ao carregar dados:', erro);
    document.body.innerHTML += '<p style="color:red;">Erro ao carregar produtos ou categorias.</p>';
  }
});

// ===== Funções de API =====
async function carregarProdutosDaAPI() {
  const resposta = await fetch('https://deisishop.pythonanywhere.com/products/');
  if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
  const dados = await resposta.json();
  return dados;
}

async function carregarCategorias() {
  const resposta = await fetch('https://deisishop.pythonanywhere.com/categories/');
  if (!resposta.ok) throw new Error(`Erro ao buscar categorias: ${resposta.status}`);
  return await resposta.json();
}

// ===== Filtros e ordenação =====
function filtrarEOrdenarProdutos() {
  const searchValue = document.getElementById('search-input').value.toLowerCase();
  const sortValue = document.getElementById('sort-select').value;

  let produtosFiltrados = todosProdutos.filter(p => p.title.toLowerCase().includes(searchValue));

  switch (sortValue) {
    case 'alfabetica':
      produtosFiltrados.sort((a,b) => a.title.localeCompare(b.title));
      break;
    case 'preco-asc':
      produtosFiltrados.sort((a,b) => a.price - b.price);
      break;
    case 'preco-desc':
      produtosFiltrados.sort((a,b) => b.price - a.price);
      break;
  }

  renderizarProdutos(produtosFiltrados);
}

// ===== UI Produtos =====
function criarMenuCategorias(categorias) {
  const container = document.getElementById('container-categorias');
  container.innerHTML = '';

  const select = document.createElement('select');
  const optionTodos = document.createElement('option');
  optionTodos.value = '';
  optionTodos.textContent = 'Todas as categorias';
  select.appendChild(optionTodos);

  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  select.addEventListener('change', function () {
    const categoriaSelecionada = this.value;
    let produtosFiltrados = categoriaSelecionada
      ? todosProdutos.filter(p => p.category === categoriaSelecionada)
      : todosProdutos;

    renderizarProdutos(produtosFiltrados);
  });

  container.appendChild(select);
}

function renderizarProdutos(produtos) {
  const section = document.getElementById('lista-produtos');
  section.innerHTML = '';

  produtos.forEach(produto => {
    const article = document.createElement('article');

    article.innerHTML = `
      <h2>${produto.title}</h2>
      <img src="${produto.image}" alt="${produto.title}" width="150">
      <p><strong>Preço:</strong> €${produto.price.toFixed(2)}</p>
      <button data-id="${produto.id}">Adicionar ao carrinho</button>
    `;
    section.appendChild(article);

    article.querySelector('button').addEventListener('click', () => {
      adicionarAoCarrinho(produto);
    });
  });
}

// ===== Carrinho =====
function adicionarAoCarrinho(produto) {
  const itemExistente = carrinho.find(item => item.id === produto.id);
  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  renderizarCarrinho();
}

function renderizarCarrinho() {
  let container = document.getElementById('carrinho');
  if (!container) {
    container = document.createElement('div');
    container.id = 'carrinho';
    container.style.border = '1px solid #ccc';
    container.style.padding = '10px';
    container.style.marginTop = '20px';
    document.body.appendChild(container);
  }
  container.innerHTML = '<h3>Carrinho</h3>';

  if (carrinho.length === 0) {
    container.innerHTML += '<p>O carrinho está vazio.</p>';
    return;
  }

  let total = 0;
  carrinho.forEach(item => {
    total += item.price * item.quantidade;
    const p = document.createElement('p');
    p.textContent = `${item.title} x${item.quantidade} - €${(item.price * item.quantidade).toFixed(2)}`;
    container.appendChild(p);
  });

  const totalP = document.createElement('p');
  totalP.innerHTML = `<strong>Total: €${total.toFixed(2)}</strong>`;
  container.appendChild(totalP);
}

// ===== Finalizar Compra =====
async function finalizarCompra() {
  if (carrinho.length === 0) {
    alert('O carrinho está vazio!');
    return;
  }

  const produtosSelecionados = carrinho.map(item => item.id);
  const student = document.getElementById('student-checkbox')?.checked || false;
  const coupon = document.getElementById('coupon-input')?.value || "";

  const body = { products: produtosSelecionados, student, coupon, name: "Cliente" };

  try {
    const resposta = await fetch('https://deisishop.pythonanywhere.com/buy/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await resposta.json();

    if (resposta.ok) {
      alert(`Total: €${data.totalCost}\nReferência: ${data.reference}\n${data.example}`);
      carrinho = [];
      renderizarCarrinho();
    } else {
      alert(`Erro: ${data.error}`);
    }

  } catch (erro) {
    console.error('Erro ao finalizar compra:', erro);
    alert("Ocorreu um erro ao tentar finalizar a compra.");
  }
}
