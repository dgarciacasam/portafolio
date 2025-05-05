---
layout: '../../layouts/BlogLayout.astro'
title: Configurar linter para proyectos con Vite
description: Aprende cómo añadir un linter a proyectos Vite con javascript o typescript.
tag: [Tutorial, Javascript, Typescript, Herramientas, Frontend]
date: 2024-06-28
---

## Introducción

Un `linter` es una herramienta que analiza el código de un proyecto e identifica fallos, errores de programación e incluso problemas de estilo. Es especialmente útil para asegurar que el código siga ciertas convenciones y facilitar la deteccion de errores antes de su ejecución.

## Requisitos previos

Antes de empezar, debemos asegurarnos de tener instalado:

- [Node.js](https://nodejs.org/en/download/)
- VsCode
- Extensión de VsCode ESLint
- Extensión de VsCode Prettier
- Extensión de VsCode Error Lens

## Instalación del linter en proyecto con Javascript

```bash
#Creamos el proyecto con Vite
npm create vite@latest

#Configuración del proyecto
✔ Project name: proyecto-javascript
✔ Select a framework: > React
✔ Select a variant : > Javascript + SWC

#Entramos a la carpeta del proyecto creado
cd proyecto-javascript

#Instalamos las dependencias
npm install
```

Con esto tendremos el proyecto instalado y configurado.

Al inicializar el proyecto con Vite, este nos configura por defecto el linter eslint por defecto.
Por lo que abriremos la carpeta del proyecto utilizando el comando code . y eliminaremos el archivo eslintrc.cjs.

Seguido de esto procederemos a configurar eslint.

```bash
#Configuramos eslint
npx eslint --init

#Configuración que he elegido
How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No
✔ Where does your code run? · browser
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · standard
✔ What format do you want your config file to be in? · JSON
✔ Would you like to install them now? · Yes
✔ Which package manager do you want to use? · npm
```

Con esto en principio ya tendríamos el linter configurado.

![alt text](/images/image.png)

Añadiremos una regla al linter para que no nos aparezcan erorres de este tipo.

En el archivo eslintrc.json:

```json
"rules": {
        "eslint-disable-next-line react/react-in-jsx-scope": false
      }
```

Por último modificaremos la configuración del editor de código para que nos formatee el documento de forma automática al guardar.

Ctrl + Shift + P -> Open User Settings (JSON).

Por último añadiremos la configuración del archivo settings.json para que prettier se adapte a la configuración de standard y formatee el archivo de forma uniforme.

```json
"editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "prettier.singleQuote": true,
  "prettier.semi": false,
  "prettier.jsxSingleQuote": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
```

De esta forma ya tendremos eslint y prettier configurados en nuestro proyecto.

## Instalación del linter en proyecto con Typescript

La instalación del linter en un proyecto con Typescript es prácticamente igual a Javascript solo que en este caso tendremos que añadir un par de configuraciones más para que todo funcione correctamente.

```bash
#Configuración del proyecto
✔ Project name: proyecto-typescript
✔ Select a framework: > React
✔ Select a variant : > TypeScript + SWC

#Entramos a la carpeta del proyecto creado
cd proyecto-typescript

#Instalamos las dependencias
npm install
```

Al igual que hemos hecho en el proyecto con Javascript, eliminamos el archivo eslintrc.cjs y procederemos a configurar eslint.

```bash
#Configuramos eslint
npx eslint --init

#Configuración que he elegido
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · Yes
✔ Where does your code run? · browser
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · standard-with-typescript
✔ What format do you want your config file to be in? · JSON
✔ Would you like to install them now? · Yes
✔ Which package manager do you want to use? · npm
```

Una vez que tengamos eslint configurado. Y al menos en mi caso, aparecerá este error al abrir el archivo App.tsx:

![alt text](/images/image-1.png)

Para resolver este error tendremos que añadir en el archivo eslintrc.json la siguiente configuración:

```json
"parserOptions": {
    "project": ["./tsconfig.json", "./tsconfig.app.json"]
  },
```

Ahora ya tendremos el linter correctamente configurado:

![alt text](/images/image-2.png)

Añadiremos algunas reglas al archivo eslintjrc.json:

```json
"rules": {
    "eslint-disable react/react-in-jsx-scope": false
  }
```

Por último añadiremos la configuración del archivo settings.json para que prettier se adapte a la configuración de standard y formatee el archivo de forma uniforme.

```json
"editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "prettier.singleQuote": true,
  "prettier.semi": false,
  "prettier.jsxSingleQuote": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
```
