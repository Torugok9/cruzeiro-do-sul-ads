# Exame Prático 3 — Conecta Solidária como SPA

Terceira etapa do projeto da ONG fictícia Conecta Solidária. O Exame 1 estruturou o
HTML semântico, o Exame 2 criou o design system em CSS e este exame transforma as
páginas estáticas em uma **Single Page Application** escrita em JavaScript puro,
sem bibliotecas e sem etapa de build.

## Como abrir

Basta abrir `index.html` no navegador (dois cliques já funcionam, porque o projeto
usa scripts clássicos em vez de módulos ES).

Para rodar a página de testes é preciso um servidor local, já que o navegador
bloqueia iframes em `file://`:

```bash
cd exame-pratico3
python3 -m http.server 8000
# depois acesse http://localhost:8000/testes.html
```

## Rotas

A navegação usa o hash da URL, então o cabeçalho, o menu e o rodapé nunca são
recarregados: apenas o conteúdo de `#app` é trocado.

| Rota | Tela |
|---|---|
| `#/` | Início, com estatísticas e projetos em destaque |
| `#/projetos` | Lista de projetos com filtro por área e busca por texto |
| `#/projetos/:id` | Detalhe de um projeto (rota com parâmetro dinâmico) |
| `#/cadastro` | Formulário de voluntário com validação e rascunho automático |
| `#/voluntarios` | Cadastros salvos no localStorage, com busca, ordenação e remoção |
| `#/componentes` | Guia de componentes (badges, alertas, toasts, modal) |
| qualquer outra | Tela 404 da aplicação |

## Organização do código

```
index.html            Casca da SPA (cabeçalho, menu, #app, rodapé)
testes.html           Testes automatizados da aplicação
css/style.css         Design system do Exame 2 + estilos das telas dinâmicas
js/
  nucleo/             Base da aplicação
    dom.js            Atalhos de seleção, delegação de eventos e debounce
    templates.js      Motor de templates ({{ campo }}, {{& html }}, parciais)
    store.js          Camada única de acesso ao localStorage (com fallback)
    router.js         Roteador por hash, com parâmetros e rota 404
  dados/
    projetos.js       Dados dos projetos e das áreas de atuação
  formularios/
    validacao.js      Catálogo de regras (obrigatório, e-mail, CPF, idade...)
    mascaras.js       Máscaras de CPF, telefone e CEP
  servicos/
    voluntarios.js    Regras de negócio do cadastro (salvar, filtrar, rascunho)
  ui/
    parciais.js       Templates reutilizados por mais de uma tela
    notificacoes.js   Toasts empilháveis
    modal.js          Modal de confirmação acessível
    menu.js           Menu responsivo
  views/              Uma tela por arquivo: { titulo, html(), montar() }
  app.js              Ponto de entrada: registra as rotas e inicia o roteador
```

Cada módulo é uma IIFE que registra seu namespace em `App` (`App.Router`,
`App.Store`, `App.Views.Cadastro`...), o que evita variáveis globais soltas e
mantém a ordem de carregamento explícita no `index.html`.

## Objetivos do exame e onde eles aparecem

| Objetivo | Implementação |
|---|---|
| Páginas interativas com JavaScript | Toda a navegação, filtros e formulários |
| Manipulação do DOM | Telas geradas por templates e listas redesenhadas a cada filtro |
| Eventos do utilizador | Cliques, `input`, `change`, `focusout`, `submit`, `reset`, `hashchange` e teclado (Esc) |
| localStorage | `js/nucleo/store.js` e `js/servicos/voluntarios.js`: cadastros e rascunho |
| Framework JavaScript | Mini-framework próprio: roteador + sistema de templates + camada de serviços |
| Comportamento de aplicação real | Rascunho automático, CPF duplicado bloqueado, confirmação antes de apagar, feedback por toast |
| Código reutilizável | Parciais de template, regras de validação combináveis e serviços compartilhados |
| Testar e corrigir erros | `testes.html` com 52 verificações automatizadas |

## Validação do formulário

O formulário usa `novalidate` e valida por JavaScript, o que permite mensagens em
português e regras que o HTML não cobre:

- nome com sobrenome e mínimo de 3 caracteres;
- e-mail em formato válido;
- CPF com dígitos verificadores conferidos e sem repetição de cadastro;
- idade mínima de 16 anos, sem datas futuras;
- telefone com DDD, CEP com 8 dígitos;
- área, disponibilidade e autorização de uso dos dados obrigatórias.

O feedback aparece em três níveis: borda e mensagem no próprio campo (ao sair
dele), resumo com a lista de erros no topo do formulário e um toast. Enquanto o
usuário digita, o rascunho é salvo no localStorage e restaurado se ele voltar
para a tela.

## Correções em relação ao Exame 2

Erros encontrados no código anterior e corrigidos aqui:

1. Campos obrigatórios ficavam com a borda vermelha antes de qualquer interação,
   porque o seletor usava `:invalid` com `:not(:placeholder-shown)`. Agora o
   estado vem das classes `.campo--erro` e `.campo--ok`, aplicadas por JS.
2. A regra global de `header` pintava também os `<header>` internos com o
   gradiente roxo. Passou a ser `body > header`.
3. O menu hambúrguer era um checkbox com `display: none`, que não recebia foco
   do teclado. Virou um `<button>` com `aria-expanded`.
4. O modal dependia de `:target`, o que sujava a URL e não fechava com Esc.
5. No breakpoint de 480px, a regra `.btn, button { width: 100% }` esticava também
   os botões pequenos, como o de fechar notificação.

## Testes

`testes.html` carrega a aplicação em um iframe e simula o uso real: navega entre
as rotas, aplica filtros, digita no formulário, envia dados inválidos e válidos,
confere o conteúdo do localStorage, abre e fecha o modal e verifica se o template
escapa HTML digitado pelo usuário. O resultado aparece na própria página, com
`PASS` ou `FALHA` por verificação.
