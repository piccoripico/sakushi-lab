import type { SupportedLanguage } from './i18n';

type DescriptionDictionary = Record<string, string>;

const en: DescriptionDictionary = {
  'illusion.cafe-wall.description': `The preview shows offset rows of light and dark tiles separated by thin mortar lines.

Although the tile rows are horizontal, the staggered edges can make the mortar look slanted.

Turn Guide on to overlay a square grid across the whole preview. Mortar width, row offset, and contrast change when the tilt appears or fades.`,
  'illusion.hermann-grid.description': `The preview shows only a bright grid on a dark background. No dots are actually drawn at the intersections.

When you look near, but not directly at, the intersections, dark spots may briefly appear in the surrounding grid.

Turn Guide on to mark every intersection. Grid count, line width, contrast, and guide color help test when the illusory spots appear or fade.`,
  'illusion.muller-lyer.description': `The preview shows two equal line segments with arrow-like fins pointing in different directions.

The central lines are the same length, but the fins can make one look longer than the other.

Turn Guide on to overlay a square grid. Fin length, fin angle, line length, and separation let you compare measured equality with perceived difference.`,
  'illusion.ponzo.description': `The preview places equal horizontal bars between converging perspective lines.

The bar nearer the narrow end can look longer because the background suggests depth.

Turn Guide on to overlay a square grid. Depth guides, horizon, line length, separation, and contrast change how strongly the perspective context works.`,
  'illusion.poggendorff.description': `The preview shows a diagonal line interrupted by a vertical occluding band.

Even when the diagonal segments belong to one straight path, the hidden middle can make them look misaligned.

Toggle the occluder or guide line, then adjust angle, gap, and line width to test the alignment.`,
  'illusion.zollner.description': `The preview shows long parallel lines crossed by many short slanted strokes.

The short strokes make the parallel lines seem to lean away from each other.

Turn context off to remove the short strokes, or turn Guide on to overlay a square grid. Crossing angle, segment count, stripe count, and line width control the tilt impression.`,
  'illusion.hering.description': `The preview shows straight parallel lines laid over radiating background lines.

The radiating context can make the straight lines look as if they bow outward.

Turn context off to see the straight lines alone, or turn Guide on to overlay a square grid. Stripe count, separation, line width, and contrast change the effect.`,
  'illusion.vertical-horizontal.description': `The preview shows a vertical line and a horizontal line that meet at the same point. The two target lines have the same physical length.

Many viewers feel that the vertical line is longer, because vertical extent and horizontal extent are judged differently.

Turn Guide on to overlay a square grid. Line length, gap, and line width let you test when the equality is easiest to trust.`,
  'illusion.ebbinghaus.description': `The preview shows equal center circles surrounded by different context circles.

Large or small surrounding circles can make the same center size look smaller or larger.

Turn context off to remove the surrounding circles, or turn Guide on to overlay a square grid. Surround radius, count, gap, and scale change the context effect.`,
  'illusion.delboeuf.description': `The preview shows equal center circles framed by surrounding rings.

The ring size and distance can make the equal centers appear different in size.

Turn Guide on to overlay a square grid. Center radius, surround radius, separation, and line width change the framing effect.`,
  'illusion.sander-parallelogram.description': `The preview shows two equal slanted target lines inside differently skewed frames.

Although the target lines are the same length, the frame on one side can make it feel longer than the other.

Turn context off to see the target lines alone, or turn Guide on to overlay a square grid. Angle, separation, and line width change the pull of the frames.`,
  'illusion.kanizsa-triangle.description': `The preview arranges three black cut-out disks and three black corner shapes around an empty center.

Your visual system may complete the missing edges and see a bright triangle that is not actually drawn.

Turn Guide on to show the triangle your eye is completing. Dot radius and line width change when the invisible triangle becomes convincing.`,
  'illusion.rubin-vase.description': `The preview shows a light central vase shape between two dark side regions.

The same border can be read either as the edge of a vase or as two face profiles looking at each other.

Turn Guide on to outline the vase, both face profiles, and the center axis. Vase width, profile depth, neck width, and colors change which interpretation is easier to hold.`,
  'illusion.simultaneous-contrast.description': `The preview places identical center colors on different surrounding backgrounds.

The same center color can look lighter on a dark surround and darker on a light surround.

Turn Guide on to draw same-color diagonal samples across both patches. Center radius, contrast, and colors let you compare the patches directly.`,
  'illusion.whites-illusion.description': `The preview places equal gray targets across alternating light and dark stripes.

The surrounding stripe pattern can make the equal gray targets look different in brightness.

Turn Guide on to draw same-gray diagonal samples across the target regions. Stripe count, line width, contrast, and colors let you compare the targets.`,
  'illusion.cornsweet.description': `The preview shows two large regions divided by a narrow shaded edge.

Although the broad regions can be equal in brightness, the edge makes one side appear lighter.

Turn Guide on to compare equal sample areas. Edge width, contrast, and color choices change how strongly the brightness shift appears.`,
  'illusion.lilac-chaser.description': `The preview shows lilac dots arranged around a circle with one missing position rotating around the ring.

As the gap moves, you may see a moving afterimage or a greenish dot that is not directly drawn.

Use speed, radius, dot count, and contrast to test when the afterimage is strongest. Pause the animation if the motion feels uncomfortable.`,
  'illusion.rotating-necker-cube.description': `The preview animates an ambiguous wireframe cube while its angle and highlighted edges gently shift.

The cube can flip between two depth readings, so the front and back faces may trade places in your perception.

Turn Guide on to alternate between the two possible front faces. Depth, angle, line width, contrast, and face colors help make the reversal easier to inspect.`
};

const fr: DescriptionDictionary = {
  'illusion.cafe-wall.description': `L’aperçu montre des rangées décalées de carreaux clairs et sombres séparés par de fines lignes de joint.

Même si les rangées sont horizontales, le décalage des bords peut faire paraître les joints inclinés.

Activez le guide pour superposer une grille carrée sur tout l’aperçu. La largeur des joints, le décalage des rangées et le contraste font apparaître ou disparaître l’inclinaison.`,
  'illusion.hermann-grid.description': `L’aperçu ne contient qu’une grille claire sur fond sombre. Aucun point n’est réellement dessiné aux intersections.

Quand vous regardez près des intersections, sans les fixer directement, de petites taches sombres peuvent apparaître brièvement dans la grille autour du regard.

Activez le guide pour marquer toutes les intersections. Le nombre de cases, l’épaisseur des lignes, le contraste et la couleur du guide aident à vérifier quand les taches illusoires apparaissent.`,
  'illusion.muller-lyer.description': `L’aperçu montre deux segments de même longueur avec des ailettes en forme de flèches orientées différemment.

Les lignes centrales sont égales, mais les ailettes peuvent faire paraître l’une plus longue que l’autre.

Activez le guide pour superposer une grille carrée. La longueur et l’angle des ailettes, la longueur des lignes et l’espacement permettent de comparer la mesure réelle avec l’impression perçue.`,
  'illusion.ponzo.description': `L’aperçu place deux barres horizontales égales entre des lignes de perspective qui convergent.

La barre proche de la partie étroite peut sembler plus longue, parce que l’arrière-plan suggère de la profondeur.

Activez le guide pour superposer une grille carrée. Les repères de profondeur, l’horizon, la longueur des lignes, l’espacement et le contraste modifient la force du contexte de perspective.`,
  'illusion.poggendorff.description': `L’aperçu montre une diagonale interrompue par une bande verticale qui la masque.

Même lorsque les deux morceaux appartiennent à une seule ligne droite, la partie cachée peut les faire paraître décalés.

Affichez ou masquez la bande et la ligne guide, puis ajustez l’angle, l’écart et l’épaisseur de ligne pour tester l’alignement.`,
  'illusion.zollner.description': `L’aperçu montre de longues lignes parallèles croisées par de nombreux petits traits inclinés.

Ces petits traits peuvent faire paraître les longues lignes inclinées les unes par rapport aux autres.

Masquez le contexte pour voir les lignes seules, ou activez le guide pour ajouter une grille carrée. L’angle des traits, leur nombre, le nombre de bandes et l’épaisseur des lignes règlent l’impression d’inclinaison.`,
  'illusion.hering.description': `L’aperçu montre des lignes droites parallèles posées sur des lignes de fond rayonnantes.

Ce fond rayonnant peut faire paraître les droites comme si elles se courbaient vers l’extérieur.

Masquez le contexte pour voir les droites seules, ou activez le guide pour superposer une grille carrée. Le nombre de lignes, l’écartement, l’épaisseur et le contraste changent l’effet.`,
  'illusion.vertical-horizontal.description': `L’aperçu montre une ligne verticale et une ligne horizontale qui se rejoignent au même point. Les deux lignes cibles ont la même longueur physique.

Beaucoup de personnes ressentent pourtant la verticale comme plus longue, car l’étendue verticale et l’étendue horizontale ne sont pas jugées de la même façon.

Activez le guide pour superposer une grille carrée. La longueur, l’écart et l’épaisseur des lignes aident à voir quand l’égalité devient plus facile à accepter.`,
  'illusion.ebbinghaus.description': `L’aperçu montre des cercles centraux égaux entourés par des cercles de contexte différents.

De grands ou de petits cercles autour du centre peuvent faire paraître le même cercle plus petit ou plus grand.

Masquez le contexte pour enlever les cercles autour, ou activez le guide pour ajouter une grille carrée. Le rayon, le nombre, l’écart et l’échelle des cercles autour modifient l’effet.`,
  'illusion.delboeuf.description': `L’aperçu montre des cercles centraux égaux encadrés par des anneaux.

La taille et la distance de ces anneaux peuvent faire paraître les cercles centraux de tailles différentes.

Activez le guide pour superposer une grille carrée. Le rayon du centre, le rayon de l’anneau, la séparation et l’épaisseur de ligne changent l’effet de cadrage.`,
  'illusion.sander-parallelogram.description': `L’aperçu montre deux lignes cibles inclinées de même longueur dans des cadres déformés différemment.

Même si les lignes cibles sont égales, le cadre d’un côté peut donner l’impression qu’une ligne est plus longue.

Masquez le contexte pour voir les lignes seules, ou activez le guide pour superposer une grille carrée. L’angle, la séparation et l’épaisseur de ligne changent l’influence des cadres.`,
  'illusion.kanizsa-triangle.description': `L’aperçu dispose trois disques noirs découpés et trois formes d’angle autour d’un centre vide.

Le système visuel peut compléter les bords manquants et faire apparaître un triangle clair qui n’est pas réellement tracé.

Activez le guide pour montrer le triangle que l’œil complète. Le rayon des disques et l’épaisseur des lignes changent le moment où ce triangle invisible devient convaincant.`,
  'illusion.rubin-vase.description': `L’aperçu montre une forme claire de vase au centre, entre deux régions sombres.

La même frontière peut être lue comme le bord du vase ou comme deux profils de visage qui se regardent.

Activez le guide pour tracer le vase, les deux profils et l’axe central. La largeur du vase, la profondeur des profils, la largeur du col et les couleurs changent l’interprétation la plus stable.`,
  'illusion.simultaneous-contrast.description': `L’aperçu place des couleurs centrales identiques sur des arrière-plans différents.

La même couleur centrale peut paraître plus claire sur un fond sombre et plus sombre sur un fond clair.

Activez le guide pour dessiner des échantillons diagonaux de même couleur sur les deux zones. Le rayon central, le contraste et les couleurs permettent de comparer directement les pastilles.`,
  'illusion.whites-illusion.description': `L’aperçu place des cibles grises égales sur des bandes alternées claires et sombres.

Le motif de bandes autour des cibles peut faire paraître ces gris identiques de luminosité différente.

Activez le guide pour dessiner des échantillons diagonaux du même gris sur les régions cibles. Le nombre de bandes, l’épaisseur des lignes, le contraste et les couleurs aident à comparer les cibles.`,
  'illusion.cornsweet.description': `L’aperçu montre deux grandes régions séparées par un bord étroit et ombré.

Même si les grandes régions peuvent avoir la même luminosité, le bord fait paraître un côté plus clair que l’autre.

Activez le guide pour comparer des zones échantillons égales. La largeur du bord, le contraste et les couleurs changent la force du décalage de luminosité.`,
  'illusion.lilac-chaser.description': `L’aperçu montre des points lilas disposés en cercle, avec une position manquante qui tourne.

Quand ce vide se déplace, vous pouvez voir une image rémanente mobile ou un point verdâtre qui n’est pas directement dessiné.

Utilisez la vitesse, le rayon, le nombre de points et le contraste pour chercher le moment où l’image rémanente est la plus forte. Mettez l’animation en pause si le mouvement devient inconfortable.`,
  'illusion.rotating-necker-cube.description': `L’aperçu anime un cube filaire ambigu pendant que son angle et ses arêtes mises en évidence se déplacent doucement.

Le cube peut basculer entre deux lectures de profondeur, de sorte que les faces avant et arrière semblent parfois échanger leur place.

Activez le guide pour alterner entre les deux faces avant possibles. La profondeur, l’angle, l’épaisseur des lignes, le contraste et les couleurs de face rendent l’inversion plus facile à examiner.`
};

const es: DescriptionDictionary = {
  'illusion.cafe-wall.description': `La vista previa muestra filas desplazadas de baldosas claras y oscuras separadas por líneas finas de mortero.

Aunque las filas son horizontales, los bordes escalonados pueden hacer que el mortero parezca inclinado.

Activa la guía para superponer una cuadrícula cuadrada en toda la vista previa. El ancho del mortero, el desplazamiento de las filas y el contraste cambian cuándo aparece o desaparece la inclinación.`,
  'illusion.hermann-grid.description': `La vista previa muestra solo una cuadrícula clara sobre un fondo oscuro. No hay puntos dibujados realmente en las intersecciones.

Cuando miras cerca, pero no directamente, a las intersecciones, pueden aparecer brevemente manchas oscuras en la cuadrícula periférica.

Activa la guía para marcar todas las intersecciones. El número de líneas, el grosor, el contraste y el color de la guía ayudan a comprobar cuándo aparecen los puntos ilusorios.`,
  'illusion.muller-lyer.description': `La vista previa muestra dos segmentos de la misma longitud con aletas parecidas a flechas orientadas en direcciones distintas.

Las líneas centrales miden lo mismo, pero las aletas pueden hacer que una parezca más larga que la otra.

Activa la guía para superponer una cuadrícula cuadrada. La longitud y el ángulo de las aletas, la longitud de la línea y la separación permiten comparar la igualdad medida con la diferencia percibida.`,
  'illusion.ponzo.description': `La vista previa coloca barras horizontales iguales entre líneas de perspectiva convergentes.

La barra cercana al extremo estrecho puede parecer más larga porque el fondo sugiere profundidad.

Activa la guía para superponer una cuadrícula cuadrada. Las guías de profundidad, el horizonte, la longitud de línea, la separación y el contraste cambian la fuerza del contexto de perspectiva.`,
  'illusion.poggendorff.description': `La vista previa muestra una línea diagonal interrumpida por una banda vertical que la oculta.

Aunque los segmentos diagonales pertenezcan a una misma trayectoria recta, la parte escondida puede hacer que parezcan desalineados.

Muestra u oculta la banda y la línea guía, y ajusta el ángulo, la separación y el grosor de línea para comprobar la alineación.`,
  'illusion.zollner.description': `La vista previa muestra líneas largas paralelas cruzadas por muchos trazos cortos inclinados.

Los trazos cortos hacen que las líneas paralelas parezcan inclinarse unas respecto de otras.

Oculta el contexto para ver solo las líneas, o activa la guía para superponer una cuadrícula cuadrada. El ángulo de cruce, el número de segmentos, el número de franjas y el grosor controlan la impresión de inclinación.`,
  'illusion.hering.description': `La vista previa muestra líneas rectas paralelas colocadas sobre líneas de fondo radiantes.

El contexto radial puede hacer que las líneas rectas parezcan curvarse hacia fuera.

Oculta el contexto para ver las rectas solas, o activa la guía para superponer una cuadrícula cuadrada. El número de rayas, la separación, el grosor y el contraste cambian el efecto.`,
  'illusion.vertical-horizontal.description': `La vista previa muestra una línea vertical y una horizontal que se encuentran en el mismo punto. Las dos líneas objetivo tienen la misma longitud física.

Muchas personas sienten que la vertical es más larga, porque juzgamos de forma distinta la extensión vertical y la horizontal.

Activa la guía para superponer una cuadrícula cuadrada. La longitud, la separación y el grosor de línea ayudan a probar cuándo la igualdad resulta más fácil de creer.`,
  'illusion.ebbinghaus.description': `La vista previa muestra círculos centrales iguales rodeados por círculos de contexto distintos.

Los círculos grandes o pequeños del entorno pueden hacer que el mismo centro parezca menor o mayor.

Oculta el contexto para quitar los círculos externos, o activa la guía para superponer una cuadrícula cuadrada. El radio, el número, la separación y la escala de los círculos externos cambian el efecto.`,
  'illusion.delboeuf.description': `La vista previa muestra círculos centrales iguales enmarcados por anillos.

El tamaño y la distancia de los anillos pueden hacer que los centros iguales parezcan de tamaños distintos.

Activa la guía para superponer una cuadrícula cuadrada. El radio central, el radio del anillo, la separación y el grosor de línea cambian el efecto de encuadre.`,
  'illusion.sander-parallelogram.description': `La vista previa muestra dos líneas objetivo inclinadas e iguales dentro de marcos sesgados de forma diferente.

Aunque las líneas objetivo miden lo mismo, el marco de un lado puede hacer que una parezca más larga.

Oculta el contexto para ver las líneas solas, o activa la guía para superponer una cuadrícula cuadrada. El ángulo, la separación y el grosor cambian la influencia de los marcos.`,
  'illusion.kanizsa-triangle.description': `La vista previa coloca tres discos negros recortados y tres formas de esquina alrededor de un centro vacío.

El sistema visual puede completar los bordes que faltan y ver un triángulo claro que en realidad no está dibujado.

Activa la guía para mostrar el triángulo que completa la mirada. El radio de los discos y el grosor de línea cambian cuándo el triángulo invisible resulta convincente.`,
  'illusion.rubin-vase.description': `La vista previa muestra una forma clara de jarrón central entre dos regiones oscuras.

El mismo borde puede leerse como el contorno del jarrón o como dos perfiles faciales que se miran.

Activa la guía para trazar el jarrón, los dos perfiles y el eje central. El ancho del jarrón, la profundidad del perfil, el ancho del cuello y los colores cambian qué interpretación es más fácil de mantener.`,
  'illusion.simultaneous-contrast.description': `La vista previa coloca colores centrales idénticos sobre fondos diferentes.

El mismo color central puede parecer más claro sobre un entorno oscuro y más oscuro sobre un entorno claro.

Activa la guía para dibujar muestras diagonales del mismo color en ambas zonas. El radio central, el contraste y los colores permiten comparar directamente las muestras.`,
  'illusion.whites-illusion.description': `La vista previa coloca objetivos grises iguales sobre franjas alternas claras y oscuras.

El patrón de franjas que rodea los objetivos puede hacer que los grises idénticos parezcan de distinta luminosidad.

Activa la guía para dibujar muestras diagonales del mismo gris sobre las regiones objetivo. El número de franjas, el grosor de línea, el contraste y los colores ayudan a comparar los objetivos.`,
  'illusion.cornsweet.description': `La vista previa muestra dos regiones grandes divididas por un borde estrecho sombreado.

Aunque las regiones amplias pueden tener la misma luminosidad, el borde hace que un lado parezca más claro.

Activa la guía para comparar áreas de muestra iguales. El ancho del borde, el contraste y las opciones de color cambian la fuerza del desplazamiento de brillo.`,
  'illusion.lilac-chaser.description': `La vista previa muestra puntos lilas en círculo con una posición ausente que gira alrededor.

Al moverse el hueco, puedes ver una postimagen móvil o un punto verdoso que no está dibujado directamente.

Usa la velocidad, el radio, el número de puntos y el contraste para probar cuándo la postimagen es más intensa. Pausa la animación si el movimiento resulta incómodo.`,
  'illusion.rotating-necker-cube.description': `La vista previa anima un cubo de alambre ambiguo mientras su ángulo y sus aristas resaltadas cambian suavemente.

El cubo puede alternar entre dos lecturas de profundidad, de modo que las caras delantera y trasera parecen intercambiarse.

Activa la guía para alternar entre las dos posibles caras delanteras. La profundidad, el ángulo, el grosor de línea, el contraste y los colores de las caras facilitan examinar la inversión.`
};

const de: DescriptionDictionary = {
  'illusion.cafe-wall.description': `Die Vorschau zeigt versetzte Reihen heller und dunkler Kacheln, getrennt durch dünne Fugen.

Obwohl die Reihen waagerecht sind, können die versetzten Kanten die Fugen schräg erscheinen lassen.

Schalten Sie die Hilfsanzeige ein, um ein quadratisches Raster über die ganze Vorschau zu legen. Fugenbreite, Reihenversatz und Kontrast verändern, wann die Neigung sichtbar wird oder verschwindet.`,
  'illusion.hermann-grid.description': `Die Vorschau zeigt nur ein helles Gitter auf dunklem Hintergrund. An den Kreuzungen sind keine Punkte gezeichnet.

Wenn Sie nahe an die Kreuzungen schauen, sie aber nicht direkt fixieren, können im umgebenden Gitter kurz dunkle Flecken erscheinen.

Schalten Sie die Hilfsanzeige ein, um alle Kreuzungen zu markieren. Gitterzahl, Linienbreite, Kontrast und Hilfsfarbe helfen zu prüfen, wann die Scheinpunkte auftreten.`,
  'illusion.muller-lyer.description': `Die Vorschau zeigt zwei gleich lange Liniensegmente mit pfeilartigen Flügeln in unterschiedlicher Richtung.

Die mittleren Linien sind gleich lang, aber die Flügel können eine Linie länger wirken lassen als die andere.

Schalten Sie die Hilfsanzeige ein, um ein quadratisches Raster einzublenden. Flügellänge, Flügelwinkel, Linienlänge und Abstand machen den Vergleich zwischen Messung und Wahrnehmung leichter.`,
  'illusion.ponzo.description': `Die Vorschau setzt gleich lange waagerechte Balken zwischen zusammenlaufende Perspektivlinien.

Der Balken nahe am engen Ende kann länger wirken, weil der Hintergrund Tiefe andeutet.

Schalten Sie die Hilfsanzeige ein, um ein quadratisches Raster einzublenden. Tiefenlinien, Horizont, Linienlänge, Abstand und Kontrast verändern die Stärke des Perspektivkontexts.`,
  'illusion.poggendorff.description': `Die Vorschau zeigt eine Diagonale, die von einem senkrechten verdeckenden Band unterbrochen wird.

Auch wenn die Diagonalstücke zu einer geraden Linie gehören, kann der verborgene Mittelteil sie versetzt erscheinen lassen.

Blenden Sie Verdecker oder Hilfslinie ein und aus, und ändern Sie Winkel, Lücke und Linienbreite, um die Ausrichtung zu prüfen.`,
  'illusion.zollner.description': `Die Vorschau zeigt lange parallele Linien, die von vielen kurzen schrägen Strichen gekreuzt werden.

Diese kurzen Striche lassen die parallelen Linien scheinbar voneinander wegkippen.

Blenden Sie den Kontext aus, um nur die langen Linien zu sehen, oder schalten Sie die Hilfsanzeige mit quadratischem Raster ein. Kreuzungswinkel, Segmentzahl, Streifenzahl und Linienbreite steuern den Kippeindruck.`,
  'illusion.hering.description': `Die Vorschau zeigt gerade parallele Linien über einem strahlenförmigen Hintergrund.

Der strahlenförmige Kontext kann die geraden Linien nach außen gebogen erscheinen lassen.

Blenden Sie den Kontext aus, um die Geraden allein zu sehen, oder schalten Sie die Hilfsanzeige mit quadratischem Raster ein. Streifenzahl, Abstand, Linienbreite und Kontrast verändern den Effekt.`,
  'illusion.vertical-horizontal.description': `Die Vorschau zeigt eine senkrechte und eine waagerechte Linie, die sich am selben Punkt treffen. Beide Ziellinien sind physisch gleich lang.

Viele Betrachter empfinden die senkrechte Linie dennoch als länger, weil vertikale und horizontale Ausdehnung unterschiedlich beurteilt werden.

Schalten Sie die Hilfsanzeige ein, um ein quadratisches Raster einzublenden. Linienlänge, Abstand und Linienbreite helfen zu prüfen, wann die Gleichheit am leichtesten erkennbar ist.`,
  'illusion.ebbinghaus.description': `Die Vorschau zeigt gleiche Mittelkreise, die von unterschiedlichen Kontextkreisen umgeben sind.

Große oder kleine Kreise in der Umgebung können denselben Mittelkreis kleiner oder größer wirken lassen.

Blenden Sie den Kontext aus, um die Umgebungskreise zu entfernen, oder schalten Sie die Hilfsanzeige mit quadratischem Raster ein. Radius, Anzahl, Abstand und Skalierung der Umgebungskreise verändern den Effekt.`,
  'illusion.delboeuf.description': `Die Vorschau zeigt gleiche Mittelkreise, die von Ringen gerahmt werden.

Größe und Abstand der Ringe können die gleichen Mittelkreise unterschiedlich groß erscheinen lassen.

Schalten Sie die Hilfsanzeige ein, um ein quadratisches Raster einzublenden. Mittelradius, Ringradius, Abstand und Linienbreite verändern den Rahmungseffekt.`,
  'illusion.sander-parallelogram.description': `Die Vorschau zeigt zwei gleich lange schräge Ziellinien in unterschiedlich verzerrten Rahmen.

Obwohl die Ziellinien gleich lang sind, kann der Rahmen auf einer Seite eine Linie länger wirken lassen.

Blenden Sie den Kontext aus, um nur die Ziellinien zu sehen, oder schalten Sie die Hilfsanzeige mit quadratischem Raster ein. Winkel, Abstand und Linienbreite verändern die Wirkung der Rahmen.`,
  'illusion.kanizsa-triangle.description': `Die Vorschau ordnet drei schwarze ausgesparte Scheiben und drei schwarze Eckformen um eine leere Mitte an.

Das visuelle System kann die fehlenden Kanten ergänzen und ein helles Dreieck sehen, das nicht wirklich gezeichnet ist.

Schalten Sie die Hilfsanzeige ein, um das ergänzte Dreieck zu zeigen. Scheibenradius und Linienbreite verändern, wann das unsichtbare Dreieck überzeugend wirkt.`,
  'illusion.rubin-vase.description': `Die Vorschau zeigt eine helle mittlere Vasenform zwischen zwei dunklen Seitenbereichen.

Dieselbe Grenze kann als Rand der Vase oder als zwei einander anschauende Gesichtsprofile gelesen werden.

Schalten Sie die Hilfsanzeige ein, um Vase, beide Profile und die Mittelachse zu umreißen. Vasenbreite, Profiltiefe, Halsbreite und Farben verändern, welche Deutung leichter stabil bleibt.`,
  'illusion.simultaneous-contrast.description': `Die Vorschau legt identische Mittelfarben auf unterschiedliche Hintergründe.

Dieselbe Mittelfarbe kann auf dunkler Umgebung heller und auf heller Umgebung dunkler wirken.

Schalten Sie die Hilfsanzeige ein, um gleichfarbige diagonale Proben über beide Felder zu zeichnen. Mittelradius, Kontrast und Farben erlauben den direkten Vergleich.`,
  'illusion.whites-illusion.description': `Die Vorschau setzt gleiche graue Zielbereiche auf abwechselnd helle und dunkle Streifen.

Das umgebende Streifenmuster kann die gleichen Grautöne unterschiedlich hell wirken lassen.

Schalten Sie die Hilfsanzeige ein, um gleichgraue diagonale Proben über die Zielbereiche zu zeichnen. Streifenzahl, Linienbreite, Kontrast und Farben helfen beim Vergleich.`,
  'illusion.cornsweet.description': `Die Vorschau zeigt zwei große Flächen, die durch eine schmale Schattierungskante getrennt sind.

Obwohl die breiten Flächen gleich hell sein können, lässt die Kante eine Seite heller erscheinen.

Schalten Sie die Hilfsanzeige ein, um gleiche Probenflächen zu vergleichen. Kantenbreite, Kontrast und Farben verändern die Stärke der Helligkeitsverschiebung.`,
  'illusion.lilac-chaser.description': `Die Vorschau zeigt lilafarbene Punkte im Kreis, wobei eine fehlende Position um den Ring rotiert.

Wenn die Lücke wandert, können Sie ein bewegtes Nachbild oder einen grünlichen Punkt sehen, der nicht direkt gezeichnet ist.

Nutzen Sie Geschwindigkeit, Radius, Punktzahl und Kontrast, um die stärkste Nachbildwirkung zu finden. Pausieren Sie die Animation, wenn die Bewegung unangenehm wirkt.`,
  'illusion.rotating-necker-cube.description': `Die Vorschau animiert einen mehrdeutigen Drahtwürfel, während Winkel und hervorgehobene Kanten sanft wechseln.

Der Würfel kann zwischen zwei Tiefenlesarten kippen, sodass Vorder- und Rückseite in der Wahrnehmung die Plätze tauschen.

Schalten Sie die Hilfsanzeige ein, um zwischen den zwei möglichen Vorderflächen zu wechseln. Tiefe, Winkel, Linienbreite, Kontrast und Flächenfarben erleichtern die Prüfung der Umkehr.`
};

const ja: DescriptionDictionary = {
  'illusion.cafe-wall.description': `プレビューには、明るいタイルと暗いタイルの列が、細い目地をはさんで少しずつずれて並んでいます。

タイルの列そのものは水平ですが、ずれた端と細い目地の組み合わせにより、水平な目地が斜めに傾いて見えることがあります。

ガイドをオンにすると、プレビュー全体に正方形のグリッドを重ねます。目地の幅、列のずれ、コントラストを変えると、傾きが出やすい条件と消えやすい条件を比べられます。`,
  'illusion.hermann-grid.description': `プレビューには、暗い背景の上に明るい格子だけが描かれています。格子の交点には、実際の点は描かれていません。

交点そのものをじっと見るのではなく、その近くを見ると、周辺視野の交点に一瞬だけ暗い点が見えることがあります。

ガイドをオンにすると、すべての交点に印を出します。格子の数、線の太さ、コントラスト、ガイドの色を変えると、存在しない暗点が出やすい条件を確認できます。`,
  'illusion.muller-lyer.description': `プレビューには、同じ長さの2本の線分があり、それぞれに向きの違う矢羽のような線が付いています。

中央の線分は同じ長さですが、矢羽の向きによって、一方がもう一方より長く見えることがあります。

ガイドをオンにすると、正方形のグリッドを重ねます。矢羽の長さや角度、線分の長さ、上下の間隔を変えると、実際の長さと見かけの長さを比べやすくなります。`,
  'illusion.ponzo.description': `プレビューには、奥へ向かって収束するような2本の線の間に、同じ長さの水平線が置かれています。

狭くなっている側に近い線は、背景が奥行きを示しているため、同じ長さでも長く見えることがあります。

ガイドをオンにすると、正方形のグリッドを重ねます。奥行きの線、地平線、線の長さ、間隔、コントラストを変えると、遠近の文脈がどれくらい効くかを試せます。`,
  'illusion.poggendorff.description': `プレビューには、一本の斜め線が中央の縦の帯で隠されているように描かれています。

左右の斜め線が本当は一直線上にあっても、中央が隠れることで、ずれているように見えることがあります。

遮蔽物やガイド線を切り替え、角度、隙間、線の太さを調整すると、どの条件で一直線だと分かりにくくなるか確認できます。`,
  'illusion.zollner.description': `プレビューには、長い平行線の上に、短い斜め線がたくさん交差して描かれています。

短い交差線の向きに引っ張られて、本来は平行な長い線が互いに傾いているように見えることがあります。

背景文脈を消すと長い線だけを確認できます。ガイドをオンにすると正方形のグリッドを重ねられ、交差角度、線の数、帯の数、線の太さで錯視の強さを試せます。`,
  'illusion.hering.description': `プレビューには、放射状に広がる背景線の上に、まっすぐな平行線が置かれています。

背景の放射線に影響されて、まっすぐな平行線が外側へふくらむように曲がって見えることがあります。

背景文脈をオフにすると平行線だけを確認できます。ガイドをオンにすると正方形のグリッドを重ねられ、線の数、間隔、太さ、コントラストで見え方を比べられます。`,
  'illusion.vertical-horizontal.description': `プレビューには、同じ点から伸びる垂直線と水平線が描かれています。2本の対象線は、実際には同じ長さです。

それでも、多くの場合は垂直線の方が長く感じられます。縦方向の広がりと横方向の広がりを、私たちが同じようには判断しないためです。

ガイドをオンにすると、正方形のグリッドを重ねます。線の長さ、隙間、太さを変えると、同じ長さだと納得しやすい条件を探せます。`,
  'illusion.ebbinghaus.description': `プレビューには、同じ大きさの中央円が、それぞれ違う大きさの周辺円に囲まれて描かれています。

周りの円が大きいか小さいかによって、同じ中央円でも小さく見えたり大きく見えたりします。

周辺の文脈をオフにすると中央円だけを確認できます。ガイドをオンにすると正方形のグリッドを重ねられ、周辺円の大きさ、数、隙間、倍率で効果を比べられます。`,
  'illusion.delboeuf.description': `プレビューには、同じ大きさの中央円が、周囲の輪に囲まれて描かれています。

周りの輪の大きさや中央円との距離によって、同じ中央円が違う大きさに見えることがあります。

ガイドをオンにすると、正方形のグリッドを重ねます。中央円の半径、周囲の輪の半径、左右の間隔、線の太さを変えると、囲み方の影響を確認できます。`,
  'illusion.sander-parallelogram.description': `プレビューには、形の違う斜めの枠の中に、同じ長さの対象線が2本描かれています。

対象線は同じ長さですが、周囲の平行四辺形の文脈により、一方が長く見えることがあります。

文脈をオフにすると対象線だけを確認できます。ガイドをオンにすると正方形のグリッドを重ねられ、角度、間隔、線の太さで枠の影響を試せます。`,
  'illusion.kanizsa-triangle.description': `プレビューには、欠けた黒い円と、黒い角型の図形が、空白の中心を囲むように配置されています。

実際には三角形の線は描かれていませんが、欠けた部分を目が補って、白い三角形が浮かんでいるように見えることがあります。

ガイドをオンにすると、目が補っている三角形の位置を示します。円の半径や線の太さを変えると、見えない三角形が成立しやすい条件を探せます。`,
  'illusion.rubin-vase.description': `プレビューには、中央に明るい壺の形があり、その左右に暗い領域が広がっています。

同じ境界線を、壺の輪郭として見ることも、向かい合う2人の横顔として見ることもできます。

ガイドをオンにすると、壺、左右の顔の輪郭、中心軸を示します。壺の幅、顔の凹凸の深さ、首の幅、色を変えると、どちらの見方が優勢になるかを試せます。`,
  'illusion.simultaneous-contrast.description': `プレビューには、同じ中央色が、明るさの違う背景の上に置かれています。

中央色は同一でも、暗い背景の上では明るく、明るい背景の上では暗く見えることがあります。

ガイドをオンにすると、両方の領域に同じ色の斜線サンプルを表示します。中央の大きさ、コントラスト、色を変えると、実際に同じ色であることを確認しやすくなります。`,
  'illusion.whites-illusion.description': `プレビューには、明るい縞と暗い縞の上に、同じ灰色の対象が置かれています。

対象の灰色は同じですが、周囲の縞模様によって、一方が明るく、もう一方が暗く見えることがあります。

ガイドをオンにすると、対象領域をまたぐ同じ灰色の斜線サンプルを表示します。縞の数、線の太さ、コントラスト、色を変えると、比較しやすい条件を探せます。`,
  'illusion.cornsweet.description': `プレビューには、2つの広い領域が、細い陰影の境界で分けられて描かれています。

広い領域そのものは同じ明るさでも、境界の陰影により、片側がもう片側より明るく見えることがあります。

ガイドをオンにすると、同じ明るさのサンプル領域を比較できます。境界の幅、コントラスト、色を変えると、明るさのずれが強く出る条件を確認できます。`,
  'illusion.lilac-chaser.description': `プレビューには、円形に並んだライラック色の点があり、欠けた位置が輪の上を回っていきます。

欠けた位置が動くにつれて、実際には描かれていない緑がかった点や、動く残像のようなものが見えることがあります。

速度、半径、点の数、コントラストを変えると、残像が出やすい条件を探せます。動きがつらいと感じる場合は、アニメーションを一時停止してください。`,
  'illusion.rotating-necker-cube.description': `プレビューには、奥行きの解釈があいまいな線画の立方体が、角度や強調線を少しずつ変えながら動いています。

立方体は、手前と奥の面が入れ替わるように見えることがあり、どちらが前なのかが途中で反転して感じられます。

ガイドをオンにすると、2つの手前候補の面を交互に示します。奥行き、角度、線の太さ、コントラスト、面の色を変えると、反転の見え方を確認しやすくなります。`
};

const zhHans: DescriptionDictionary = {
  'illusion.cafe-wall.description': `预览中，浅色和深色方块按行错开排列，中间隔着很细的缝隙。

这些行本身是水平的，但错开的边缘和细缝会让水平缝隙看起来像是倾斜的。

打开辅助显示后，会在整个预览上叠加正方形网格。缝隙宽度、行偏移和对比度会改变倾斜感出现或消失的条件。`,
  'illusion.hermann-grid.description': `预览中只有深色背景上的明亮网格。交点处并没有真正画出任何点。

当你看交点附近、但不直接盯着交点时，周边视野中的交点可能会短暂出现暗点。

打开辅助显示后，会标出所有交点。网格数量、线宽、对比度和辅助显示颜色可以帮助确认虚假暗点何时出现。`,
  'illusion.muller-lyer.description': `预览中有两条等长线段，并带有方向不同的箭羽状线条。

中央线段实际长度相同，但箭羽方向会让其中一条看起来更长。

打开辅助显示后，会叠加正方形网格。箭羽长度、箭羽角度、线段长度和间距可以用来比较实际相等与视觉差异。`,
  'illusion.ponzo.description': `预览中，两条等长水平线放在向远处汇聚的透视线之间。

靠近狭窄一端的线可能看起来更长，因为背景暗示了深度。

打开辅助显示后，会叠加正方形网格。深度辅助线、地平线、线长、间距和对比度会改变透视背景的影响。`,
  'illusion.poggendorff.description': `预览中，一条斜线被中间的垂直遮挡带打断。

即使左右两段本来在同一直线上，被遮住的中间部分也会让它们看起来错位。

切换遮挡物或辅助线，并调整角度、间隙和线宽，可以测试什么时候最难判断对齐。`,
  'illusion.zollner.description': `预览中，长平行线被许多短斜线交叉穿过。

这些短斜线会让本来平行的长线看起来彼此倾斜。

关闭背景线索可以只看长线，打开辅助显示可以叠加正方形网格。交叉角度、分段数、条纹数和线宽会控制倾斜感。`,
  'illusion.hering.description': `预览中，直的平行线叠在放射状背景线上。

放射状背景会让这些直线看起来向外弯曲。

关闭背景线索可以单独查看直线，打开辅助显示可以叠加正方形网格。线条数量、间距、线宽和对比度会改变效果。`,
  'illusion.vertical-horizontal.description': `预览中，一条垂直线和一条水平线从同一点伸出。两条目标线的实际长度相同。

很多人会觉得垂直线更长，因为人对垂直范围和水平范围的判断并不完全相同。

打开辅助显示后，会叠加正方形网格。线长、间隙和线宽可以帮助确认何时最容易相信它们相等。`,
  'illusion.ebbinghaus.description': `预览中，等大的中心圆被不同大小的周围圆包围。

周围圆较大或较小时，同一个中心圆可能看起来更小或更大。

关闭背景线索可以去掉周围圆，打开辅助显示可以叠加正方形网格。周围圆半径、数量、间隙和比例会改变背景影响。`,
  'illusion.delboeuf.description': `预览中，等大的中心圆被外侧圆环围住。

圆环的大小和距离会让相同的中心圆看起来大小不同。

打开辅助显示后，会叠加正方形网格。中心半径、外环半径、分隔距离和线宽会改变包围效果。`,
  'illusion.sander-parallelogram.description': `预览中，两条等长的倾斜目标线位于形状不同的斜框内。

目标线实际相等，但一侧的框架会让其中一条看起来更长。

关闭背景线索可以只看目标线，打开辅助显示可以叠加正方形网格。角度、分隔距离和线宽会改变框架的影响。`,
  'illusion.kanizsa-triangle.description': `预览中，三个黑色缺口圆和三个黑色角形围绕空白中心排列。

视觉系统可能会补全缺失边缘，从而看到一个并未真正画出的明亮三角形。

打开辅助显示后，会显示眼睛正在补全的三角形。点半径和线宽会改变这个隐形三角形是否容易成立。`,
  'illusion.rubin-vase.description': `预览中，两个深色区域之间有一个浅色的中央花瓶形状。

同一条边界既可以被看作花瓶边缘，也可以被看作两张相对的侧脸。

打开辅助显示后，会描出花瓶、两侧人脸轮廓和中心轴。花瓶宽度、轮廓深度、瓶颈宽度和颜色会改变哪种解释更容易保持。`,
  'illusion.simultaneous-contrast.description': `预览中，相同的中心颜色放在不同背景上。

同一个中心色在深色背景上可能显得更亮，在浅色背景上可能显得更暗。

打开辅助显示后，会在两个区域上画出同色斜线样本。中心半径、对比度和颜色可以帮助直接比较这些色块。`,
  'illusion.whites-illusion.description': `预览中，相同灰色目标放在明暗交替的条纹上。

周围条纹图案会让相同灰色目标看起来亮度不同。

打开辅助显示后，会在目标区域上画出同灰色斜线样本。条纹数量、线宽、对比度和颜色可以帮助比较目标。`,
  'illusion.cornsweet.description': `预览中，两个大区域被一条窄窄的阴影边缘分开。

即使大区域本身亮度相同，这条边缘也会让一侧看起来更亮。

打开辅助显示后，可以比较相同亮度的样本区域。边缘宽度、对比度和颜色会改变亮度偏移的强度。`,
  'illusion.lilac-chaser.description': `预览中，丁香色点围成一圈，其中一个缺口沿圆环旋转。

当缺口移动时，你可能会看到移动残像，或看到一个并未直接绘制的绿色点。

调整速度、半径、点数和对比度，可以测试残像最明显的条件。如果运动让你不舒服，可以暂停动画。`,
  'illusion.rotating-necker-cube.description': `预览中，一个深度解释模糊的线框立方体在缓慢改变角度和高亮边。

这个立方体可能在两种深度解读之间翻转，让前面和后面的面在感知中交换位置。

打开辅助显示后，会交替显示两个可能的前方面。深度、角度、线宽、对比度和面颜色可以帮助观察这种翻转。`
};

const zhHant: DescriptionDictionary = {
  'illusion.cafe-wall.description': `預覽中，淺色與深色方塊按列錯開排列，中間隔著很細的縫隙。

這些列本身是水平的，但錯開的邊緣與細縫會讓水平縫隙看起來像是傾斜的。

開啟輔助顯示後，會在整個預覽上疊加正方形格線。縫隙寬度、列偏移與對比度會改變傾斜感出現或消失的條件。`,
  'illusion.hermann-grid.description': `預覽中只有深色背景上的明亮格線。交點處並沒有真正畫出任何點。

當你看交點附近、但不直接盯著交點時，周邊視覺中的交點可能會短暫出現暗點。

開啟輔助顯示後，會標出所有交點。格線數量、線寬、對比度與輔助顯示顏色可以幫助確認虛假暗點何時出現。`,
  'illusion.muller-lyer.description': `預覽中有兩條等長線段，並帶有方向不同的箭羽狀線條。

中央線段實際長度相同，但箭羽方向會讓其中一條看起來更長。

開啟輔助顯示後，會疊加正方形格線。箭羽長度、箭羽角度、線段長度與間距可以用來比較實際相等與視覺差異。`,
  'illusion.ponzo.description': `預覽中，兩條等長水平線放在向遠處匯聚的透視線之間。

靠近狹窄一端的線可能看起來更長，因為背景暗示了深度。

開啟輔助顯示後，會疊加正方形格線。深度輔助線、地平線、線長、間距與對比度會改變透視背景的影響。`,
  'illusion.poggendorff.description': `預覽中，一條斜線被中間的垂直遮擋帶打斷。

即使左右兩段本來在同一直線上，被遮住的中間部分也會讓它們看起來錯位。

切換遮擋物或輔助線，並調整角度、間隙與線寬，可以測試什麼時候最難判斷對齊。`,
  'illusion.zollner.description': `預覽中，長平行線被許多短斜線交叉穿過。

這些短斜線會讓本來平行的長線看起來彼此傾斜。

關閉背景線索可以只看長線，開啟輔助顯示可以疊加正方形格線。交叉角度、分段數、條紋數與線寬會控制傾斜感。`,
  'illusion.hering.description': `預覽中，直的平行線疊在放射狀背景線上。

放射狀背景會讓這些直線看起來向外彎曲。

關閉背景線索可以單獨查看直線，開啟輔助顯示可以疊加正方形格線。線條數量、間距、線寬與對比度會改變效果。`,
  'illusion.vertical-horizontal.description': `預覽中，一條垂直線和一條水平線從同一點伸出。兩條目標線的實際長度相同。

很多人會覺得垂直線更長，因為人對垂直範圍與水平範圍的判斷並不完全相同。

開啟輔助顯示後，會疊加正方形格線。線長、間隙與線寬可以幫助確認何時最容易相信它們相等。`,
  'illusion.ebbinghaus.description': `預覽中，等大的中心圓被不同大小的周圍圓包圍。

周圍圓較大或較小時，同一個中心圓可能看起來更小或更大。

關閉背景線索可以去掉周圍圓，開啟輔助顯示可以疊加正方形格線。周圍圓半徑、數量、間隙與比例會改變背景影響。`,
  'illusion.delboeuf.description': `預覽中，等大的中心圓被外側圓環圍住。

圓環的大小與距離會讓相同的中心圓看起來大小不同。

開啟輔助顯示後，會疊加正方形格線。中心半徑、外環半徑、分隔距離與線寬會改變包圍效果。`,
  'illusion.sander-parallelogram.description': `預覽中，兩條等長的傾斜目標線位於形狀不同的斜框內。

目標線實際相等，但一側的框架會讓其中一條看起來更長。

關閉背景線索可以只看目標線，開啟輔助顯示可以疊加正方形格線。角度、分隔距離與線寬會改變框架的影響。`,
  'illusion.kanizsa-triangle.description': `預覽中，三個黑色缺口圓和三個黑色角形圍繞空白中心排列。

視覺系統可能會補全缺失邊緣，從而看到一個並未真正畫出的明亮三角形。

開啟輔助顯示後，會顯示眼睛正在補全的三角形。點半徑與線寬會改變這個隱形三角形是否容易成立。`,
  'illusion.rubin-vase.description': `預覽中，兩個深色區域之間有一個淺色的中央花瓶形狀。

同一條邊界既可以被看作花瓶邊緣，也可以被看作兩張相對的側臉。

開啟輔助顯示後，會描出花瓶、兩側人臉輪廓與中心軸。花瓶寬度、輪廓深度、瓶頸寬度與顏色會改變哪種解釋更容易保持。`,
  'illusion.simultaneous-contrast.description': `預覽中，相同的中心顏色放在不同背景上。

同一個中心色在深色背景上可能顯得更亮，在淺色背景上可能顯得更暗。

開啟輔助顯示後，會在兩個區域上畫出同色斜線樣本。中心半徑、對比度與顏色可以幫助直接比較這些色塊。`,
  'illusion.whites-illusion.description': `預覽中，相同灰色目標放在明暗交替的條紋上。

周圍條紋圖案會讓相同灰色目標看起來亮度不同。

開啟輔助顯示後，會在目標區域上畫出同灰色斜線樣本。條紋數量、線寬、對比度與顏色可以幫助比較目標。`,
  'illusion.cornsweet.description': `預覽中，兩個大區域被一條窄窄的陰影邊緣分開。

即使大區域本身亮度相同，這條邊緣也會讓一側看起來更亮。

開啟輔助顯示後，可以比較相同亮度的樣本區域。邊緣寬度、對比度與顏色會改變亮度偏移的強度。`,
  'illusion.lilac-chaser.description': `預覽中，丁香色點圍成一圈，其中一個缺口沿圓環旋轉。

當缺口移動時，你可能會看到移動殘像，或看到一個並未直接繪製的綠色點。

調整速度、半徑、點數與對比度，可以測試殘像最明顯的條件。如果運動讓你不舒服，可以暫停動畫。`,
  'illusion.rotating-necker-cube.description': `預覽中，一個深度解釋模糊的線框立方體在緩慢改變角度與高亮邊。

這個立方體可能在兩種深度解讀之間翻轉，讓前面和後面的面在感知中交換位置。

開啟輔助顯示後，會交替顯示兩個可能的前方面。深度、角度、線寬、對比度與面顏色可以幫助觀察這種翻轉。`
};

const ko: DescriptionDictionary = {
  'illusion.cafe-wall.description': `미리보기에는 밝은 타일과 어두운 타일의 줄이 얇은 틈을 사이에 두고 조금씩 어긋나게 놓여 있습니다.

타일 줄 자체는 수평이지만, 어긋난 가장자리와 얇은 틈 때문에 수평선이 기울어진 것처럼 보일 수 있습니다.

가이드를 켜면 전체 미리보기 위에 정사각형 격자가 겹쳐집니다. 틈의 너비, 줄의 어긋남, 대비를 바꾸면 기울어 보이는 조건과 사라지는 조건을 비교할 수 있습니다.`,
  'illusion.hermann-grid.description': `미리보기에는 어두운 배경 위의 밝은 격자만 그려져 있습니다. 교차점에는 실제 점이 그려져 있지 않습니다.

교차점을 직접 응시하지 않고 그 근처를 보면, 주변 시야의 교차점에 순간적으로 어두운 점이 나타날 수 있습니다.

가이드를 켜면 모든 교차점에 표시를 합니다. 격자 수, 선 두께, 대비, 가이드 색을 바꾸며 실제로 없는 어두운 점이 나타나는 조건을 확인할 수 있습니다.`,
  'illusion.muller-lyer.description': `미리보기에는 같은 길이의 선분 두 개와 서로 다른 방향의 화살깃 모양 선이 붙어 있습니다.

가운데 선분은 같은 길이지만, 화살깃의 방향 때문에 하나가 다른 하나보다 길어 보일 수 있습니다.

가이드를 켜면 정사각형 격자가 겹쳐집니다. 화살깃 길이와 각도, 선분 길이, 간격을 바꾸면 실제 길이와 지각된 차이를 비교하기 쉽습니다.`,
  'illusion.ponzo.description': `미리보기에는 멀리 모이는 듯한 원근선 사이에 같은 길이의 가로 막대가 놓여 있습니다.

좁은 쪽에 가까운 막대는 배경이 깊이를 암시하기 때문에 같은 길이여도 더 길어 보일 수 있습니다.

가이드를 켜면 정사각형 격자가 겹쳐집니다. 깊이 가이드, 지평선, 선 길이, 간격, 대비를 바꾸면 원근 맥락의 힘을 시험할 수 있습니다.`,
  'illusion.poggendorff.description': `미리보기에는 대각선 하나가 가운데의 세로 가림 띠에 의해 끊겨 보입니다.

좌우 대각선 조각이 실제로는 한 직선 위에 있어도, 숨겨진 가운데 부분 때문에 어긋난 것처럼 보일 수 있습니다.

가림 물체나 안내선을 켜고 끄면서 각도, 틈, 선 두께를 조절하면 정렬을 판단하기 어려운 조건을 확인할 수 있습니다.`,
  'illusion.zollner.description': `미리보기에는 긴 평행선 위를 많은 짧은 사선들이 가로지르고 있습니다.

짧은 사선의 방향에 끌려, 실제로는 평행한 긴 선들이 서로 기울어진 것처럼 보일 수 있습니다.

맥락을 끄면 긴 선만 볼 수 있고, 가이드를 켜면 정사각형 격자가 겹쳐집니다. 교차 각도, 선 조각 수, 줄무늬 수, 선 두께가 기울어 보이는 정도를 바꿉니다.`,
  'illusion.hering.description': `미리보기에는 방사형 배경선 위에 곧은 평행선이 놓여 있습니다.

방사형 맥락 때문에 곧은 평행선이 바깥쪽으로 휘어진 것처럼 보일 수 있습니다.

맥락을 끄면 평행선만 확인할 수 있고, 가이드를 켜면 정사각형 격자가 겹쳐집니다. 선의 수, 간격, 두께, 대비가 효과를 바꿉니다.`,
  'illusion.vertical-horizontal.description': `미리보기에는 같은 점에서 뻗는 수직선과 수평선이 그려져 있습니다. 두 목표 선의 실제 길이는 같습니다.

그런데도 많은 사람은 수직선이 더 길다고 느낍니다. 세로 방향의 크기와 가로 방향의 크기를 같은 방식으로 판단하지 않기 때문입니다.

가이드를 켜면 정사각형 격자가 겹쳐집니다. 선 길이, 틈, 선 두께를 바꾸면 두 선이 같다는 것을 믿기 쉬운 조건을 찾을 수 있습니다.`,
  'illusion.ebbinghaus.description': `미리보기에는 같은 크기의 중심 원이 서로 다른 주변 원들에 둘러싸여 있습니다.

주변 원이 크거나 작으면, 같은 중심 원도 더 작거나 더 크게 보일 수 있습니다.

맥락을 끄면 주변 원을 제거할 수 있고, 가이드를 켜면 정사각형 격자가 겹쳐집니다. 주변 원의 반지름, 개수, 틈, 배율이 맥락 효과를 바꿉니다.`,
  'illusion.delboeuf.description': `미리보기에는 같은 크기의 중심 원이 주변 고리 안에 놓여 있습니다.

고리의 크기와 거리에 따라 같은 중심 원이 서로 다른 크기로 보일 수 있습니다.

가이드를 켜면 정사각형 격자가 겹쳐집니다. 중심 반지름, 주변 고리 반지름, 분리 거리, 선 두께가 둘러싸는 효과를 바꿉니다.`,
  'illusion.sander-parallelogram.description': `미리보기에는 서로 다르게 기울어진 틀 안에 같은 길이의 사선 목표선 두 개가 있습니다.

목표선은 같은 길이지만, 한쪽의 틀이 그 선을 더 길어 보이게 만들 수 있습니다.

맥락을 끄면 목표선만 볼 수 있고, 가이드를 켜면 정사각형 격자가 겹쳐집니다. 각도, 분리 거리, 선 두께가 틀의 영향을 바꿉니다.`,
  'illusion.kanizsa-triangle.description': `미리보기에는 잘린 검은 원 세 개와 검은 모서리 모양 세 개가 빈 중심을 둘러싸고 있습니다.

시각 시스템은 빠진 가장자리를 보완해, 실제로 그려지지 않은 밝은 삼각형을 볼 수 있습니다.

가이드를 켜면 눈이 보완하고 있는 삼각형의 위치를 보여 줍니다. 점 반지름과 선 두께를 바꾸면 보이지 않는 삼각형이 설득력 있게 보이는 조건을 찾을 수 있습니다.`,
  'illusion.rubin-vase.description': `미리보기에는 어두운 양쪽 영역 사이에 밝은 중앙 꽃병 모양이 있습니다.

같은 경계선을 꽃병의 윤곽으로 볼 수도 있고, 서로 마주 보는 두 옆얼굴로 볼 수도 있습니다.

가이드를 켜면 꽃병, 두 얼굴 윤곽, 중심축을 표시합니다. 꽃병 폭, 얼굴 윤곽의 깊이, 목 부분 너비, 색을 바꾸면 어느 해석이 더 안정적인지 시험할 수 있습니다.`,
  'illusion.simultaneous-contrast.description': `미리보기에는 같은 중심 색이 서로 다른 배경 위에 놓여 있습니다.

같은 중심 색도 어두운 배경에서는 더 밝게, 밝은 배경에서는 더 어둡게 보일 수 있습니다.

가이드를 켜면 두 영역에 같은 색의 대각선 샘플을 그립니다. 중심 반지름, 대비, 색을 바꾸면 색이 실제로 같은지 직접 비교하기 쉽습니다.`,
  'illusion.whites-illusion.description': `미리보기에는 밝고 어두운 줄무늬 위에 같은 회색 목표가 놓여 있습니다.

주변 줄무늬 패턴 때문에 같은 회색 목표가 서로 다른 밝기로 보일 수 있습니다.

가이드를 켜면 목표 영역 위에 같은 회색의 대각선 샘플을 그립니다. 줄무늬 수, 선 두께, 대비, 색을 바꾸면 목표를 비교하기 쉽습니다.`,
  'illusion.cornsweet.description': `미리보기에는 두 개의 넓은 영역이 좁은 음영 경계로 나뉘어 있습니다.

넓은 영역 자체는 같은 밝기일 수 있지만, 경계의 음영 때문에 한쪽이 더 밝게 보일 수 있습니다.

가이드를 켜면 같은 밝기의 샘플 영역을 비교할 수 있습니다. 경계 폭, 대비, 색 선택이 밝기 차이가 느껴지는 정도를 바꿉니다.`,
  'illusion.lilac-chaser.description': `미리보기에는 라일락색 점들이 원형으로 배열되어 있고, 비어 있는 위치 하나가 원을 따라 회전합니다.

그 빈자리가 움직일 때, 실제로 그려지지 않은 녹색 점이나 움직이는 잔상처럼 느껴지는 것이 보일 수 있습니다.

속도, 반지름, 점 개수, 대비를 바꾸면 잔상이 강하게 나타나는 조건을 찾을 수 있습니다. 움직임이 불편하면 애니메이션을 일시정지하세요.`,
  'illusion.rotating-necker-cube.description': `미리보기에는 깊이 해석이 애매한 선화 입방체가 각도와 강조선을 조금씩 바꾸며 움직입니다.

입방체는 두 가지 깊이 해석 사이에서 뒤집혀 보일 수 있어, 앞면과 뒷면이 지각 속에서 자리를 바꾸는 것처럼 느껴집니다.

가이드를 켜면 가능한 두 앞면을 번갈아 보여 줍니다. 깊이, 각도, 선 두께, 대비, 면 색을 바꾸면 반전이 일어나는 방식을 더 쉽게 살펴볼 수 있습니다.`
};

export const detailedIllusionDescriptions: Record<SupportedLanguage, DescriptionDictionary> = {
  en,
  fr,
  es,
  de,
  ja,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  ko
};
