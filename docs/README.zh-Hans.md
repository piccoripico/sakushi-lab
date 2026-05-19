# Sakushi Lab

Sakushi Lab 是一个静态、多语言的视觉错视实验场。它完全在浏览器中运行，使用 Vite、vanilla TypeScript、Canvas、SVG 导出和 WebM 录制。

在线站点：[Sakushi Lab](https://piccoripico.github.io/sakushi-lab/)

## 多语言文档

- [English](../README.md)
- [日本語](README.ja.md)
- [Français](README.fr.md)
- [Español](README.es.md)
- [Deutsch](README.de.md)
- [繁體中文](README.zh-Hant.md)
- [한국어](README.ko.md)

## 关于视觉错视

视觉错视是图像或运动图案，它们展示了感知在多大程度上依赖上下文。物理上平行的线条可能看起来倾斜，相同大小的形状可能显得不同，静止的图案也可能让人感觉在闪烁或移动。

这些效果并不只是视觉的“错误”。它们说明视觉系统会根据周围信息来估计亮度、对比度、深度、方向、大小和运动。Sakushi Lab 可以让你改变每种错视的条件，观察这些变化如何让效果变强、变弱或更容易被注意到。

生成的图像和视频适合用于学习、演示、设计实验和日常探索。一些动态错视可能会带来较强刺激；如果动画让你感到不适，请休息一下。

## 功能

- 六种视觉错视：
  - 咖啡墙错视
  - 赫尔曼 / 闪烁网格
  - 缪勒-莱尔错视
  - 艾宾浩斯错视
  - 弗雷泽螺旋错视
  - 摩尔纹运动场
- 根据每个错视模块的 schema 生成参数控制。
- 用于可复现生成的可选种子控制。
- 基于种子的确定性生成和 URL 分享。
- 导出 PNG、SVG、WebM 和可复现 URL。
- UI 语言：英语、法语、西班牙语、德语、日语、简体中文、繁体中文和韩语。

## 开发

```powershell
npm.cmd install
npm.cmd run verify
```

常用脚本：

- `npm.cmd run dev`：启动 Vite 开发服务器。
- `npm.cmd test`：运行单元测试。
- `npm.cmd run build`：执行类型检查并构建 `dist/`。
- `npm.cmd run test:e2e`：运行 Playwright 测试。

## GitHub Pages

`.github/workflows/pages.yml` 中的 workflow 会在 push 到 `main` 或手动触发时构建 `dist/`，并将其作为 Pages artifact 上传。
