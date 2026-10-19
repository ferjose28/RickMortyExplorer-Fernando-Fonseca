# Rick and Morty Explorer

Este es el proyecto que hice para la práctica de consumo de API en Diseño de Sistemas en Internet. Elegí trabajar con personajes de Rick and Morty para usar una temática distinta a la del ejemplo de clase.

La página muestra personajes que se consultan desde la API. Se pueden buscar por nombre, filtrar por estado o género y pasar de una página de resultados a otra. También agregué una opción para ver más información de cada personaje y un botón para mostrar uno al azar.

## Cómo abrir el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta en Visual Studio Code.
3. Abrir `index.html` con Live Server.

No hace falta instalar paquetes. Eso sí, hay que tener conexión a internet para que carguen los personajes.

## Archivos

- `index.html`: contiene la estructura de la página.
- `css/styles.css`: tiene los estilos y la adaptación a distintas pantallas.
- `js/app.js`: realiza las consultas a la API y muestra los resultados.

## API que utilicé

https://rickandmortyapi.com/api/character

En JavaScript utilicé `fetch()` para hacer las consultas GET. Los datos llegan en formato JSON y con ellos se llenan las tarjetas. Para algunas consultas usé `async/await` y para el personaje aleatorio usé `.then()` y `.catch()`.

## Autor

Fernando José Fonseca Carcache  
Ingeniería de Sistemas - Universidad Nacional de Ingeniería
