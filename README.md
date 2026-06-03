# Vertigo
> Catálogo inteligente de filmes automatizado.
[Acesse o projeto em produção](https://vertigo.click)

A aplicação foi projetada e desenvolvida de ponta a ponta, cobrindo desde a etapa de design de interface (UI/UX) até a estruturação da arquitetura de software, comunicação assíncrona com APIs externas e implantação em ambiente conteinerizado de produção.

---

## Tecnologias e Ecossistema

### Design & Front-End
* **UI/UX Design:** Figma (Prototipação de alta fidelidade e arquitetura de componentes)
* **Figma Template:** https://www.figma.com/design/i3VtVMKiytlzSAW8y6DPcH/Vertigo?node-id=0-1&t=pUc4vuOBr2vg4rLE-1
* **Framework:** Vue.js / TypeScript (Interfaces Single Page Application reativas e estritamente tipadas)
* **Estilização:** Tailwind CSS (Layouts modernos e 100% responsivos)

---

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
