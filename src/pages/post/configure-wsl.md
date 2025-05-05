---
layout: '../../layouts/BlogLayout.astro'
title: Configurar entorno de desarrollo en Windows con WSL
description: Aprende a configurar un entorno de desarrollo aislado para crear aplicaciones fullstack con MySQL, Java y JavaScript
tag: [Tutorial, Herramientas, Backend, Frontend, MySQL, Java, Javascript]
date: 2024-07-12
---

## Introducción

Configurar un entorno de desarrollo en Windows utilizando WSL (Windows Subsystem for Linux) ofrece múltiples beneficios, especialmente si deseas mantener tus entornos de trabajo y personal bien separados. En este tutorial, aprenderás cómo crear un entorno de desarrollo aislado, ideal para desarrollar aplicaciones fullstack utilizando MySQL, Java y JavaScript.

Es importante destacar que la elección de estos lenguajes y tecnologías es una preferencia personal, y uno de los principales beneficios de usar WSL es la capacidad de mantener un entorno de desarrollo profesional separado del resto de tu sistema. Esto no solo facilita la gestión y organización de tus proyectos, sino que también mejora la eficiencia y seguridad al desarrollar tus aplicaciones.

## Instalación de Windows Terminal y distribución de Ubuntu

Para instalar WSL (Windows Subsystem for Linux) tendremos que ir a la Microsoft Store e instalar la aplicación que se muestra en la siguiente imagen:

![alt text](/images/image-3.png)

En caso de que la Microsoft Store dé algún error y no podamos realizar la instalación, también podremos instalar la Windows Terminal directamente desde el repositorio de GitHub.

Hacemos clic en la última versión estable (etiqueta "Latest" verde).

![alt text](/images/image-4.png)

Bajamos hasta el final de la página y descargamos el instalador.

![alt text](/images/image-5.png)

Una vez descargada e instalada la terminal, tendremos que instalar la distribución de Linux que queramos.

#### Abrimos la terminal y escribimos lo siguiente:

```bash
# Listamos las distribuciones disponibles para instalar
wsl --list --online

# Instalamos la distribución que queramos, en mi caso será la última versión LTS de Ubuntu
wsl --install Ubuntu-22.04
```

Finalizada la instalación, Ubuntu nos pedirá un nombre de usuario y contraseña con los que accederemos al sistema.

### Configuración de la Windows Terminal

En este punto, configuraremos la Windows Terminal de modo que al ejecutarla nos abra por defecto Ubuntu.

Seleccionamos Ubuntu como perfil predeterminado y guardamos los cambios.
![alt text](/images/image-6.png)

En este apartado podremos crear un perfil nuevo o modificar el existente de Ubuntu. Con esto podremos modificar la terminal a nuestro gusto para que utilice los colores, tipografía o tamaño de letra que mejor se adapten a nuestros gustos.

## Instalación de Visual Studio Code

La forma más sencilla de utilizar VS Code en WSL es tener instalado el programa directamente en Windows desde el siguiente [enlace](https://code.visualstudio.com/).

Una vez instalado, simplemente tendremos que ir a una carpeta dentro de Ubuntu y escribir el siguiente comando:

```bash
code .
```

Ubuntu instalará de forma automática VS Code Server y siempre que pongamos el comando anterior, nos abrirá VS Code y podremos trabajar con la aplicación con normalidad.

## Instalación de Node

Para poder desarrollar aplicaciones en JavaScript necesitaremos tener instalado Node.

```bash
# Descargamos el script de configuración
curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh

# Lanzamos el script
sudo -E bash nodesource_setup.sh

# Instalamos Node
sudo apt-get install -y nodejs

# Verificamos que esté correctamente instalado
node -v
```

Creamos un proyecto de ejemplo para probar que todo funciona correctamente.

```bash
# Creamos un proyecto React con Vite
npm create vite@latest

✔ Project name: … test
✔ Select a framework: › React
✔ Select a variant: › JavaScript + SWC

cd test
npm install
npm run dev
```

Si node está instalado correctamente. Al acceder a [http://localhost:5173](http://localhost:5173) deberíamos ver la clásica plantilla de ejemplo de React + Vite.

## Instalación de MySQL

Dado que estamos configurando un entorno de desarrollo enfocado al desarrollo de aplicaciones fullstack, tendremos que tener instalado un sistema de gestión de bases de datos.

Para instalar MySQL en Ubuntu hay que ejecutar los siguientes comandos:

```bash
# Actualizamos y eliminamos las versiones antiguas de todos los paquetes
sudo apt update
sudo apt upgrade

# Instalamos MySQL
sudo apt install mysql-server

# Comprobamos que se ha instalado correctamente y que está ejecutándose
sudo systemctl status mysql.service

# Modificamos el usuario root para poder identificarnos con la contraseña que queramos
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'TU CONTRASEÑA';
exit;

# Comprobamos que la contraseña se ha modificado correctamente
mysql -u root -p
root
```

Con esto ya podríamos crear bases de datos, tablas y todo lo que necesitemos para nuestras aplicaciones.

## Instalación de Java SDK

Para desarrollar aplicaciones Java necesitamos tener instalado un kit de desarrollo para Java. En mi caso, por ser de código abierto y fácil de instalar en Ubuntu, utilizaré el OpenJDK 17, que es la versión 17 LTS (Soporte extendido) del OpenJDK.

```bash
# Actualizamos las dependencias
sudo apt update && sudo apt upgrade -y

# Instalamos el kit de desarrollo de Java
sudo apt-get install openjdk-17-jdk
```

Con esto tendríamos instalado el kit de desarrollo para las aplicaciones Java. A continuación vamos a probar que todo funciona correctamente.

Teniendo [VS Code instalado](#instalación-de-visual-studio-code) debemos añadir las siguientes extensiones para el desarrollo de aplicaciones Java con el framework Spring Boot:

- Extension Pack for Java
- Spring Boot Extension Pack

Una vez instaladas las extensiones crearemos un nuevo proyecto Java Spring Boot.

```bash
# Presionamos Control + Shift + P para abrir la consola de comandos
Spring Initializr: Create Maven Project...

# Seleccionamos y especificamos las características del proyecto
"Versión de spring boot" > 3.3.1
"Lenguaje de la aplicación" > Java
"Id de grupo del proyecto" > com.example
"Id de artefacto del proyecto" > demo
"Especificamos el tipo de empaquetado" > Jar
"Especificamos la versión de java" > 17
"Seleccionamos las dependencias" > Spring Web
```

Por último comprobaremos que el proyecto se ha creado correctamente y que las extensiones de VS Code y el JDK están instalados correctamente. Para ello tendremos que seguir los siguiente pasos:

1. Abrimos el nuevo proyecto generado.
2. Abrimos el archivo DemoApplication.java situado en la ruta /src/java/com/example/demo y ejecutamos el proyecto.

Si hemos hecho todo bien y accedemos a la [http://localhost:8080](http://localhost:8080) nos aparecerá el siguiente mensaje en el navegador:

![alt text](/images/image-7.png)
