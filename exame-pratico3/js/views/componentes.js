/* =========================================================
   Views > Componentes (rota "/componentes")
   Guia de componentes do Exame 2, agora interativo: os alertas,
   toasts e o modal são criados por JavaScript.
   ========================================================= */
window.App = window.App || {};
App.Views = App.Views || {};

App.Views.Componentes = (function () {
  'use strict';

  var EXEMPLOS_ALERTA = {
    sucesso: { titulo: 'Sucesso!', mensagem: 'Seu cadastro de voluntário foi enviado.' },
    erro: { titulo: 'Erro!', mensagem: 'Verifique os campos obrigatórios do formulário.' },
    aviso: { titulo: 'Atenção!', mensagem: 'Sua doação está sendo processada.' },
    info: { titulo: 'Informação:', mensagem: 'Novos projetos serão divulgados em breve.' }
  };

  function html() {
    var badges = App.Dados.areas.map(function (area) {
      return '<span class="badge badge--' + area.valor + '">' + area.rotulo + '</span>';
    }).join('');

    var botoesAlerta = Object.keys(EXEMPLOS_ALERTA).map(function (tipo) {
      return '<button type="button" class="botao-secundario" data-alerta="' + tipo + '">' +
        tipo + '</button>';
    }).join('');

    var botoesToast = Object.keys(EXEMPLOS_ALERTA).map(function (tipo) {
      return '<button type="button" class="botao-secundario" data-toast="' + tipo + '">' +
        tipo + '</button>';
    }).join('');

    return '' +
      '<section id="badges">' +
        '<h2>Badges (etiquetas de categoria)</h2>' +
        '<p>Usados para categorizar projetos e cadastros por área de atuação:</p>' +
        '<p class="amostra">' + badges +
          '<span class="badge badge--sucesso">Ativo</span>' +
          '<span class="badge badge--erro">Encerrado</span>' +
          '<span class="badge badge--neutro">Rascunho</span>' +
        '</p>' +
      '</section>' +

      '<section id="alertas">' +
        '<h2>Alertas contextuais</h2>' +
        '<p>Clique em um tipo para gerar a caixa de aviso no DOM:</p>' +
        '<p class="amostra">' + botoesAlerta + '</p>' +
        '<div id="area-alerta"></div>' +
      '</section>' +

      '<section id="toasts">' +
        '<h2>Toasts (notificações não obstrutivas)</h2>' +
        '<p>Aparecem no canto da tela e somem sozinhos depois de alguns segundos:</p>' +
        '<p class="amostra">' + botoesToast + '</p>' +
      '</section>' +

      '<section id="modal-demo">' +
        '<h2>Modal de confirmação</h2>' +
        '<p>Janela sobreposta que fecha com Esc, com clique no fundo ou nos botões:</p>' +
        '<p class="amostra">' +
          '<button type="button" class="btn" data-acao="abrir-modal">Fazer uma doação</button>' +
        '</p>' +
      '</section>' +

      '<section id="botoes">' +
        '<h2>Estados de botão</h2>' +
        '<p>Mesmo componente em situações diferentes:</p>' +
        '<p class="amostra">' +
          '<button type="button">Normal</button>' +
          '<button type="button" class="botao-secundario">Secundário</button>' +
          '<button type="button" class="botao-remover">Perigo</button>' +
          '<button type="button" disabled>Desativado</button>' +
        '</p>' +
      '</section>';
  }

  function montar(container) {
    var areaAlerta = App.Dom.selecionar('#area-alerta', container);

    App.Dom.delegar(container, 'click', '[data-alerta]', function (_evento, botao) {
      var tipo = botao.dataset.alerta;
      areaAlerta.innerHTML = App.Parciais.alerta({
        tipo: tipo,
        titulo: EXEMPLOS_ALERTA[tipo].titulo,
        mensagem: EXEMPLOS_ALERTA[tipo].mensagem
      });
    });

    App.Dom.delegar(container, 'click', '[data-toast]', function (_evento, botao) {
      var tipo = botao.dataset.toast;
      App.UI.Notificacoes.mostrar(EXEMPLOS_ALERTA[tipo].mensagem, tipo);
    });

    App.Dom.delegar(container, 'click', '[data-acao="abrir-modal"]', function () {
      App.UI.Modal.abrir({
        titulo: '💜 Obrigado por ajudar!',
        mensagem: 'Sua doação transforma vidas em nossas comunidades parceiras.',
        textoConfirmar: 'Confirmar doação',
        aoConfirmar: function () {
          App.UI.Notificacoes.sucesso('Doação confirmada. Obrigado!');
        }
      });
    });
  }

  return {
    titulo: 'Componentes',
    html: html,
    montar: montar
  };
})();
