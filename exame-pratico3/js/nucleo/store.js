/* =========================================================
   Núcleo > Store (localStorage)
   Camada única de acesso ao armazenamento local.

   - Converte os dados de/para JSON automaticamente.
   - Usa um prefixo para não colidir com outros sites.
   - Se o localStorage estiver bloqueado (navegação anônima,
     por exemplo), cai para uma memória temporária em vez de
     quebrar a aplicação.
   ========================================================= */
window.App = window.App || {};

App.Store = (function () {
  'use strict';

  var PREFIXO = 'conecta:';
  var memoriaTemporaria = {};
  var temLocalStorage = verificarSuporte();

  function verificarSuporte() {
    try {
      var chaveTeste = PREFIXO + '__teste__';
      window.localStorage.setItem(chaveTeste, '1');
      window.localStorage.removeItem(chaveTeste);
      return true;
    } catch (erro) {
      console.warn('localStorage indisponível; usando memória temporária.', erro);
      return false;
    }
  }

  function ler(chave, valorPadrao) {
    var bruto = temLocalStorage
      ? window.localStorage.getItem(PREFIXO + chave)
      : memoriaTemporaria[chave];

    if (bruto === null || bruto === undefined) return valorPadrao;

    try {
      return JSON.parse(bruto);
    } catch (erro) {
      console.warn('Dado corrompido em "' + chave + '"; devolvendo o padrão.', erro);
      remover(chave);
      return valorPadrao;
    }
  }

  function gravar(chave, valor) {
    var texto = JSON.stringify(valor);
    try {
      if (temLocalStorage) {
        window.localStorage.setItem(PREFIXO + chave, texto);
      } else {
        memoriaTemporaria[chave] = texto;
      }
      return true;
    } catch (erro) {
      console.error('Não foi possível gravar "' + chave + '".', erro);
      return false;
    }
  }

  function remover(chave) {
    if (temLocalStorage) {
      window.localStorage.removeItem(PREFIXO + chave);
    } else {
      delete memoriaTemporaria[chave];
    }
  }

  function disponivel() {
    return temLocalStorage;
  }

  return {
    ler: ler,
    gravar: gravar,
    remover: remover,
    disponivel: disponivel
  };
})();
