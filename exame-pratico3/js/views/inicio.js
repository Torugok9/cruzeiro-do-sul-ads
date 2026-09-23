/* =========================================================
   Views > Início (rota "/")
   ========================================================= */
window.App = window.App || {};
App.Views = App.Views || {};

App.Views.Inicio = (function () {
  'use strict';

  var Voluntarios = App.Servicos.Voluntarios;

  function html() {
    var destaques = App.Dados.projetos.slice(0, 3);
    var atendidos = App.Dados.projetos.reduce(function (soma, projeto) {
      return soma + projeto.atendidos;
    }, 0);

    return '' +
      '<section id="quem-somos">' +
        '<h2>Quem Somos</h2>' +
        App.Parciais.imagem(App.Dados.imagens.equipe, { prioritaria: true }) +
        '<p>' +
          'A Conecta Solidária é uma ONG do terceiro setor que promove impacto social em ' +
          'comunidades carentes, atuando em três pilares: <strong>educação, saúde e geração ' +
          'de renda</strong>. Nossos valores são transparência, inclusão, sustentabilidade e ' +
          'impacto real.' +
        '</p>' +
        '<div class="estatisticas">' +
          App.Parciais.estatistica(App.Dados.projetos.length, 'projetos ativos') +
          App.Parciais.estatistica(atendidos.toLocaleString('pt-BR'), 'pessoas atendidas') +
          App.Parciais.estatistica(Voluntarios.total(), 'voluntários cadastrados aqui') +
        '</div>' +
      '</section>' +

      '<section id="projetos-destaque">' +
        '<h2>Nossos Projetos em Destaque</h2>' +
        '<p>Conheça alguns dos projetos que já transformaram vidas em nossas comunidades parceiras:</p>' +
        '<div class="projetos-grid">' +
          App.Templates.lista(destaques, App.Parciais.cardProjeto) +
        '</div>' +
        '<p class="texto-centralizado">' +
          '<a href="#/projetos" class="btn">Ver Todos os Projetos</a>' +
        '</p>' +
      '</section>' +

      '<section id="como-ajudar">' +
        '<h2>Como Você Pode Ajudar</h2>' +
        '<p>Existem várias formas de contribuir para o nosso trabalho. Escolha a que mais se adequa a você:</p>' +
        '<h3>1. Seja um Voluntário</h3>' +
        '<p>Dedique seu tempo e habilidades para projetos que transformam vidas. Você pode atuar ' +
          'em educação, saúde, administrativo e muito mais!</p>' +
        '<h3>2. Faça uma Doação</h3>' +
        '<p>Recursos financeiros nos permitem expandir nossas iniciativas. Toda doação, por menor ' +
          'que seja, faz diferença.</p>' +
        '<h3>3. Seja um Parceiro Empresarial</h3>' +
        '<p>Empresas podem se tornar parceiras estratégicas em nossos projetos, gerando impacto ' +
          'social compartilhado.</p>' +
        '<div class="texto-centralizado">' +
          '<a href="#/cadastro" class="btn">Quero Ser Voluntário</a>' +
          '<button type="button" class="btn" data-acao="doar">Fazer uma Doação</button>' +
        '</div>' +
      '</section>' +

      '<section id="contato">' +
        '<h2>Entre em Contato</h2>' +
        '<p>Tem dúvidas? Quer saber mais sobre nossos projetos? Fale conosco!</p>' +
        '<address>' +
          '<strong>Conecta Solidária</strong><br>' +
          '📍 Rua do Voluntariado, 123 - São Paulo, SP<br>' +
          '📧 <a href="mailto:contato@conectasolidaria.org">contato@conectasolidaria.org</a><br>' +
          '📞 <a href="tel:+551133334444">(11) 3333-4444</a>' +
        '</address>' +
      '</section>';
  }

  function montar(container) {
    App.Dom.delegar(container, 'click', '[data-acao="doar"]', function () {
      App.UI.Modal.abrir({
        titulo: '💜 Obrigado por ajudar!',
        mensagem: 'Sua doação transforma vidas em nossas comunidades parceiras. ' +
          'Confirme para receber por e-mail as formas de contribuição.',
        textoConfirmar: 'Confirmar doação',
        aoConfirmar: function () {
          App.UI.Notificacoes.sucesso('Recebemos seu interesse em doar. Obrigado!');
        }
      });
    });
  }

  return {
    titulo: 'Início',
    html: html,
    montar: montar
  };
})();
