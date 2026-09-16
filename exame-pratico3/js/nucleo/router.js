/* =========================================================
   Núcleo > Router (navegação da SPA)
   Roteador baseado no hash da URL (#/projetos, #/cadastro...).

   Cada rota aponta para uma "view", que é um objeto com:
     { titulo, html(params), montar(container, params) }

   O router troca apenas o conteúdo de #app, sem recarregar a
   página, e aceita parâmetros dinâmicos (ex.: /projetos/:id).
   ========================================================= */
window.App = window.App || {};

App.Router = (function () {
  'use strict';

  var rotas = [];
  var viewNaoEncontrada = null;
  var container = null;
  var ouvintes = [];
  var TITULO_BASE = 'Conecta Solidária';

  /* ---------- registro de rotas ---------- */

  function registrar(padrao, view) {
    rotas.push({
      padrao: padrao,
      partes: padrao.split('/').filter(Boolean),
      view: view
    });
  }

  function definirNaoEncontrada(view) {
    viewNaoEncontrada = view;
  }

  /* Permite que outros módulos reajam a cada navegação
     (fechar o menu, por exemplo) sem acoplar o router a eles. */
  function aoNavegar(funcao) {
    ouvintes.push(funcao);
  }

  /* ---------- leitura e comparação do caminho ---------- */

  function caminhoAtual() {
    var hash = window.location.hash.replace(/^#/, '');
    return hash.charAt(0) === '/' ? hash : '/';
  }

  /* Compara o caminho com cada rota registrada e extrai os
     parâmetros dinâmicos (as partes que começam com ":"). */
  function combinar(caminho) {
    var partes = caminho.split('/').filter(Boolean);

    for (var i = 0; i < rotas.length; i++) {
      var rota = rotas[i];
      if (rota.partes.length !== partes.length) continue;

      var params = {};
      var combina = true;

      for (var j = 0; j < rota.partes.length; j++) {
        var esperado = rota.partes[j];
        if (esperado.charAt(0) === ':') {
          params[esperado.slice(1)] = decodeURIComponent(partes[j]);
        } else if (esperado !== partes[j]) {
          combina = false;
          break;
        }
      }

      if (combina) return { view: rota.view, params: params };
    }

    return null;
  }

  /* ---------- navegação ---------- */

  function navegar(caminho) {
    if (caminhoAtual() === caminho) {
      renderizar(); // mesma rota: redesenha na mão (não há hashchange)
      return;
    }
    window.location.hash = caminho;
  }

  function renderizar() {
    if (!container) return;

    var caminho = caminhoAtual();
    var encontrada = combinar(caminho);
    var view = encontrada ? encontrada.view : viewNaoEncontrada;
    var params = encontrada ? encontrada.params : {};

    if (!view) {
      console.error('Nenhuma view para "' + caminho + '" e nenhuma rota 404 definida.');
      return;
    }

    document.title = (view.titulo ? view.titulo + ' | ' : '') + TITULO_BASE;

    /* Cada rota ganha um elemento novo. Assim os eventos que a
       view registrar morrem junto com ela, sem acumular a cada
       visita (o #app é permanente, o palco não). */
    var palco = document.createElement('div');
    palco.className = 'view';
    palco.innerHTML = view.html(params);

    container.innerHTML = '';
    container.appendChild(palco);

    if (typeof view.montar === 'function') {
      view.montar(palco, params);
    }

    /* Força o cálculo do layout antes de trocar a classe para
       que a animação de entrada realmente aconteça. */
    void palco.offsetWidth;
    palco.classList.add('view--visivel');

    marcarLinkAtivo(caminho);
    window.scrollTo(0, 0);

    ouvintes.forEach(function (ouvinte) {
      ouvinte(caminho, params);
    });
  }

  /* Destaca no menu o link da rota aberta. */
  function marcarLinkAtivo(caminho) {
    App.Dom.selecionarTodos('nav a[href^="#/"]').forEach(function (link) {
      var destino = link.getAttribute('href').slice(1);
      var ativo = destino === '/'
        ? caminho === '/'
        : caminho === destino || caminho.indexOf(destino + '/') === 0;

      if (ativo) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function iniciar(opcoes) {
    container = opcoes.container;
    window.addEventListener('hashchange', renderizar);

    if (!window.location.hash) {
      window.location.hash = '/'; // dispara o hashchange, que renderiza
      return;
    }
    renderizar();
  }

  return {
    registrar: registrar,
    definirNaoEncontrada: definirNaoEncontrada,
    aoNavegar: aoNavegar,
    navegar: navegar,
    caminhoAtual: caminhoAtual,
    iniciar: iniciar
  };
})();
