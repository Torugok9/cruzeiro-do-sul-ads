/* =========================================================
   Views > Cadastro (rota "/cadastro")
   Formulário com máscaras, validação campo a campo, resumo de
   erros, rascunho automático no localStorage e gravação final
   pelo serviço de voluntários.
   ========================================================= */
window.App = window.App || {};
App.Views = App.Views || {};

App.Views.Cadastro = (function () {
  'use strict';

  var Validacao = App.Formularios.Validacao;
  var Mascaras = App.Formularios.Mascaras;
  var Voluntarios = App.Servicos.Voluntarios;
  var regras = Validacao.regras;

  var ESTADOS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  var DISPONIBILIDADES = [
    { valor: 'semana', rotulo: 'Durante a semana' },
    { valor: 'fim-de-semana', rotulo: 'Finais de semana' },
    { valor: 'remoto', rotulo: 'Atuação remota' }
  ];

  /* Campos de texto simples, montados pelo template parcial. */
  var CAMPOS_TEXTO = [
    { nome: 'nome', rotulo: 'Nome completo', autocomplete: 'name', placeholder: 'Maria da Silva' },
    { nome: 'email', rotulo: 'E-mail', tipo: 'email', autocomplete: 'email', placeholder: 'maria@email.com' },
    { nome: 'cpf', rotulo: 'CPF', inputmode: 'numeric', placeholder: '000.000.000-00', maximo: 14 },
    { nome: 'nascimento', rotulo: 'Data de nascimento', tipo: 'date', autocomplete: 'bday' },
    { nome: 'telefone', rotulo: 'Telefone', tipo: 'tel', inputmode: 'tel', placeholder: '(11) 98888-7777', maximo: 15 }
  ];

  var CAMPOS_ENDERECO = [
    { nome: 'cep', rotulo: 'CEP', inputmode: 'numeric', autocomplete: 'postal-code', placeholder: '00000-000', maximo: 9 },
    { nome: 'endereco', rotulo: 'Rua/avenida', autocomplete: 'address-line1' },
    { nome: 'numero', rotulo: 'Número', inputmode: 'numeric', maximo: 10 },
    { nome: 'complemento', rotulo: 'Complemento', autocomplete: 'address-line2', opcional: true },
    { nome: 'cidade', rotulo: 'Cidade', autocomplete: 'address-level2' }
  ];

  /* Esquema de validação: cada campo com suas regras. */
  var ESQUEMA = {
    nome: [regras.obrigatorio, regras.minimo(3), regras.nomeCompleto],
    email: [regras.obrigatorio, regras.email],
    cpf: [regras.obrigatorio, regras.cpf],
    nascimento: [regras.obrigatorio, regras.idadeMinima(16)],
    telefone: [regras.obrigatorio, regras.telefone],
    cep: [regras.obrigatorio, regras.cep],
    endereco: [regras.obrigatorio],
    numero: [regras.obrigatorio],
    cidade: [regras.obrigatorio],
    estado: [regras.obrigatorio],
    area: [regras.obrigatorio],
    disponibilidade: [regras.obrigatorio],
    mensagem: [regras.maximo(500)],
    consentimento: [regras.aceite]
  };

  var ROTULOS = {
    nome: 'Nome completo', email: 'E-mail', cpf: 'CPF', nascimento: 'Data de nascimento',
    telefone: 'Telefone', cep: 'CEP', endereco: 'Rua/avenida', numero: 'Número',
    cidade: 'Cidade', estado: 'Estado', area: 'Área de interesse',
    disponibilidade: 'Disponibilidade', mensagem: 'Sobre você', consentimento: 'Autorização'
  };

  var CAMPOS_SALVOS = Object.keys(ESQUEMA).concat(['complemento']);

  /* ---------- template ---------- */

  function html() {
    var opcoesEstado = ESTADOS.map(function (uf) {
      return '<option value="' + uf + '">' + uf + '</option>';
    }).join('');

    var opcoesDisponibilidade = DISPONIBILIDADES.map(function (item) {
      return '<option value="' + item.valor + '">' + item.rotulo + '</option>';
    }).join('');

    var opcoesArea = App.Dados.areas.map(function (area) {
      return '<label class="opcao">' +
        '<input type="radio" name="area" value="' + area.valor + '"> ' + area.rotulo +
        '</label>';
    }).join('');

    return '' +
      '<section>' +
        '<h2>Quero ser voluntário</h2>' +
        '<p>Preencha seus dados. Nossa equipe entrará em contato para conhecer você melhor.</p>' +
        '<div id="aviso-rascunho"></div>' +
        '<div id="resumo-erros"></div>' +

        '<form id="formulario-voluntario" novalidate>' +
          '<fieldset>' +
            '<legend>Dados pessoais</legend>' +
            App.Templates.lista(CAMPOS_TEXTO, App.Parciais.campoTexto) +
          '</fieldset>' +

          '<fieldset>' +
            '<legend>Endereço</legend>' +
            App.Templates.lista(CAMPOS_ENDERECO, App.Parciais.campoTexto) +
            '<div class="campo" data-campo="estado">' +
              '<label for="estado">Estado *</label>' +
              '<select id="estado" name="estado" autocomplete="address-level1" aria-describedby="erro-estado">' +
                '<option value="">Selecione</option>' + opcoesEstado +
              '</select>' +
              '<p class="campo__erro" id="erro-estado"></p>' +
            '</div>' +
          '</fieldset>' +

          '<fieldset>' +
            '<legend>Interesse no voluntariado</legend>' +

            '<div class="campo" data-campo="area" role="radiogroup"' +
              ' aria-labelledby="rotulo-area" aria-describedby="erro-area">' +
              '<span class="rotulo-grupo" id="rotulo-area">Em qual área você gostaria de atuar? *</span>' +
              '<div class="opcoes">' + opcoesArea + '</div>' +
              '<p class="campo__erro" id="erro-area"></p>' +
            '</div>' +

            '<div class="campo" data-campo="disponibilidade">' +
              '<label for="disponibilidade">Disponibilidade *</label>' +
              '<select id="disponibilidade" name="disponibilidade" aria-describedby="erro-disponibilidade">' +
                '<option value="">Selecione</option>' + opcoesDisponibilidade +
              '</select>' +
              '<p class="campo__erro" id="erro-disponibilidade"></p>' +
            '</div>' +

            '<div class="campo" data-campo="mensagem">' +
              '<label for="mensagem">Conte um pouco sobre você</label>' +
              '<textarea id="mensagem" name="mensagem" rows="5" maxlength="500"' +
                ' aria-describedby="erro-mensagem contador-mensagem"></textarea>' +
              '<p class="campo__ajuda" id="contador-mensagem">0/500 caracteres</p>' +
              '<p class="campo__erro" id="erro-mensagem"></p>' +
            '</div>' +
          '</fieldset>' +

          '<div class="campo" data-campo="consentimento">' +
            '<label class="opcao">' +
              '<input type="checkbox" id="consentimento" name="consentimento"' +
                ' aria-describedby="erro-consentimento"> ' +
              'Autorizo o uso dos meus dados para contato sobre o voluntariado. *' +
            '</label>' +
            '<p class="campo__erro" id="erro-consentimento"></p>' +
          '</div>' +

          '<div class="acoes-formulario">' +
            '<button type="submit">Enviar cadastro</button>' +
            '<button type="reset">Limpar</button>' +
          '</div>' +
        '</form>' +
      '</section>';
  }

  /* ---------- leitura e escrita dos valores ---------- */

  function lerValores(formulario) {
    var valores = {};

    CAMPOS_SALVOS.forEach(function (campo) {
      if (campo === 'area' || campo === 'consentimento') return;
      var elemento = formulario.elements[campo];
      valores[campo] = elemento ? elemento.value : '';
    });

    var areaMarcada = formulario.querySelector('input[name="area"]:checked');
    valores.area = areaMarcada ? areaMarcada.value : '';
    valores.consentimento = formulario.elements.consentimento.checked;

    return valores;
  }

  function preencher(formulario, valores) {
    Object.keys(valores || {}).forEach(function (campo) {
      if (campo === 'area') {
        var opcao = formulario.querySelector('input[name="area"][value="' + valores.area + '"]');
        if (opcao) opcao.checked = true;
        return;
      }
      if (campo === 'consentimento') {
        formulario.elements.consentimento.checked = Boolean(valores.consentimento);
        return;
      }
      var elemento = formulario.elements[campo];
      if (elemento) elemento.value = valores[campo];
    });
  }

  /* ---------- feedback visual ---------- */

  function bloco(formulario, campo) {
    return formulario.querySelector('[data-campo="' + campo + '"]');
  }

  function controle(formulario, campo) {
    return formulario.elements[campo];
  }

  function mostrarErro(formulario, campo, mensagem) {
    var caixa = bloco(formulario, campo);
    if (!caixa) return;

    caixa.classList.add('campo--erro');
    caixa.classList.remove('campo--ok');
    caixa.querySelector('.campo__erro').textContent = mensagem;

    var alvo = controle(formulario, campo);
    if (alvo && alvo.setAttribute) alvo.setAttribute('aria-invalid', 'true');
  }

  function marcarValido(formulario, campo, preenchido) {
    var caixa = bloco(formulario, campo);
    if (!caixa) return;

    caixa.classList.remove('campo--erro');
    caixa.classList.toggle('campo--ok', Boolean(preenchido));
    caixa.querySelector('.campo__erro').textContent = '';

    var alvo = controle(formulario, campo);
    if (alvo && alvo.removeAttribute) alvo.removeAttribute('aria-invalid');
  }

  /* Valida um campo isolado (usado no blur e no change). */
  function validarCampo(formulario, campo) {
    if (!ESQUEMA[campo]) return true;

    var valores = lerValores(formulario);
    var mensagem = Validacao.validarCampo(valores[campo], ESQUEMA[campo]);

    if (mensagem) {
      mostrarErro(formulario, campo, mensagem);
      return false;
    }

    marcarValido(formulario, campo, String(valores[campo] || '') !== '');
    return true;
  }

  function mostrarResumo(container, erros) {
    var area = App.Dom.selecionar('#resumo-erros', container);
    var campos = Object.keys(erros);

    if (!campos.length) {
      area.innerHTML = '';
      return;
    }

    /* Botões (e não links) para não mexer no hash da SPA. */
    var itens = campos.map(function (campo) {
      return '<li>' +
        '<button type="button" class="link-erro" data-campo-erro="' + campo + '">' +
          App.Templates.escapar(ROTULOS[campo] || campo) +
        '</button>: ' + App.Templates.escapar(erros[campo]) +
      '</li>';
    }).join('');

    area.innerHTML = App.Parciais.alerta({
      tipo: 'erro',
      titulo: 'Corrija ' + campos.length + (campos.length === 1 ? ' campo' : ' campos') + ':',
      mensagem: '',
      acoes: '<ul class="lista-erros">' + itens + '</ul>'
    });
  }

  /* ---------- ciclo de vida da view ---------- */

  function montar(container) {
    var formulario = App.Dom.selecionar('#formulario-voluntario', container);
    var contador = App.Dom.selecionar('#contador-mensagem', container);

    Mascaras.aplicar(formulario.elements.cpf, 'cpf');
    Mascaras.aplicar(formulario.elements.telefone, 'telefone');
    Mascaras.aplicar(formulario.elements.cep, 'cep');

    restaurarRascunho(container, formulario);
    atualizarContador();

    /* Salva o rascunho enquanto o usuário digita. */
    var salvarRascunho = App.Dom.adiar(function () {
      Voluntarios.salvarRascunho(lerValores(formulario));
    }, 800);

    formulario.addEventListener('input', function (evento) {
      if (evento.target.id === 'mensagem') atualizarContador();
      if (evento.target.name) limparErroAoDigitar(evento.target.name);
      salvarRascunho();
    });

    formulario.addEventListener('change', function (evento) {
      if (evento.target.name) validarCampo(formulario, evento.target.name);
      salvarRascunho();
    });

    /* focusout = "saiu do campo": momento natural para validar. */
    formulario.addEventListener('focusout', function (evento) {
      var campo = evento.target.name;
      if (campo && ESQUEMA[campo]) validarCampo(formulario, campo);
    });

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      enviar(container, formulario);
    });

    formulario.addEventListener('reset', function () {
      setTimeout(function () {
        Object.keys(ESQUEMA).forEach(function (campo) {
          marcarValido(formulario, campo, false);
        });
        App.Dom.selecionar('#resumo-erros', container).innerHTML = '';
        App.Dom.selecionar('#aviso-rascunho', container).innerHTML = '';
        Voluntarios.limparRascunho();
        atualizarContador();
        App.UI.Notificacoes.info('Formulário limpo e rascunho descartado.');
      }, 0);
    });

    /* Itens do resumo levam o foco até o campo com erro. */
    App.Dom.delegar(container, 'click', '[data-campo-erro]', function (_evento, botao) {
      focar(controle(formulario, botao.dataset.campoErro));
    });

    /* Descartar o rascunho restaurado: o próprio reset do
       formulário limpa os campos, os erros e o localStorage. */
    App.Dom.delegar(container, 'click', '[data-acao="descartar-rascunho"]', function () {
      formulario.reset();
    });

    function atualizarContador() {
      contador.textContent = (formulario.elements.mensagem.value.length) + '/500 caracteres';
    }

    function limparErroAoDigitar(campo) {
      var caixa = bloco(formulario, campo);
      if (caixa && caixa.classList.contains('campo--erro')) {
        marcarValido(formulario, campo, false);
      }
    }
  }

  function restaurarRascunho(container, formulario) {
    var rascunho = Voluntarios.lerRascunho();
    if (!rascunho || !rascunho.valores) return;

    preencher(formulario, rascunho.valores);

    App.Dom.selecionar('#aviso-rascunho', container).innerHTML = App.Parciais.alerta({
      tipo: 'info',
      titulo: 'Rascunho restaurado.',
      mensagem: 'Recuperamos o que você havia preenchido em ' +
        formatarData(rascunho.salvoEm) + '.',
      acoes: '<p><button type="button" class="botao-secundario"' +
        ' data-acao="descartar-rascunho">Descartar rascunho</button></p>'
    });
  }

  function enviar(container, formulario) {
    var valores = lerValores(formulario);
    var resultado = Validacao.validarFormulario(valores, ESQUEMA);

    /* Regra de negócio extra: não repetir CPF. */
    if (!resultado.erros.cpf && Voluntarios.cpfJaCadastrado(valores.cpf)) {
      resultado.erros.cpf = 'Este CPF já está cadastrado como voluntário.';
      resultado.valido = false;
    }

    Object.keys(ESQUEMA).forEach(function (campo) {
      if (resultado.erros[campo]) {
        mostrarErro(formulario, campo, resultado.erros[campo]);
      } else {
        marcarValido(formulario, campo, String(valores[campo] || '') !== '');
      }
    });

    mostrarResumo(container, resultado.erros);

    if (!resultado.valido) {
      focar(controle(formulario, Object.keys(resultado.erros)[0]));
      App.UI.Notificacoes.erro('Não foi possível enviar: revise os campos destacados.');
      return;
    }

    var registro = Voluntarios.salvar(valores);
    Voluntarios.limparRascunho();

    App.UI.Notificacoes.sucesso('Cadastro de ' + registro.nome.split(' ')[0] + ' salvo com sucesso!');
    App.Router.navegar('/voluntarios');
  }

  /* Dá foco a um controle do formulário. Grupos de radio não
     têm .focus(), então usamos a primeira opção do grupo. */
  function focar(alvo) {
    if (!alvo) return;
    if (typeof alvo.focus === 'function') alvo.focus();
    else if (alvo.length) alvo[0].focus();
  }

  function formatarData(iso) {
    var data = new Date(iso);
    if (isNaN(data.getTime())) return 'algum momento';
    return data.toLocaleDateString('pt-BR') + ' às ' +
      data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return {
    titulo: 'Cadastro',
    html: html,
    montar: montar,
    formatarData: formatarData
  };
})();
