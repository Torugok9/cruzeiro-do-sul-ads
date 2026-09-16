/* =========================================================
   Serviços > Voluntários
   Regras de negócio do cadastro. As views nunca falam com o
   localStorage diretamente: passam por aqui.
   ========================================================= */
window.App = window.App || {};
App.Servicos = App.Servicos || {};

App.Servicos.Voluntarios = (function () {
  'use strict';

  var CHAVE = 'voluntarios';
  var CHAVE_RASCUNHO = 'rascunho-cadastro';

  function gerarId() {
    return 'vol-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function listar() {
    var lista = App.Store.ler(CHAVE, []);
    return Array.isArray(lista) ? lista : [];
  }

  function total() {
    return listar().length;
  }

  function salvar(dados) {
    var lista = listar();
    var registro = Object.assign({}, dados, {
      id: gerarId(),
      criadoEm: new Date().toISOString()
    });

    lista.unshift(registro); // mais recentes primeiro
    App.Store.gravar(CHAVE, lista);
    return registro;
  }

  function remover(id) {
    var lista = listar().filter(function (voluntario) {
      return voluntario.id !== id;
    });
    App.Store.gravar(CHAVE, lista);
    return lista;
  }

  function limpar() {
    App.Store.remover(CHAVE);
  }

  function buscarPorId(id) {
    return listar().filter(function (voluntario) {
      return voluntario.id === id;
    })[0] || null;
  }

  /* Impede dois cadastros com o mesmo CPF. */
  function cpfJaCadastrado(cpf) {
    var numeros = App.Formularios.Validacao.apenasDigitos(cpf);
    return listar().some(function (voluntario) {
      return App.Formularios.Validacao.apenasDigitos(voluntario.cpf) === numeros;
    });
  }

  /* Filtra a lista por texto livre (nome, e-mail ou cidade)
     e, opcionalmente, por área de interesse. */
  function filtrar(termo, area) {
    var busca = String(termo || '').trim().toLowerCase();

    return listar().filter(function (voluntario) {
      var combinaArea = !area || area === 'todas' || voluntario.area === area;
      if (!combinaArea) return false;
      if (!busca) return true;

      return [voluntario.nome, voluntario.email, voluntario.cidade]
        .join(' ')
        .toLowerCase()
        .indexOf(busca) !== -1;
    });
  }

  function ordenar(lista, criterio) {
    var copia = lista.slice();

    if (criterio === 'nome') {
      return copia.sort(function (a, b) {
        return String(a.nome).localeCompare(String(b.nome), 'pt-BR');
      });
    }

    return copia.sort(function (a, b) {
      return String(b.criadoEm).localeCompare(String(a.criadoEm));
    });
  }

  function contarPorArea() {
    return listar().reduce(function (contagem, voluntario) {
      contagem[voluntario.area] = (contagem[voluntario.area] || 0) + 1;
      return contagem;
    }, {});
  }

  /* ---------- rascunho do formulário ---------- */

  function salvarRascunho(valores) {
    App.Store.gravar(CHAVE_RASCUNHO, {
      valores: valores,
      salvoEm: new Date().toISOString()
    });
  }

  function lerRascunho() {
    return App.Store.ler(CHAVE_RASCUNHO, null);
  }

  function limparRascunho() {
    App.Store.remover(CHAVE_RASCUNHO);
  }

  return {
    listar: listar,
    total: total,
    salvar: salvar,
    remover: remover,
    limpar: limpar,
    buscarPorId: buscarPorId,
    cpfJaCadastrado: cpfJaCadastrado,
    filtrar: filtrar,
    ordenar: ordenar,
    contarPorArea: contarPorArea,
    salvarRascunho: salvarRascunho,
    lerRascunho: lerRascunho,
    limparRascunho: limparRascunho
  };
})();
