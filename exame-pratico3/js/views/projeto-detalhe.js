/* =========================================================
   Views > Detalhe do projeto (rota "/projetos/:id")
   Mostra como o router entrega parâmetros dinâmicos para a view.
   ========================================================= */
window.App = window.App || {};
App.Views = App.Views || {};

App.Views.ProjetoDetalhe = (function () {
  'use strict';

  function html(params) {
    var projeto = App.Dados.buscarProjeto(params.id);

    if (!projeto) {
      return '' +
        '<section>' +
          '<h2>Projeto não encontrado</h2>' +
          App.Parciais.alerta({
            tipo: 'erro',
            titulo: 'Ops!',
            mensagem: 'Não existe um projeto com o endereço "' +
              App.Templates.escapar(params.id) + '".'
          }) +
          '<p class="texto-centralizado"><a class="btn" href="#/projetos">Ver todos os projetos</a></p>' +
        '</section>';
    }

    var paragrafos = App.Templates.lista(projeto.descricao, function (paragrafo) {
      return '<p>' + App.Templates.escapar(paragrafo) + '</p>';
    });

    return App.Templates.render('' +
      '<section>' +
        '<p class="migalhas"><a href="#/projetos">← Voltar para os projetos</a></p>' +
        '<h2>{{ emoji }} {{ titulo }}</h2>' +
        '<span class="badge badge--{{ area }}">{{ rotuloArea }}</span>' +
        '{{& foto }}' +
        '{{& paragrafos }}' +
        '<p><strong>Objetivo:</strong> {{ objetivo }}</p>' +
        '<div class="estatisticas">' +
          '{{& estatisticas }}' +
        '</div>' +
        '<div class="texto-centralizado">' +
          '<a href="#/cadastro" class="btn">Quero ajudar neste projeto</a>' +
        '</div>' +
      '</section>',
      Object.assign({}, projeto, {
        rotuloArea: App.Dados.rotuloArea(projeto.area),
        paragrafos: paragrafos,
        foto: App.Parciais.imagem(projeto.imagem, { prioritaria: true }),
        estatisticas:
          App.Parciais.estatistica(projeto.voluntarios, 'voluntários na equipe') +
          App.Parciais.estatistica(projeto.atendidos.toLocaleString('pt-BR'), 'pessoas atendidas') +
          App.Parciais.estatistica('desde ' + projeto.desde, 'em atividade')
      }));
  }

  /* O router define o título antes de renderizar; aqui
     ajustamos para o nome do projeto aberto. */
  function montar(_container, params) {
    var projeto = App.Dados.buscarProjeto(params.id);
    if (projeto) {
      document.title = projeto.titulo + ' | Conecta Solidária';
    }
  }

  return {
    titulo: 'Projeto',
    html: html,
    montar: montar
  };
})();
