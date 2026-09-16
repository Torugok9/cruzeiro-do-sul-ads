/* =========================================================
   Núcleo > DOM
   Pequenos atalhos para selecionar elementos e registrar
   eventos. Centralizar isso evita repetir document.querySelector
   em todos os módulos da aplicação.
   ========================================================= */
window.App = window.App || {};

App.Dom = (function () {
  'use strict';

  /* Retorna o primeiro elemento que casa com o seletor. */
  function selecionar(seletor, contexto) {
    return (contexto || document).querySelector(seletor);
  }

  /* Retorna um array (e não NodeList) com todos os elementos. */
  function selecionarTodos(seletor, contexto) {
    return Array.prototype.slice.call((contexto || document).querySelectorAll(seletor));
  }

  /* Delegação de eventos: escuta no elemento pai e só executa
     quando o alvo do evento estiver dentro de "seletor".
     Assim a view continua funcionando mesmo quando o conteúdo
     é recriado dinamicamente. */
  function delegar(elemento, evento, seletor, manipulador) {
    elemento.addEventListener(evento, function (evt) {
      var alvo = evt.target.closest(seletor);
      if (alvo && elemento.contains(alvo)) {
        manipulador.call(alvo, evt, alvo);
      }
    });
  }

  /* Atrasa a execução de uma função (usado na busca e no
     salvamento automático do rascunho). */
  function adiar(funcao, espera) {
    var temporizador = null;
    return function () {
      var contexto = this;
      var argumentos = arguments;
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        funcao.apply(contexto, argumentos);
      }, espera || 300);
    };
  }

  return {
    selecionar: selecionar,
    selecionarTodos: selecionarTodos,
    delegar: delegar,
    adiar: adiar
  };
})();
