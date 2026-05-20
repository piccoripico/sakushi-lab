# Sakushi Lab

Sakushi Lab est un terrain de jeu statique et multilingue pour les illusions visuelles. Il fonctionne entièrement dans le navigateur avec Vite, TypeScript vanilla, Canvas, l'export SVG et l'enregistrement WebM.

Site en ligne : [Sakushi Lab](https://piccoripico.github.io/sakushi-lab/)

## Documents Multilingues

- [English](../README.md)
- [日本語](README.ja.md)
- [Español](README.es.md)
- [Deutsch](README.de.md)
- [简体中文](README.zh-Hans.md)
- [繁體中文](README.zh-Hant.md)
- [한국어](README.ko.md)

## À Propos Des Illusions Visuelles

Les illusions visuelles sont des images ou des motifs en mouvement qui montrent à quel point la perception dépend du contexte. Des lignes physiquement parallèles peuvent sembler inclinées, des formes identiques peuvent paraître de tailles différentes, et des motifs immobiles peuvent donner l'impression de scintiller ou de bouger.

Ces effets ne sont pas de simples « erreurs » de vision. Ils montrent comment le système visuel estime la luminosité, le contraste, la profondeur, la direction, la taille et le mouvement à partir des informations environnantes. Sakushi Lab permet de modifier les conditions de chaque illusion et d'observer comment ces changements rendent l'effet plus fort, plus faible ou plus facile à remarquer.

Les images et vidéos générées peuvent servir à l'apprentissage, aux démonstrations, aux expériences de design et à l'exploration personnelle. Certaines illusions animées peuvent être intenses ; faites une pause si une animation devient inconfortable.

## Fonctionnalités

- 24 illusions visuelles :
  - Géométrie / forme :
    - Café Wall : des tuiles décalées font paraître inclinées des lignes parallèles.
    - Hermann / Scintillating Grid : les intersections du quadrillage créent des taches sombres fugitives.
    - Müller-Lyer : des ailettes modifient la longueur perçue de lignes égales.
    - Ponzo : des indices de perspective font paraître différentes des barres égales.
    - Poggendorff : une bande masquante fait sembler décalée une diagonale.
    - Zöllner : de petits traits croisés font paraître inclinées des lignes parallèles.
    - Hering : des lignes rayonnantes courbent visuellement des parallèles vers l'extérieur.
    - Wundt : des lignes convergentes courbent visuellement des parallèles vers l'intérieur.
    - Verticale-horizontale : des lignes verticale et horizontale égales semblent inégales.
    - Jastrow : des bandes courbes identiques semblent différentes quand elles sont décalées.
    - Ebbinghaus : les cercles autour changent la taille perçue des centres égaux.
    - Delboeuf : les anneaux autour changent la taille perçue de cercles égaux.
    - Parallélogramme de Sander : des cadres inclinés déforment la longueur perçue.
    - Triangle de Kanizsa : des formes évidées suggèrent un triangle non dessiné.
    - Fraser Spiral : des arcs inclinés sur des cercles suggèrent une spirale.
  - Couleur / luminosité :
    - Contraste simultané : une même couleur change avec son entourage.
    - Bandes de Mach : les bords de luminosité créent des franges claires et sombres.
    - Illusion de White : des gris égaux semblent différents sur des rayures.
    - Cornsweet : une fine bordure ombrée change la luminosité perçue.
  - Mouvement :
    - Moiré Motion Field : des rayures superposées créent des interférences mobiles.
    - Dérive périphérique : des motifs répétés de contraste semblent dériver.
    - Illusion d'Ouchi : un centre rayé semble glisser sur son arrière-plan.
    - Chasseur lilas : un vide tournant produit une sensation d'image rémanente.
    - Pinna-Brelstaff : des segments inclinés en anneaux semblent tourner.
- Contrôles de paramètres générés depuis le schéma de chaque module d'illusion.
- Contrôles optionnels de graine pour une génération reproductible.
- Génération déterministe avec partage d'URL basé sur une graine.
- Export PNG, SVG, WebM et URL reproductible.
- Langues de l'interface : anglais, français, espagnol, allemand, japonais, chinois simplifié, chinois traditionnel et coréen.

## Développement

```powershell
npm.cmd install
npm.cmd run verify
```

Scripts utiles :

- `npm.cmd run dev` : démarre le serveur de développement Vite.
- `npm.cmd test` : exécute les tests unitaires.
- `npm.cmd run build` : vérifie les types et construit `dist/`.
- `npm.cmd run test:e2e` : exécute les tests Playwright.

## GitHub Pages

Le workflow dans `.github/workflows/pages.yml` construit et téléverse `dist/` comme artefact Pages lors des pushs vers `main` ou d'un déclenchement manuel.
