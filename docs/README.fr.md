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

- Six illusions visuelles :
  - Café Wall
  - Hermann / Scintillating Grid
  - Müller-Lyer
  - Ebbinghaus
  - Fraser Spiral
  - Moiré Motion Field
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
