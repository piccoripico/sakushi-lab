# Sakushi Lab

Sakushi Lab은 정적 다국어 시각 착시 실험 공간입니다. Vite, vanilla TypeScript, Canvas, SVG 내보내기, WebM 녹화를 사용하며 모든 기능이 브라우저 안에서 실행됩니다.

공개 사이트: [Sakushi Lab](https://piccoripico.github.io/sakushi-lab/)

## 다국어 문서

- [English](../README.md)
- [日本語](README.ja.md)
- [Français](README.fr.md)
- [Español](README.es.md)
- [Deutsch](README.de.md)
- [简体中文](README.zh-Hans.md)
- [繁體中文](README.zh-Hant.md)

## 시각 착시에 대하여

시각 착시는 지각이 주변 맥락에 얼마나 크게 의존하는지 보여 주는 이미지나 움직임 패턴입니다. 물리적으로 평행한 선이 기울어 보이거나, 같은 크기의 도형이 서로 다르게 보이거나, 정지한 패턴이 반짝이거나 움직이는 것처럼 느껴질 수 있습니다.

이러한 효과는 단순한 시각의 “오류”가 아닙니다. 시각 시스템이 주변 정보를 바탕으로 밝기, 대비, 깊이, 방향, 크기, 움직임을 추정한다는 점을 보여 줍니다. Sakushi Lab에서는 각 착시의 조건을 바꾸면서 효과가 더 강해지거나 약해지거나 더 쉽게 눈에 띄는 모습을 확인할 수 있습니다.

생성한 이미지와 비디오는 학습, 시연, 디자인 실험, 가벼운 탐색에 사용할 수 있습니다. 일부 움직이는 착시는 자극이 강하게 느껴질 수 있으므로, 애니메이션이 불편하게 느껴지면 잠시 쉬어 주세요.

## 기능

- 여섯 가지 시각 착시:
  - 카페 월 착시
  - 헤르만 / 반짝임 격자
  - 뮐러-라이어 착시
  - 에빙하우스 착시
  - 프레이저 나선 착시
  - 무아레 움직임 장
- 각 착시 모듈의 schema에서 생성되는 매개변수 조절 기능.
- 재현 가능한 생성을 위한 선택적 시드 조절.
- 시드 기반 URL 공유를 통한 결정론적 생성.
- PNG, SVG, WebM 및 재현 URL 내보내기.
- UI 언어: 영어, 프랑스어, 스페인어, 독일어, 일본어, 중국어 간체, 중국어 번체, 한국어.

## 개발

```powershell
npm.cmd install
npm.cmd run verify
```

유용한 스크립트:

- `npm.cmd run dev`: Vite 개발 서버를 시작합니다.
- `npm.cmd test`: 단위 테스트를 실행합니다.
- `npm.cmd run build`: 타입 검사를 실행하고 `dist/`를 빌드합니다.
- `npm.cmd run test:e2e`: Playwright 테스트를 실행합니다.

## GitHub Pages

`.github/workflows/pages.yml`의 workflow는 `main`에 push하거나 수동으로 실행할 때 `dist/`를 빌드하고 Pages artifact로 업로드합니다.
