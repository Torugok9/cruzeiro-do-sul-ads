/* =========================================================
   UI > Modal
   Janela sobreposta controlada por JavaScript. No Exame 2 ela
   dependia do seletor :target; agora abre por evento, fecha com
   Esc ou clique no fundo e devolve o foco para quem a abriu.
   ========================================================= */
window.App = window.App || {};
App.UI = App.UI || {};

App.UI.Modal = (function () {
  'use strict';

  var aberto = null;
  var elementoAnterior = null;

  function regiao() {
    return App.Dom.selecionar('#regiao-modal');
  }

  /* opcoes: { titulo, mensagem, textoConfirmar, textoCancelar,
               perigo, aoConfirmar } */
  function abrir(opcoes) {
    var area = regiao();
    if (!area) return;

    fechar(); // nunca deixa dois modais abertos
    elementoAnterior = document.activeElement;

    var config = opcoes || {};
    var textoConfirmar = config.textoConfirmar || 'Confirmar';
    var classeConfirmar = config.perigo ? 'botao-remover' : 'btn';

    var caixa = document.createElement('div');
    caixa.className = 'modal';
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-modal', 'true');
    caixa.setAttribute('aria-labelledby', 'modal-titulo');
    caixa.innerHTML =
      '<div class="modal__caixa">' +
        '<button type="button" class="modal__fechar" aria-label="Fechar janela">✕</button>' +
        '<h3 id="modal-titulo">' + App.Templates.escapar(config.titulo || 'Atenção') + '</h3>' +
        '<p>' + App.Templates.escapar(config.mensagem || '') + '</p>' +
        '<div class="modal__acoes">' +
          '<button type="button" class="' + classeConfirmar + '" data-acao="confirmar">' +
            App.Templates.escapar(textoConfirmar) +
          '</button>' +
          '<button type="button" class="botao-secundario" data-acao="cancelar">' +
            App.Templates.escapar(config.textoCancelar || 'Cancelar') +
          '</button>' +
        '</div>' +
      '</div>';

    area.appendChild(caixa);
    void caixa.offsetWidth; // reflow: garante a transição de entrada
    caixa.classList.add('modal--aberto');

    aberto = caixa;

    caixa.querySelector('[data-acao="confirmar"]').addEventListener('click', function () {
      fechar();
      if (typeof config.aoConfirmar === 'function') config.aoConfirmar();
    });
    caixa.querySelector('[data-acao="cancelar"]').addEventListener('click', fechar);
    caixa.querySelector('.modal__fechar').addEventListener('click', fechar);

    /* Clique no fundo escuro (fora da caixa) também fecha. */
    caixa.addEventListener('click', function (evento) {
      if (evento.target === caixa) fechar();
    });

    document.addEventListener('keydown', aoTeclar);
    caixa.querySelector('[data-acao="confirmar"]').focus();
  }

  function aoTeclar(evento) {
    if (evento.key === 'Escape') fechar();
  }

  function fechar() {
    if (!aberto) return;

    var caixa = aberto;
    aberto = null;
    document.removeEventListener('keydown', aoTeclar);
    caixa.classList.remove('modal--aberto');

    setTimeout(function () {
      if (caixa.parentNode) caixa.parentNode.removeChild(caixa);
    }, 300);

    if (elementoAnterior && typeof elementoAnterior.focus === 'function') {
      elementoAnterior.focus();
      elementoAnterior = null;
    }
  }

  return {
    abrir: abrir,
    fechar: fechar
  };
})();
