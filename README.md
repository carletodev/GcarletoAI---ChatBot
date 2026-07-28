# React + TypeScript + Vite

Este modelo fornece uma configuração mínima para fazer o React funcionar no Vite com HMR e algumas regras do Oxlint.

Atualmente, dois plugins oficiais estão disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/)

## Compilador React

O Compilador React não está habilitado neste modelo devido ao seu impacto no desempenho de desenvolvimento e compilação. Para adicioná-lo, veja [esta documentação](https://react.dev/learn/react-compiler/installation).

## Expandindo a configuração do Oxlint

Se você estiver desenvolvendo uma aplicação para produção, recomendamo habilitar regras de lint conscientes de tipos instalando `oxlint-tsgolint` e editando o arquivo `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

Veja a [documentação das regras do Oxlint](https://oxc.rs/docs/guide/usage/linter/rules) para a lista completa de regras e categorias.
