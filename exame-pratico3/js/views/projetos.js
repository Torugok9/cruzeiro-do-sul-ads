/* =========================================================
   Views > Projetos (rota "/projetos")
   Lista com filtro por área e busca por texto, recalculando
   o DOM a cada interação do usuário.
   ========================================================= */
window.App = window.App || {};
App.Views = App.Views || {};

App.Views.Projetos = (function () {
  'use strict';

  /* Estado local da tela. */
  var estado = {
    area: 'todas',
    termo: ''
  };

  function botaoFiltro(valor, rotulo, ativo) {
    return '<button type="button" class="filtro' + (ativo ? ' filtro--ativo' : '') + '"' +
      ' data-area="' + valor + '" aria-pressed="' + (ativo ? 'true' : 'false') + '">' +
      App.Templates.escapar(rotulo) + '</button>';
  }

  function html() {
    estado = { area: 'todas', termo: '' }; // cada visita começa sem filtros

    var filtros = [botaoFiltro('todas', 'Todas as áreas', true)].concat(
      App.Dados.areas.map(function (area) {
        return botaoFiltro(area.valor, area.rotulo, false);
      })
    ).join('');

    return '' +
      '<div class="layout-grid">' +
        '<section>' +
          '<h2>Nossos projetos</h2>' +
          '<p>' +
            'Conheça as iniciativas que desenvolvemos com comunidades parceiras para promover ' +
            'oportunidades e melhorar a qualidade de vida.' +
          '</p>' +

          '<div class="filtros">' +
            '<div class="filtros__grupo" role="group" aria-label="Filtrar por área">' +
              filtros +
            '</div>' +
            '<div class="campo campo--busca">' +
              '<label for="busca-projetos">Buscar projeto</label>' +
              '<input type="search" id="busca-projetos" placeholder="Ex.: educação, horta, ENEM">' +
            '</div>' +
          '</div>' +

          '<p class="contador" id="contador-projetos" role="status"></p>' +
          '<div class="projetos-grid" id="lista-projetos"></div>' +
        '</section>' +

        '<aside>' +
          '<h2>Faça parte</h2>' +
          '<p>' +
            'Nossos projetos acontecem graças ao trabalho de voluntários e ao apoio de pessoas ' +
            'comprometidas com a transformação social.' +
          '</p>' +
          '<a href="#/cadastro" class="btn">Quero ser voluntário</a>' +
        '</aside>' +
      '</div>';
  }

  /* Aplica os filtros do estado sobre os dados. */
  function filtrar() {
    var termo = estado.termo.trim().toLowerCase();

    return App.Dados.projetos.filter(function (projeto) {
      var combinaArea = estado.area === 'todas' || projeto.area === estado.area;
      if (!combinaArea) return false;
      if (!termo) return true;

      return (projeto.titulo + ' ' + projeto.resumo + ' ' + projeto.descricao.join(' '))
        .toLowerCase()
        .indexOf(termo) !== -1;
    });
  }

  function montar(container) {
    var lista = App.Dom.selecionar('#lista-projetos', container);
    var contador = App.Dom.selecionar('#contador-projetos', container);
    var busca = App.Dom.selecionar('#busca-projetos', container);

    function desenhar() {
      var encontrados = filtrar();

      if (!encontrados.length) {
        lista.innerHTML = App.Parciais.alerta({
          tipo: 'info',
          titulo: 'Nenhum projeto encontrado.',
          mensagem: 'Tente outra palavra ou volte para "Todas as áreas".'
        });
      } else {
        lista.innerHTML = App.Templates.lista(encontrados, App.Parciais.cardProjeto);
      }

      contador.textContent = 'Mostrando ' + encontrados.length + ' de ' +
        App.Dados.projetos.length + ' projetos.';
    }

    App.Dom.delegar(container, 'click', '.filtro', function (_evento, botao) {
      estado.area = botao.dataset.area;

      App.Dom.selecionarTodos('.filtro', container).forEach(function (item) {
        var ativo = item === botao;
        item.classList.toggle('filtro--ativo', ativo);
        item.setAttribute('aria-pressed', ativo ? 'true' : 'false');
      });

      desenhar();
    });

    busca.addEventListener('input', App.Dom.adiar(function () {
      estado.termo = busca.value;
      desenhar();
    }, 250));

    desenhar();
  }

  return {
    titulo: 'Projetos',
    html: html,
    montar: montar
  };
})();
