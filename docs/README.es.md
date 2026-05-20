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

- 24 ilusiones visuales:
  - Geometría / forma:
    - Café Wall: los mosaicos desplazados hacen que líneas paralelas parezcan inclinadas.
    - Hermann / Scintillating Grid: las intersecciones de la cuadrícula crean manchas oscuras fugaces.
    - Müller-Lyer: las aletas cambian la longitud percibida de líneas iguales.
    - Ponzo: las pistas de perspectiva hacen que barras iguales parezcan distintas.
    - Poggendorff: una banda que oculta hace que una diagonal parezca desplazada.
    - Zöllner: trazos cruzados hacen que líneas paralelas parezcan inclinarse.
    - Hering: líneas radiantes curvan visualmente paralelas hacia fuera.
    - Wundt: líneas convergentes curvan visualmente paralelas hacia dentro.
    - Vertical-horizontal: líneas verticales y horizontales iguales parecen desiguales.
    - Jastrow: bandas curvas idénticas parecen distintas al desplazarse.
    - Ebbinghaus: los círculos alrededor cambian el tamaño percibido de centros iguales.
    - Delboeuf: los anillos alrededor cambian el tamaño percibido de círculos iguales.
    - Paralelogramo de Sander: marcos inclinados distorsionan la longitud percibida.
    - Triángulo de Kanizsa: formas recortadas sugieren un triángulo no dibujado.
    - Fraser Spiral: arcos inclinados sobre círculos sugieren una espiral.
  - Color / brillo:
    - Contraste simultáneo: un mismo color cambia según lo que lo rodea.
    - Bandas de Mach: los bordes de brillo crean franjas claras y oscuras.
    - Ilusión de White: grises iguales parecen distintos sobre rayas.
    - Cornsweet: un borde sombreado fino cambia el brillo percibido.
  - Movimiento:
    - Moiré Motion Field: rayas superpuestas crean interferencias móviles.
    - Deriva periférica: patrones repetidos de contraste parecen desplazarse.
    - Ilusión de Ouchi: un centro rayado parece deslizarse sobre el fondo.
    - Perseguidor lila: un hueco giratorio crea una sensación de postimagen.
    - Pinna-Brelstaff: segmentos inclinados en anillos parecen rotar.
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
