/* =========================================================
   Views > Rota inexistente (404 da SPA)
   ========================================================= */
window.App = window.App || {};
App.Views = App.Views || {};

App.Views.NaoEncontrada = (function () {
  'use strict';

  function html() {
    return '' +
      '<section>' +
        '<h2>Página não encontrada</h2>' +
        App.Parciais.alerta({
          tipo: 'aviso',
          titulo: 'Endereço inválido:',
          mensagem: 'não existe nada em "#' + App.Templates.escapar(App.Router.caminhoAtual()) + '".'
        }) +
        '<p class="texto-centralizado">' +
          '<a class="btn" href="#/">Voltar para o início</a>' +
          '<a class="btn" href="#/projetos">Ver projetos</a>' +
        '</p>' +
      '</section>';
  }

  return {
    titulo: 'Página não encontrada',
    html: html
  };
})();
