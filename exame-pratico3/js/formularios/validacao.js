/* =========================================================
   Formulários > Validação
   Regras de validação reutilizáveis e independentes do HTML.

   Cada regra recebe o valor do campo e devolve:
     true             -> valor válido
     "mensagem"       -> valor inválido (texto exibido ao usuário)

   As regras de formato ignoram campos vazios: quem exige
   preenchimento é a regra "obrigatorio".
   ========================================================= */
window.App = window.App || {};
App.Formularios = App.Formularios || {};

App.Formularios.Validacao = (function () {
  'use strict';

  function texto(valor) {
    return valor === null || valor === undefined ? '' : String(valor).trim();
  }

  function apenasDigitos(valor) {
    return texto(valor).replace(/\D/g, '');
  }

  function vazio(valor) {
    return texto(valor) === '';
  }

  /* ---------- validação de CPF (dígitos verificadores) ---------- */
  function cpfValido(valor) {
    var numeros = apenasDigitos(valor);
    if (numeros.length !== 11 || /^([0-9])\1{10}$/.test(numeros)) return false;

    var soma = 0;
    var digito;
    var i;

    for (i = 0; i < 9; i++) soma += Number(numeros[i]) * (10 - i);
    digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;
    if (digito !== Number(numeros[9])) return false;

    soma = 0;
    for (i = 0; i < 10; i++) soma += Number(numeros[i]) * (11 - i);
    digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;
    return digito === Number(numeros[10]);
  }

  /* ---------- catálogo de regras ---------- */
  var regras = {
    obrigatorio: function (valor) {
      return !vazio(valor) || 'Campo obrigatório.';
    },

    aceite: function (valor) {
      return valor === true || 'É preciso marcar esta opção para continuar.';
    },

    minimo: function (quantidade) {
      return function (valor) {
        return vazio(valor) || texto(valor).length >= quantidade ||
          'Informe ao menos ' + quantidade + ' caracteres.';
      };
    },

    maximo: function (quantidade) {
      return function (valor) {
        return texto(valor).length <= quantidade ||
          'Use no máximo ' + quantidade + ' caracteres.';
      };
    },

    nomeCompleto: function (valor) {
      if (vazio(valor)) return true;
      return /^[A-Za-zÀ-ÿ'´`^~.-]{2,}(\s+[A-Za-zÀ-ÿ'´`^~.-]{2,})+$/.test(texto(valor)) ||
        'Informe o nome e o sobrenome.';
    },

    email: function (valor) {
      if (vazio(valor)) return true;
      return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(texto(valor)) ||
        'Informe um e-mail válido, como nome@dominio.com.';
    },

    cpf: function (valor) {
      if (vazio(valor)) return true;
      if (apenasDigitos(valor).length !== 11) return 'O CPF deve ter 11 dígitos.';
      return cpfValido(valor) || 'CPF inválido: confira os números digitados.';
    },

    telefone: function (valor) {
      if (vazio(valor)) return true;
      var numeros = apenasDigitos(valor);
      if (numeros.length < 10 || numeros.length > 11) {
        return 'Informe o DDD e o número, como (11) 98888-7777.';
      }
      if (Number(numeros.slice(0, 2)) < 11) return 'DDD inválido.';
      return true;
    },

    cep: function (valor) {
      if (vazio(valor)) return true;
      return apenasDigitos(valor).length === 8 || 'O CEP deve ter 8 dígitos.';
    },

    idadeMinima: function (anos) {
      return function (valor) {
        if (vazio(valor)) return true;

        var partes = texto(valor).split('-');
        var nascimento = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
        if (isNaN(nascimento.getTime())) return 'Data inválida.';

        var hoje = new Date();
        if (nascimento > hoje) return 'A data não pode estar no futuro.';

        var idade = hoje.getFullYear() - nascimento.getFullYear();
        var aniversarioPassou =
          hoje.getMonth() > nascimento.getMonth() ||
          (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());
        if (!aniversarioPassou) idade--;

        if (idade > 120) return 'Confira o ano de nascimento.';
        return idade >= anos || 'É preciso ter pelo menos ' + anos + ' anos para se voluntariar.';
      };
    }
  };

  /* ---------- execução ---------- */

  /* Roda a lista de regras de um campo e para na primeira falha. */
  function validarCampo(valor, listaDeRegras) {
    for (var i = 0; i < listaDeRegras.length; i++) {
      var resultado = listaDeRegras[i](valor);
      if (resultado !== true) return resultado;
    }
    return null;
  }

  /* Valida o formulário inteiro a partir de um esquema:
       { nome: [regras.obrigatorio, regras.minimo(3)], ... }
     Devolve { valido, erros: { campo: "mensagem" } }. */
  function validarFormulario(valores, esquema) {
    var erros = {};

    Object.keys(esquema).forEach(function (campo) {
      var mensagem = validarCampo(valores[campo], esquema[campo]);
      if (mensagem) erros[campo] = mensagem;
    });

    return {
      valido: Object.keys(erros).length === 0,
      erros: erros
    };
  }

  return {
    regras: regras,
    validarCampo: validarCampo,
    validarFormulario: validarFormulario,
    cpfValido: cpfValido,
    apenasDigitos: apenasDigitos
  };
})();
