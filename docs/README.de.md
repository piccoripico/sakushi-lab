# Sakushi Lab

Sakushi Lab ist ein statisches, mehrsprachiges Experimentierfeld für visuelle Illusionen. Es läuft vollständig im Browser mit Vite, Vanilla TypeScript, Canvas, SVG-Export und WebM-Aufzeichnung.

Live-Seite: [Sakushi Lab](https://piccoripico.github.io/sakushi-lab/)

## Mehrsprachige Dokumente

- [English](../README.md)
- [日本語](README.ja.md)
- [Français](README.fr.md)
- [Español](README.es.md)
- [简体中文](README.zh-Hans.md)
- [繁體中文](README.zh-Hant.md)
- [한국어](README.ko.md)

## Über Visuelle Illusionen

Visuelle Illusionen sind Bilder oder Bewegungsmuster, die zeigen, wie stark Wahrnehmung vom Kontext abhängt. Physisch parallele Linien können geneigt erscheinen, gleiche Formen können unterschiedlich groß wirken, und unbewegte Muster können zu flimmern oder sich zu bewegen scheinen.

Diese Effekte sind nicht einfach „Fehler“ des Sehens. Sie zeigen, wie das visuelle System Helligkeit, Kontrast, Tiefe, Richtung, Größe und Bewegung aus umgebenden Informationen schätzt. Mit Sakushi Lab können die Bedingungen jeder Illusion verändert werden, um zu sehen, wie der Effekt stärker, schwächer oder leichter bemerkbar wird.

Die erzeugten Bilder und Videos eignen sich für Lernen, Demonstrationen, Designexperimente und neugieriges Erkunden. Einige bewegte Illusionen können intensiv wirken; machen Sie eine Pause, wenn eine Animation unangenehm wird.

## Funktionen

- 24 visuelle Illusionen:
  - Geometrie / Form:
    - Café Wall: versetzte Kacheln lassen parallele Linien geneigt wirken.
    - Hermann / Scintillating Grid: Rasterkreuzungen erzeugen flüchtige dunkle Flecken.
    - Müller-Lyer: Pfeilflügel verändern die wahrgenommene Länge gleicher Linien.
    - Ponzo: Perspektivhinweise lassen gleiche Balken verschieden wirken.
    - Poggendorff: ein verdeckender Balken lässt eine Diagonale versetzt erscheinen.
    - Zöllner: Querstriche lassen parallele Linien geneigt wirken.
    - Hering: Strahlenlinien biegen parallele Geraden scheinbar nach außen.
    - Wundt: zusammenlaufende Linien biegen parallele Geraden scheinbar nach innen.
    - Vertikal-horizontal: gleiche vertikale und horizontale Linien wirken ungleich.
    - Jastrow: identische gebogene Bänder wirken versetzt verschieden.
    - Ebbinghaus: umgebende Kreise verändern die wahrgenommene Größe gleicher Zentren.
    - Delboeuf: umgebende Ringe verändern die wahrgenommene Größe gleicher Kreise.
    - Sander-Parallelogramm: schräge Rahmen verzerren die wahrgenommene Linienlänge.
    - Kanizsa-Dreieck: ausgesparte Formen deuten ein nicht gezeichnetes Dreieck an.
    - Fraser Spiral: geneigte Bögen auf Kreisen suggerieren eine Spirale.
  - Farbe / Helligkeit:
    - Simultankontrast: dieselbe Farbe verändert sich durch ihre Umgebung.
    - Mach-Bänder: Helligkeitskanten erzeugen helle und dunkle Säume.
    - White-Illusion: gleiche Grautöne wirken auf Streifen verschieden.
    - Cornsweet: eine schmale Schattenkante verändert die wahrgenommene Helligkeit.
  - Bewegung:
    - Moiré Motion Field: überlagerte Streifen erzeugen bewegte Interferenzen.
    - Periphere Drift: wiederholte Kontrastmuster scheinen zu driften.
    - Ouchi-Illusion: ein gestreiftes Zentrum scheint über den Hintergrund zu gleiten.
    - Lila Verfolger: eine rotierende Lücke erzeugt eine Nachbild-Empfindung.
    - Pinna-Brelstaff: geneigte Ringsegmente scheinen zu rotieren.
- Parametersteuerungen, die aus dem Schema jedes Illusionsmoduls erzeugt werden.
- Optionale Seed-Steuerung für reproduzierbare Generierung.
- Deterministische Generierung mit Seed-basierter URL-Freigabe.
- Export als PNG, SVG, WebM und reproduzierbare URL.
- UI-Sprachen: Englisch, Französisch, Spanisch, Deutsch, Japanisch, vereinfachtes Chinesisch, traditionelles Chinesisch und Koreanisch.

## Entwicklung

```powershell
npm.cmd install
npm.cmd run verify
```

Nützliche Skripte:

- `npm.cmd run dev`: startet den Vite-Entwicklungsserver.
- `npm.cmd test`: führt Unit-Tests aus.
- `npm.cmd run build`: prüft Typen und baut `dist/`.
- `npm.cmd run test:e2e`: führt Playwright-Tests aus.

## GitHub Pages

Der Workflow in `.github/workflows/pages.yml` baut `dist/` und lädt es bei Pushes nach `main` oder manueller Ausführung als Pages-Artefakt hoch.
