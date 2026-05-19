# Sakushi Lab

Sakushi Lab 是一個靜態、多語言的視覺錯視實驗場。它完全在瀏覽器中執行，使用 Vite、vanilla TypeScript、Canvas、SVG 匯出與 WebM 錄製。

線上網站：[Sakushi Lab](https://piccoripico.github.io/sakushi-lab/)

## 多語言文件

- [English](../README.md)
- [日本語](README.ja.md)
- [Français](README.fr.md)
- [Español](README.es.md)
- [Deutsch](README.de.md)
- [简体中文](README.zh-Hans.md)
- [한국어](README.ko.md)

## 關於視覺錯視

視覺錯視是圖像或運動圖案，它們展示感知在多大程度上依賴脈絡。物理上平行的線條可能看起來傾斜，相同大小的形狀可能顯得不同，靜止的圖案也可能讓人感覺在閃爍或移動。

這些效果並不只是視覺的「錯誤」。它們說明視覺系統會根據周圍資訊來估計亮度、對比、深度、方向、大小與運動。Sakushi Lab 可以讓你改變每種錯視的條件，觀察這些變化如何讓效果變強、變弱或更容易被注意到。

產生的圖像與影片適合用於學習、示範、設計實驗與日常探索。一些動態錯視可能會帶來較強刺激；如果動畫讓你感到不適，請休息一下。

## 功能

- 六種視覺錯視：
  - 咖啡牆錯視
  - 赫爾曼 / 閃爍格線
  - 繆勒-萊爾錯視
  - 艾賓浩斯錯視
  - 弗雷澤螺旋錯視
  - 摩爾紋運動場
- 根據每個錯視模組的 schema 產生參數控制。
- 用於可重現生成的可選種子控制。
- 基於種子的確定性生成與 URL 分享。
- 匯出 PNG、SVG、WebM 與可重現 URL。
- UI 語言：英語、法語、西班牙語、德語、日語、簡體中文、繁體中文與韓語。

## 開發

```powershell
npm.cmd install
npm.cmd run verify
```

常用指令：

- `npm.cmd run dev`：啟動 Vite 開發伺服器。
- `npm.cmd test`：執行單元測試。
- `npm.cmd run build`：執行型別檢查並建置 `dist/`。
- `npm.cmd run test:e2e`：執行 Playwright 測試。

## GitHub Pages

`.github/workflows/pages.yml` 中的 workflow 會在 push 到 `main` 或手動觸發時建置 `dist/`，並將其作為 Pages artifact 上傳。
