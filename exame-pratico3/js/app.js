/* =========================================================
   App
   Ponto de entrada da SPA: liga os módulos, registra as rotas
   e inicia o roteador.
   ========================================================= */
(function () {
  'use strict';

  function iniciar() {
    App.UI.Menu.iniciar();

    /* Mapa de rotas -> views */
    App.Router.registrar('/', App.Views.Inicio);
    App.Router.registrar('/projetos', App.Views.Projetos);
    App.Router.registrar('/projetos/:id', App.Views.ProjetoDetalhe);
    App.Router.registrar('/cadastro', App.Views.Cadastro);
    App.Router.registrar('/voluntarios', App.Views.Voluntarios);
    App.Router.registrar('/componentes', App.Views.Componentes);
    App.Router.definirNaoEncontrada(App.Views.NaoEncontrada);

    /* Ao trocar de tela, o menu do celular se fecha. */
    App.Router.aoNavegar(function () {
      App.UI.Menu.fechar();
    });

    App.Router.iniciar({ container: App.Dom.selecionar('#app') });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
