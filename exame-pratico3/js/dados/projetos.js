/* =========================================================
   Dados > Projetos
   Fonte de dados da aplicação. Em um sistema real viria de uma
   API; aqui fica em um array para alimentar as views.
   ========================================================= */
window.App = window.App || {};
App.Dados = App.Dados || {};

App.Dados.areas = [
  { valor: 'educacao', rotulo: 'Educação' },
  { valor: 'saude', rotulo: 'Saúde' },
  { valor: 'renda', rotulo: 'Capacitação e renda' },
  { valor: 'meio-ambiente', rotulo: 'Meio ambiente' }
];

App.Dados.projetos = [
  {
    id: 'educacao-para-todos',
    titulo: 'Educação para Todos',
    emoji: '📚',
    area: 'educacao',
    resumo: 'Reforço escolar e preparação para o ENEM para crianças e adolescentes de comunidades de baixa renda.',
    descricao: [
      'Oferecemos reforço escolar, oficinas de leitura e preparação para o ENEM para crianças e adolescentes da rede pública.',
      'As turmas acontecem no contraturno, em espaços cedidos por escolas e associações de bairro, sempre com acompanhamento pedagógico.'
    ],
    objetivo: 'Ampliar o acesso à educação e reduzir a evasão escolar.',
    imagem: {
      webp: 'img/projeto-educacao.webp',
      jpg: 'img/projeto-educacao.jpg',
      alt: 'Crianças participando de aula de reforço escolar'
    },
    voluntarios: 42,
    atendidos: 380,
    desde: 2018
  },
  {
    id: 'clinica-solidaria',
    titulo: 'Clínica Solidária',
    emoji: '❤️',
    area: 'saude',
    resumo: 'Atendimento médico gratuito com foco em prevenção e conscientização para famílias em vulnerabilidade.',
    descricao: [
      'Promovemos atendimentos básicos, ações de prevenção e campanhas de conscientização em saúde para famílias em situação de vulnerabilidade.',
      'Contamos com profissionais voluntários das áreas de clínica geral, enfermagem, nutrição e psicologia.'
    ],
    objetivo: 'Levar informação e cuidado para quem mais precisa.',
    imagem: {
      webp: 'img/equipe-voluntarios.webp',
      jpg: 'img/equipe-voluntarios.jpg',
      alt: 'Equipe de voluntários da Conecta Solidária reunida em uma ação comunitária'
    },
    voluntarios: 27,
    atendidos: 1200,
    desde: 2019
  },
  {
    id: 'capacitacao-profissional',
    titulo: 'Capacitação Profissional',
    emoji: '💼',
    area: 'renda',
    resumo: 'Cursos de qualificação e empreendedorismo para geração de renda e inclusão no mercado de trabalho.',
    descricao: [
      'Realizamos cursos gratuitos de informática, empreendedorismo e preparação para o mercado de trabalho.',
      'Ao final de cada turma, conectamos os participantes a empresas parceiras que oferecem vagas e estágios.'
    ],
    objetivo: 'Estimular a autonomia e a geração de renda.',
    imagem: {
      webp: 'img/equipe-voluntarios.webp',
      jpg: 'img/equipe-voluntarios.jpg',
      alt: 'Equipe de voluntários da Conecta Solidária reunida em uma ação comunitária'
    },
    voluntarios: 18,
    atendidos: 260,
    desde: 2020
  },
  {
    id: 'comunidade-sustentavel',
    titulo: 'Comunidade Sustentável',
    emoji: '🌱',
    area: 'meio-ambiente',
    resumo: 'Hortas comunitárias, reciclagem e oficinas sobre consumo consciente e preservação ambiental.',
    descricao: [
      'Organizamos hortas comunitárias, campanhas de reciclagem e oficinas sobre consumo consciente e preservação ambiental.',
      'Parte do que é colhido nas hortas abastece as famílias participantes e cozinhas solidárias do bairro.'
    ],
    objetivo: 'Incentivar práticas sustentáveis no dia a dia.',
    imagem: {
      webp: 'img/equipe-voluntarios.webp',
      jpg: 'img/equipe-voluntarios.jpg',
      alt: 'Equipe de voluntários da Conecta Solidária reunida em uma ação comunitária'
    },
    voluntarios: 15,
    atendidos: 140,
    desde: 2021
  }
];

/* Busca um projeto pelo identificador usado na rota. */
App.Dados.buscarProjeto = function (id) {
  return App.Dados.projetos.filter(function (projeto) {
    return projeto.id === id;
  })[0] || null;
};

/* Converte o valor da área no rótulo exibido na tela. */
App.Dados.rotuloArea = function (valor) {
  var area = App.Dados.areas.filter(function (item) {
    return item.valor === valor;
  })[0];
  return area ? area.rotulo : valor;
};
