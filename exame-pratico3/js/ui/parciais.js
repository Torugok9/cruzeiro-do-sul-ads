/* =========================================================
   UI > Parciais
   Templates reutilizados por mais de uma view. Ficam
   registrados no sistema de templates e são chamados com
   App.Templates.usar('nome', dados).
   ========================================================= */
window.App = window.App || {};

(function () {
  'use strict';

  /* Cartão de projeto (usado no início e na lista de projetos). */
  App.Templates.registrar('card-projeto',
    '<article class="projeto-card" data-area="{{ area }}">' +
      '<a class="projeto-card__link" href="#/projetos/{{ id }}">' +
        '<h3>{{ emoji }} {{ titulo }}</h3>' +
      '</a>' +
      '<span class="badge badge--{{ area }}">{{ rotuloArea }}</span>' +
      '<p>{{ resumo }}</p>' +
      '<a class="link-acao" href="#/projetos/{{ id }}">Ver detalhes do projeto →</a>' +
    '</article>');

  /* Caixa de aviso contextual. */
  App.Templates.registrar('alerta',
    '<div class="alerta alerta--{{ tipo }}" role="{{ papel }}">' +
      '<strong>{{ titulo }}</strong> {{ mensagem }}' +
      '{{& acoes }}' +
    '</div>');

  /* Cartão de voluntário cadastrado. */
  App.Templates.registrar('card-voluntario',
    '<article class="voluntario" data-id="{{ id }}">' +
      '<header class="voluntario__topo">' +
        '<h3 class="voluntario__nome">{{ nome }}</h3>' +
        '<span class="badge badge--{{ area }}">{{ rotuloArea }}</span>' +
      '</header>' +
      '<dl class="voluntario__dados">' +
        '<dt>E-mail</dt><dd>{{ email }}</dd>' +
        '<dt>Telefone</dt><dd>{{ telefone }}</dd>' +
        '<dt>Cidade</dt><dd>{{ cidade }} / {{ estado }}</dd>' +
        '<dt>Disponibilidade</dt><dd>{{ rotuloDisponibilidade }}</dd>' +
        '<dt>Cadastro</dt><dd>{{ cadastradoEm }}</dd>' +
      '</dl>' +
      '<button type="button" class="botao-remover" data-acao="remover" data-id="{{ id }}">' +
        'Remover cadastro' +
      '</button>' +
    '</article>');

  /* Campo de texto do formulário, com rótulo e área de erro. */
  App.Templates.registrar('campo-texto',
    '<div class="campo" data-campo="{{ nome }}">' +
      '<label for="{{ nome }}">{{ rotulo }}{{ marcaObrigatorio }}</label>' +
      '<input type="{{ tipo }}" id="{{ nome }}" name="{{ nome }}"' +
        ' autocomplete="{{ autocomplete }}" inputmode="{{ inputmode }}"' +
        ' placeholder="{{ placeholder }}" maxlength="{{ maximo }}"' +
        ' aria-describedby="erro-{{ nome }}">' +
      '<p class="campo__erro" id="erro-{{ nome }}"></p>' +
    '</div>');

  /* Bloco de estatística exibido na página inicial. */
  App.Templates.registrar('estatistica',
    '<div class="estatistica">' +
      '<strong class="estatistica__numero">{{ numero }}</strong>' +
      '<span class="estatistica__rotulo">{{ rotulo }}</span>' +
    '</div>');

  /* Atalhos com valores padrão, para as views não repetirem
     campos opcionais em toda chamada. */
  App.Parciais = {
    cardProjeto: function (projeto) {
      return App.Templates.usar('card-projeto', Object.assign({}, projeto, {
        rotuloArea: App.Dados.rotuloArea(projeto.area)
      }));
    },

    alerta: function (opcoes) {
      return App.Templates.usar('alerta', {
        tipo: opcoes.tipo || 'info',
        papel: opcoes.tipo === 'erro' ? 'alert' : 'status',
        titulo: opcoes.titulo || '',
        mensagem: opcoes.mensagem || '',
        acoes: opcoes.acoes || ''
      });
    },

    campoTexto: function (config) {
      return App.Templates.usar('campo-texto', {
        nome: config.nome,
        rotulo: config.rotulo,
        marcaObrigatorio: config.opcional ? '' : ' *',
        tipo: config.tipo || 'text',
        autocomplete: config.autocomplete || 'off',
        inputmode: config.inputmode || 'text',
        placeholder: config.placeholder || '',
        maximo: config.maximo || 120
      });
    },

    estatistica: function (numero, rotulo) {
      return App.Templates.usar('estatistica', { numero: numero, rotulo: rotulo });
    }
  };
})();
