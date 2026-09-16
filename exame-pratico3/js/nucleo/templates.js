/* =========================================================
   Núcleo > Sistema de templates
   Mini motor de templates escrito em JavaScript puro.

   Sintaxe aceita:
     {{ campo }}        -> valor com escape de HTML (seguro)
     {{ pessoa.nome }}  -> caminho com ponto
     {{& html }}        -> valor inserido sem escape (HTML já pronto)

   Também guarda templates reutilizáveis (parciais) por nome.
   ========================================================= */
window.App = window.App || {};

App.Templates = (function () {
  'use strict';

  var registrados = {};
  var EXPRESSAO = /\{\{\s*(&?)\s*([\w.]+)\s*\}\}/g;

  /* Converte caracteres perigosos em entidades HTML.
     Protege contra conteúdo digitado pelo usuário que
     contenha tags (ex.: <script>). */
  function escapar(valor) {
    if (valor === null || valor === undefined) return '';
    return String(valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* Lê "pessoa.endereco.cidade" dentro do objeto de dados. */
  function valorDe(dados, caminho) {
    return caminho.split('.').reduce(function (atual, chave) {
      return atual === null || atual === undefined ? undefined : atual[chave];
    }, dados);
  }

  /* Substitui os marcadores do template pelos dados. */
  function render(template, dados) {
    var contexto = dados || {};
    return String(template).replace(EXPRESSAO, function (_marcador, bruto, caminho) {
      var valor = valorDe(contexto, caminho);
      if (valor === undefined || valor === null) return '';
      return bruto ? String(valor) : escapar(valor);
    });
  }

  /* Monta uma lista de itens e junta tudo numa string só.
     Usado com {{& lista }} dentro de outro template. */
  function lista(itens, montarItem) {
    if (!itens || !itens.length) return '';
    return itens.map(montarItem).join('');
  }

  /* Guarda um template reutilizável (parcial). */
  function registrar(nome, template) {
    registrados[nome] = template;
  }

  /* Renderiza um parcial registrado. */
  function usar(nome, dados) {
    if (!registrados[nome]) {
      throw new Error('Template não registrado: ' + nome);
    }
    return render(registrados[nome], dados);
  }

  return {
    render: render,
    lista: lista,
    registrar: registrar,
    usar: usar,
    escapar: escapar
  };
})();
