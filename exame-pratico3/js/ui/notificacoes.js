/* =========================================================
   UI > Notificações (toasts)
   Avisos rápidos no canto da tela, criados e removidos
   dinamicamente no DOM.
   ========================================================= */
window.App = window.App || {};
App.UI = App.UI || {};

App.UI.Notificacoes = (function () {
  'use strict';

  var DURACAO_PADRAO = 4000;
  var ICONES = {
    sucesso: '✅',
    erro: '⛔',
    aviso: '⚠️',
    info: 'ℹ️'
  };

  function regiao() {
    return App.Dom.selecionar('#regiao-toasts');
  }

  function mostrar(mensagem, tipo, duracao) {
    var area = regiao();
    if (!area) return null;

    var estilo = ICONES[tipo] ? tipo : 'info';
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + estilo;
    toast.innerHTML =
      '<span class="toast__icone" aria-hidden="true">' + ICONES[estilo] + '</span>' +
      '<span class="toast__texto">' + App.Templates.escapar(mensagem) + '</span>' +
      '<button type="button" class="toast__fechar" aria-label="Fechar notificação">✕</button>';

    area.appendChild(toast);
    void toast.offsetWidth; // reflow: garante a transição de entrada
    toast.classList.add('toast--visivel');

    var temporizador = setTimeout(fechar, duracao || DURACAO_PADRAO);

    toast.querySelector('.toast__fechar').addEventListener('click', fechar);

    function fechar() {
      clearTimeout(temporizador);
      toast.classList.remove('toast--visivel');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }

    return { fechar: fechar };
  }

  return {
    mostrar: mostrar,
    sucesso: function (mensagem, duracao) { return mostrar(mensagem, 'sucesso', duracao); },
    erro: function (mensagem, duracao) { return mostrar(mensagem, 'erro', duracao); },
    aviso: function (mensagem, duracao) { return mostrar(mensagem, 'aviso', duracao); },
    info: function (mensagem, duracao) { return mostrar(mensagem, 'info', duracao); }
  };
})();
