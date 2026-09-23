# Conecta Solidária

Site da ONG fictícia **Conecta Solidária**, desenvolvido em etapas como entrega dos
exames práticos do curso de Análise e Desenvolvimento de Sistemas (Cruzeiro do Sul).

Cada pasta `exame-pratico*` é uma versão completa e independente do projeto, construída
sobre a anterior: primeiro a estrutura em HTML, depois o design system em CSS e, por
fim, a transformação em uma Single Page Application com JavaScript puro.

## Etapas

| Etapa | Pasta | Foco | Principais entregas |
|---|---|---|---|
| Exame 1 | [`exame-pratico1/`](exame-pratico1/) | HTML5 semântico | Páginas Início, Projetos e Cadastro; formulário com máscaras de CPF, telefone e CEP |
| Exame 2 | [`exame-pratico2/`](exame-pratico2/) | CSS3 avançado | Design tokens (variáveis CSS), grid de 12 colunas, responsividade, animações e guia de componentes |
| Exame 3 | [`exame-pratico3/`](exame-pratico3/) | JavaScript / SPA | Roteador por hash, templates, validação completa, localStorage e testes automatizados |

O Exame 3 tem documentação própria em [`exame-pratico3/README.md`](exame-pratico3/README.md),
com rotas, arquitetura, regras de validação e correções feitas sobre o Exame 2.

## Tecnologias

- **HTML5**: marcação semântica (`header`, `nav`, `main`, `section`, `article`, `fieldset`), `picture` com WebP e fallback JPG, metadados de SEO.
- **CSS3**: custom properties, Flexbox, CSS Grid, media queries e `@keyframes`.
- **JavaScript (ES5+)**: sem bibliotecas nem frameworks externos; DOM, eventos, `localStorage` e roteamento por `hashchange`.
- **Python 3** (opcional): apenas como servidor HTTP local para rodar os testes.

Não há dependências para instalar nem etapa de build.

## Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge ou Safari).
- Python 3, somente para executar a página de testes do Exame 3.
- Git, para clonar o repositório.

## Como executar

```bash
git clone git@github.com:Torugok9/cruzeiro-do-sul-ads.git
cd cruzeiro-do-sul-ads
```

Depois, abra o `index.html` da etapa desejada diretamente no navegador:

```bash
open exame-pratico1/index.html   # macOS
open exame-pratico2/index.html
open exame-pratico3/index.html
```

No Linux use `xdg-open`; no Windows, `start`.

## Testes

A etapa 3 possui 57 verificações automatizadas que simulam o uso real da aplicação
(navegação, imagens responsivas, filtros, formulário, localStorage, modal e escape de HTML). Como o navegador
bloqueia iframes em `file://`, é preciso servir os arquivos:

```bash
cd exame-pratico3
python3 -m http.server 8000
```

Acesse <http://localhost:8000/testes.html>. Cada verificação aparece como `PASS` ou `FALHA`.

## Estrutura do repositório

```
.
├── exame-pratico1/     HTML semântico + CSS base
│   ├── index.html, projetos.html, cadastro.html
│   ├── css/  js/  img/
├── exame-pratico2/     Design system em CSS
│   ├── index.html, projetos.html, cadastro.html, componentes.html
│   ├── css/  js/  img/  prints/
└── exame-pratico3/     SPA em JavaScript puro
    ├── index.html, testes.html, README.md
    ├── css/  img/  prints/
    └── js/   nucleo/ dados/ formularios/ servicos/ ui/ views/
```

## Versionamento e convenções

As mensagens de commit seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
(`feat:`, `fix:`, `docs:`, `chore:`), e as entregas seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/):

| Versão | Etapa | Justificativa |
|---|---|---|
| `v1.0.0` | Exame 1 | Primeira versão estável do site |
| `v1.1.0` | Exame 2 | Novas funcionalidades visuais, compatíveis com a estrutura anterior |
| `v2.0.0` | Exame 3 | Mudança de arquitetura: páginas `.html` substituídas por rotas da SPA |

## Autor

Victor Hugo — [@Torugok9](https://github.com/Torugok9)
