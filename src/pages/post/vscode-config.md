---
layout: '../../layouts/BlogLayout.astro'
title: Mi configuración y extensiones de Visual Studio Code
description: En este post te muestro mi configuración preferida de Visual Studio Code para programar aplicaciones fullStack teniendo el desarrollo del backend y el frontend separados por perfiles.
tag: [Tutorial, Herramientas, Configuración]
date: 2024-07-19
---

## Introducción

Como desarrolladores, dedicamos cientos e incluso miles de horas frente al editor de código, por lo que contar con un entorno adaptado a nuestras preferencias y necesidades es esencial para trabajar de manera cómoda y eficiente. Además, tener un entorno de desarrollo agradable y satisfactorio no solo es un lujo, sino una necesidad para optimizar nuestra productividad y motivación.

En lo personal, mi editor de código preferido es Visual Studio Code. Desde mi punto de vista, es el más rápido, configurable y en general, el editor que me hace ser más productivo y mejora mi experiencia de desarrollo. Su marketplace de extensiones permite adaptarlo a prácticamente cualquier lenguaje de programación, ya sea orientado al desarrollo frontend o backend.

En este post, compartiré mi configuración de Visual Studio Code, incluyendo cómo tengo separado el entorno por perfiles para desarrollo frontend y backend, mis temas preferidos y algunos consejos para mejorar tu experiencia de desarrollo y optimizar tu flujo de trabajo, sacando el máximo partido a esta herramienta.

![alt text](/images/image-8.png)

## Configuración general

Comenzaré con la configuración general, ya que será aplicada a ambos perfiles por igual e incluirá configuraciones generales de Visual Studio Code, como la tipografía, tamaño de letra, forma y animaciones del cursor, etc.

Todas las configuraciones que mostraré deberán ir en el archivo `settings.json` de Visual Studio Code. Sin embargo, también pueden ser modificadas desde la pestaña Archivos > Preferencias > Opciones.

#### Configuracion de tipogafía

```json
{
  "editor.fontFamily": "'Monospace Argon' ,Consolas, 'Courier New', monospace",
  "editor.fontWeight": "200"
}
```

#### Configuración del cursor

Con esta configuración, modificamos las animaciones del cursor al parpadear y añadimos una pequeña animación al mover el cursor por el editor.

```json
{
  "editor.cursorBlinking": "expand",
  "editor.cursorSmoothCaretAnimation": "on"
}
```

#### Configuración de paneles

Colocamos el panel principal a la derecha para que el código empiece pegado a la parte izquierda de la pantalla, lo que, a mi parecer, mejora la legibilidad.

```json
{
  "editor.stickyScroll.enabled": false,
  "breadcrumbs.enabled": false,
  "workbench.sideBar.location": "right",
  "workbench.tree.enableStickyScroll": false
}
```

#### Configuración de la ventana principal

Activamos la edición enlazada de etiquetas HTML y el zoom al presionar `Control + Rueda del ratón`, lo que permite hacer zoom del código sin necesidad de aumentar el tamaño de toda la aplicación, como ocurre al usar `Control +`.

```json
{
  "editor.linkedEditing": true,
  "editor.mouseWheelZoom": true
}
```

#### Creación de perfiles

Una de las opciones que Visual Studio Code nos facilita y que poca gente utiliza es la creación de perfiles. Estos perfiles son totalmente configurables independientemente de los demás por lo que podrán tener su propio tema, extensiones aisladas del resto de perfiles o incluso configuraciones del editor exclusivas para cada perfil.

Para crear un perfil solo tendremos que hacer clic en `Archivo > Preferencias > Perfil > Crear nuevo perfil`. En mi caso, tengo creados un perfil frontend y uno backend cada uno adaptado al entorno en el que trabajaré y sobre los cuales se aplicarán las configuraciones globales que hemos visto anteriormente.

#### Extensiones que utilizo en los dos perfiles:

- Fluent Icons

## Perfil Frontend

Cuando se trata de desarrollar interfaces de usuario, al menos en mi caso, lo asocio a muchos tipos distintos de archivos `.js, .ts, .jsx, .tsx, .css, .html, .json` y muchos más. Por lo tanto, en cuanto a los iconos del árbol de directorios, me gusta que sean distinguibles y coloridos para identificar rápidamente el tipo de archivo.

Además, siendo la parte del desarrollo de software que se enfoca en lo visual, prefiero un tema de colores vivos y luminosos, siempre con un fondo oscuro. Por eso, mi tema preferido para el desarrollo frontend es Houston, el tema oficial de [Astro](https://astro.build/). Este tema ofrece un fondo oscuro con colores vivos y bien diferenciados en el texto, además de un pequeño amigo que nos acompañará durante nuestras horas de programación.

![alt text](/images/image-12.png)

Como mencioné antes, estas son preferencias personales y así es como diferencio el entorno frontend del backend. En tu caso, puede ser diferente.

![alt text](/images/image-9.png)

#### Extensiones que utilizo para desarrollar en JavaScript:

- Tema de color: Houston
- Tema de iconos: vscode-icon
- Error Lens
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier

## Perfil Backend

En cuanto al backend, me gusta tener un editor algo más plano y con otro tema para diferenciarlo del frontend. Al igual que con el otro perfil, el fondo tiene que ser oscuro. En cuanto al tema de iconos y carpetas, en este caso he elegido uno más plano ya que los tipos de archivos no varían tanto.

![alt text](/images/image-11.png)

#### Extensiones que utilizo para desarrollar en Java:

- Tema de color: Material Theme Darker High Contrast
- Tema de iconos: Material Theme Icons Darker
- Extension Pack for Java
- Extension Pack for Spring Boot
- Language Support for Java(TM) by Red Hat

## Conclusión final

Vale la pena invertir tiempo en adaptar nuestro entorno de desarrollo a nuestros gustos y necesidades. Configurar y personalizar todos los elementos de nuestra herramienta de trabajo puede parecer una tarea tediosa, pero los beneficios en términos de comodidad y productividad son inmensos. Este es el entorno más cómodo y productivo que he logrado hasta ahora. ¿A qué esperas para adaptar el tuyo?
