/* =========================================================
   Views > Voluntários (rota "/voluntarios")
   Lê os cadastros gravados no localStorage e permite buscar,
   filtrar, ordenar e remover registros.
   ========================================================= */
window.App = window.App || {};
App.Views = App.Views || {};

App.Views.Voluntarios = (function () {
  'use strict';

  var Voluntarios = App.Servicos.Voluntarios;

  var DISPONIBILIDADES = {
    'semana': 'Durante a semana',
    'fim-de-semana': 'Finais de semana',
    'remoto': 'Atuação remota'
  };

  var estado = {
    termo: '',
    area: 'todas',
    ordem: 'recentes'
  };

  function html() {
    estado = { termo: '', area: 'todas', ordem: 'recentes' };

    var opcoesArea = App.Dados.areas.map(function (area) {
      return '<option value="' + area.valor + '">' + area.rotulo + '</option>';
    }).join('');

    var avisoArmazenamento = App.Store.disponivel() ? '' : App.Parciais.alerta({
      tipo: 'aviso',
      titulo: 'Armazenamento indisponível.',
      mensagem: 'Seu navegador bloqueou o localStorage, então os cadastros serão perdidos ao recarregar a página.'
    });

    return '' +
      '<section>' +
        '<h2>Voluntários cadastrados</h2>' +
        '<p>' +
          'Esta lista vem do <strong>localStorage</strong> do seu navegador: os cadastros ' +
          'continuam aqui mesmo depois de fechar a página.' +
        '</p>' +
        avisoArmazenamento +

        '<div class="filtros">' +
          '<div class="campo campo--busca">' +
            '<label for="busca-voluntarios">Buscar por nome, e-mail ou cidade</label>' +
            '<input type="search" id="busca-voluntarios" placeholder="Ex.: Maria, São Paulo">' +
          '</div>' +
          '<div class="campo">' +
            '<label for="filtro-area">Área</label>' +
            '<select id="filtro-area">' +
              '<option value="todas">Todas</option>' + opcoesArea +
            '</select>' +
          '</div>' +
          '<div class="campo">' +
            '<label for="ordem">Ordenar por</label>' +
            '<select id="ordem">' +
              '<option value="recentes">Mais recentes</option>' +
              '<option value="nome">Nome (A-Z)</option>' +
            '</select>' +
          '</div>' +
        '</div>' +

        '<div class="barra-lista">' +
          '<p class="contador" id="contador-voluntarios" role="status"></p>' +
          '<button type="button" class="botao-remover" data-acao="limpar-todos">' +
            'Apagar todos os cadastros' +
          '</button>' +
        '</div>' +

        '<div class="voluntarios-grid" id="lista-voluntarios"></div>' +
      '</section>';
  }

  function cardVoluntario(voluntario) {
    return App.Templates.usar('card-voluntario', {
      id: voluntario.id,
      nome: voluntario.nome,
      area: voluntario.area,
      rotuloArea: App.Dados.rotuloArea(voluntario.area),
      email: voluntario.email,
      telefone: voluntario.telefone,
      cidade: voluntario.cidade,
      estado: voluntario.estado,
      rotuloDisponibilidade: DISPONIBILIDADES[voluntario.disponibilidade] || 'Não informada',
      cadastradoEm: App.Views.Cadastro.formatarData(voluntario.criadoEm)
    });
  }

  function montar(container) {
    var lista = App.Dom.selecionar('#lista-voluntarios', container);
    var contador = App.Dom.selecionar('#contador-voluntarios', container);
    var busca = App.Dom.selecionar('#busca-voluntarios', container);
    var filtroArea = App.Dom.selecionar('#filtro-area', container);
    var ordem = App.Dom.selecionar('#ordem', container);
    var botaoLimpar = App.Dom.selecionar('[data-acao="limpar-todos"]', container);

    function desenhar() {
      var total = Voluntarios.total();
      var encontrados = Voluntarios.ordenar(
        Voluntarios.filtrar(estado.termo, estado.area),
        estado.ordem
      );

      botaoLimpar.hidden = total === 0;

      if (total === 0) {
        lista.innerHTML = App.Parciais.alerta({
          tipo: 'info',
          titulo: 'Nenhum voluntário cadastrado ainda.',
          mensagem: 'Preencha o formulário para ver os dados aparecerem aqui.',
          acoes: '<p><a class="btn" href="#/cadastro">Fazer o primeiro cadastro</a></p>'
        });
      } else if (!encontrados.length) {
        lista.innerHTML = App.Parciais.alerta({
          tipo: 'aviso',
          titulo: 'Nada encontrado.',
          mensagem: 'Nenhum cadastro corresponde à busca ou ao filtro selecionado.'
        });
      } else {
        lista.innerHTML = App.Templates.lista(encontrados, cardVoluntario);
      }

      contador.textContent = total === 0
        ? 'Nenhum cadastro salvo.'
        : 'Exibindo ' + encontrados.length + ' de ' + total +
          (total === 1 ? ' cadastro.' : ' cadastros.');
    }

    busca.addEventListener('input', App.Dom.adiar(function () {
      estado.termo = busca.value;
      desenhar();
    }, 250));

    filtroArea.addEventListener('change', function () {
      estado.area = filtroArea.value;
      desenhar();
    });

    ordem.addEventListener('change', function () {
      estado.ordem = ordem.value;
      desenhar();
    });

    /* Remoção individual, com confirmação em modal. */
    App.Dom.delegar(container, 'click', '[data-acao="remover"]', function (_evento, botao) {
      var voluntario = Voluntarios.buscarPorId(botao.dataset.id);
      if (!voluntario) return;

      App.UI.Modal.abrir({
        titulo: 'Remover cadastro',
        mensagem: 'Deseja remover o cadastro de ' + voluntario.nome + '? Esta ação não pode ser desfeita.',
        textoConfirmar: 'Remover',
        perigo: true,
        aoConfirmar: function () {
          Voluntarios.remover(voluntario.id);
          desenhar();
          App.UI.Notificacoes.sucesso('Cadastro removido.');
        }
      });
    });

    botaoLimpar.addEventListener('click', function () {
      App.UI.Modal.abrir({
        titulo: 'Apagar todos os cadastros',
        mensagem: 'Todos os ' + Voluntarios.total() + ' cadastros salvos neste navegador serão apagados.',
        textoConfirmar: 'Apagar tudo',
        perigo: true,
        aoConfirmar: function () {
          Voluntarios.limpar();
          desenhar();
          App.UI.Notificacoes.aviso('Todos os cadastros foram apagados.');
        }
      });
    });

    desenhar();
  }

  return {
    titulo: 'Voluntários',
    html: html,
    montar: montar
  };
})();
