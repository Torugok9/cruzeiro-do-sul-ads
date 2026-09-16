/* =========================================================
   UI > Menu
   Menu responsivo controlado por JavaScript. No Exame 2 ele
   dependia de um checkbox escondido (que não recebia foco do
   teclado); agora é um <button> com aria-expanded.
   ========================================================= */
window.App = window.App || {};
App.UI = App.UI || {};

App.UI.Menu = (function () {
  'use strict';

  var botao = null;
  var menu = null;

  function iniciar() {
    botao = App.Dom.selecionar('#botao-menu');
    menu = App.Dom.selecionar('#menu-principal');
    if (!botao || !menu) return;

    botao.addEventListener('click', alternar);

    /* Clicar em qualquer link do menu fecha o painel no celular. */
    App.Dom.delegar(menu, 'click', 'a', fechar);

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') fechar();
    });
  }

  function alternar() {
    if (menu.classList.contains('menu--aberto')) {
      fechar();
    } else {
      abrir();
    }
  }

  function abrir() {
    if (!menu) return;
    menu.classList.add('menu--aberto');
    botao.setAttribute('aria-expanded', 'true');
  }

  function fechar() {
    if (!menu) return;
    menu.classList.remove('menu--aberto');
    botao.setAttribute('aria-expanded', 'false');
  }

  return {
    iniciar: iniciar,
    abrir: abrir,
    fechar: fechar
  };
})();
