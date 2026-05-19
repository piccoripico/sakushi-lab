# Sakushi Lab

Sakushi Lab は、静的な多言語対応の視覚錯視プレイグラウンドです。Vite、vanilla TypeScript、Canvas、SVG出力、WebM録画を使い、すべてブラウザ内で動作します。

公開サイト: [Sakushi Lab](https://piccoripico.github.io/sakushi-lab/)

## 多言語ドキュメント

- [English](../README.md)
- [Français](README.fr.md)
- [Español](README.es.md)
- [Deutsch](README.de.md)
- [简体中文](README.zh-Hans.md)
- [繁體中文](README.zh-Hant.md)
- [한국어](README.ko.md)

## 視覚錯視について

視覚錯視とは、ものの見え方が周囲の条件や文脈に強く影響されることを示す画像や動きのパターンです。物理的には平行な線が傾いて見えたり、同じ大きさの図形が違う大きさに見えたり、静止した模様が揺れたり動いたりするように感じられることがあります。

こうした現象は、単なる「目の誤り」ではありません。私たちの視覚が、明るさ、コントラスト、奥行き、方向、大きさ、動きを、周囲の情報から推定していることを示しています。Sakushi Lab では、各錯視の条件を変えながら、効果が強くなる、弱くなる、気づきやすくなる様子を試せます。

作成した画像や動画は、学習、デモ、デザイン実験、気軽な探索に利用できます。動く錯視は刺激が強く感じられることがあるため、不快に感じた場合は休憩してください。

## 機能

- 6種類の視覚錯視:
  - カフェウォール錯視
  - ヘルマン格子 / きらめき格子
  - ミュラー・リヤー錯視
  - エビングハウス錯視
  - フレーザーの渦巻き錯視
  - モアレ運動場
- 各錯視モジュールのスキーマから生成されるパラメータ操作
- 再現性のある生成のための任意のシード操作
- シード付きURL共有による決定的な生成
- PNG、SVG、WebM、再現用URLの出力
- UI言語: 英語、フランス語、スペイン語、ドイツ語、日本語、簡体字中国語、繁体字中国語、韓国語

## 開発

```powershell
npm.cmd install
npm.cmd run verify
```

便利なスクリプト:

- `npm.cmd run dev`: Vite 開発サーバーを起動します。
- `npm.cmd test`: ユニットテストを実行します。
- `npm.cmd run build`: 型チェックと `dist/` のビルドを実行します。
- `npm.cmd run test:e2e`: Playwright テストを実行します。

## GitHub Pages

`.github/workflows/pages.yml` のワークフローは、`main` へのpushまたは手動実行時に `dist/` をビルドし、Pages artifact としてアップロードします。
