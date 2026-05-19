# Sakushi Lab

Sakushi Lab es un laboratorio estático y multilingüe para explorar ilusiones visuales. Funciona completamente en el navegador con Vite, TypeScript vanilla, Canvas, exportación SVG y grabación WebM.

Sitio en línea: [Sakushi Lab](https://piccoripico.github.io/sakushi-lab/)

## Documentos Multilingües

- [English](../README.md)
- [日本語](README.ja.md)
- [Français](README.fr.md)
- [Deutsch](README.de.md)
- [简体中文](README.zh-Hans.md)
- [繁體中文](README.zh-Hant.md)
- [한국어](README.ko.md)

## Acerca De Las Ilusiones Visuales

Las ilusiones visuales son imágenes o patrones de movimiento que muestran cuánto depende la percepción del contexto. Líneas que físicamente son paralelas pueden parecer inclinadas, formas iguales pueden verse de tamaños distintos y patrones estáticos pueden parecer parpadear o moverse.

Estos efectos no son simplemente « errores » de la visión. Muestran cómo el sistema visual estima brillo, contraste, profundidad, dirección, tamaño y movimiento a partir de la información que los rodea. Sakushi Lab permite cambiar las condiciones de cada ilusión y observar cómo esos cambios hacen que el efecto sea más fuerte, más débil o más fácil de notar.

Las imágenes y videos generados son útiles para aprendizaje, demostraciones, experimentos de diseño y exploración casual. Algunas ilusiones con movimiento pueden sentirse intensas; toma un descanso si una animación resulta incómoda.

## Funciones

- Seis ilusiones visuales:
  - Café Wall
  - Hermann / Scintillating Grid
  - Müller-Lyer
  - Ebbinghaus
  - Fraser Spiral
  - Moiré Motion Field
- Controles de parámetros generados desde el esquema de cada módulo de ilusión.
- Controles opcionales de semilla para generación reproducible.
- Generación determinista con URL compartible basada en semilla.
- Exportación PNG, SVG, WebM y URL reproducible.
- Idiomas de la interfaz: inglés, francés, español, alemán, japonés, chino simplificado, chino tradicional y coreano.

## Desarrollo

```powershell
npm.cmd install
npm.cmd run verify
```

Scripts útiles:

- `npm.cmd run dev`: inicia el servidor de desarrollo de Vite.
- `npm.cmd test`: ejecuta las pruebas unitarias.
- `npm.cmd run build`: comprueba tipos y construye `dist/`.
- `npm.cmd run test:e2e`: ejecuta las pruebas de Playwright.

## GitHub Pages

El workflow en `.github/workflows/pages.yml` construye y sube `dist/` como artefacto de Pages cuando hay push a `main` o ejecución manual.
