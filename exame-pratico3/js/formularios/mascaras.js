/* =========================================================
   Formulários > Máscaras
   Formata CPF, telefone e CEP enquanto o usuário digita.
   As funções são puras (texto entra, texto formatado sai) e a
   função "aplicar" liga a máscara a um campo do formulário.
   ========================================================= */
window.App = window.App || {};
App.Formularios = App.Formularios || {};

App.Formularios.Mascaras = (function () {
  'use strict';

  function apenasDigitos(valor) {
    return String(valor || '').replace(/\D/g, '');
  }

  function cpf(valor) {
    return apenasDigitos(valor)
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function telefone(valor) {
    var numeros = apenasDigitos(valor).slice(0, 11);
    if (numeros.length <= 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numeros
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  function cep(valor) {
    return apenasDigitos(valor)
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  var formatadores = {
    cpf: cpf,
    telefone: telefone,
    cep: cep
  };

  /* Liga a máscara ao evento input do campo. */
  function aplicar(campo, tipo) {
    var formatar = formatadores[tipo];
    if (!campo || !formatar) return;

    campo.addEventListener('input', function () {
      campo.value = formatar(campo.value);
    });
  }

  return {
    cpf: cpf,
    telefone: telefone,
    cep: cep,
    aplicar: aplicar
  };
})();
