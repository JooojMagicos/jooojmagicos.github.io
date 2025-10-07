
window.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById('status');

  window.handleClick = function() {
    status.textContent = 'Estado: botão clicado (click).';
  };

  window.handleDblClick = function() {
    status.textContent = 'Estado: botão duplo-clicado (dblclick).';
  };

  window.handleMouseOver = function() {
    status.textContent = 'Estado: o mouse está sobre o botão (mouseover).';
  };

  window.handleMouseOut = function() {
    status.textContent = 'Estado: o mouse saiu do botão (mouseout).';
  };

  window.handleMouseMove = function(e) {
    status.textContent = `Estado: movimento do mouse (mousemove) — coordenadas (${e.offsetX}, ${e.offsetY}).`;
  };
});
