<div align="center">

# ✦ Sparkle Grid Background

### An interactive constellation of dots, circles & four-point sparkles for Framer

**Made with 💛 by Karim Saif**

[![Framer](https://img.shields.io/badge/Framer-Code%20Component-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-TSX-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-Component-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)

### [✨ EXPLORE LIVE PREVIEW](https://sparklegridbg.framer.website/)

</div>

---

## ✨ A grid that comes alive

**Sparkle Grid Background** turns a simple geometric grid into an atmospheric interactive canvas. Organic clusters drift across the screen, where tiny dots expand into circles and bloom into four-point sparkles. Move your cursor over the grid and watch nearby shapes light up.

Purpose-built for **Framer**, with native controls, color presets, a static export-friendly preview, reduced-motion support and responsive rendering.

## 🎬 Live demo

**[sparklegridbg.framer.website →](https://sparklegridbg.framer.website/)**

Try moving your cursor over the animation, then experiment with different grid sizes and colors in Framer.

## ⚡ Highlights

| Feature | Details |
| --- | --- |
| ✦ Living glyphs | Dots grow into circles and four-point sparkles |
| 🖱️ Pointer bloom | Localized light-like response follows your cursor |
| 🌊 Organic motion | Layered value noise produces drifting clusters |
| 🎨 Five presets | Original, Midnight, Aurora, Rose and Gold |
| 🛠️ No-code customization | Native Framer property controls with descriptions |
| 📐 Responsive | Automatically adapts to the component dimensions |
| 🚀 Conscious rendering | 30 FPS drawing, DPR cap and 4 MP pixel budget |
| 💤 Smart pause | Offscreen, hidden-tab and manual pause handling |
| ♿ Motion accessibility | Static SVG illustration when reduced motion is requested |
| 🖼️ Static renderer | SVG fallback for Framer exports and thumbnails |
| 📦 Zero extra libraries | React, browser Canvas 2D and Framer APIs |

## 🎨 Color presets

| Preset | Sparkle | Background |
| --- | --- | --- |
| Original | `#F4F4F5` | `#0E0F11` |
| Midnight | `#8AB4FF` | `#080D1B` |
| Aurora | `#82FFD7` | `#061713` |
| Rose | `#FF91C8` | `#190B17` |
| Gold | `#FFD78A` | `#171108` |

Enable **Custom Colors** to create your own palette.

## 🎛️ Property controls

| Control | Description |
| --- | --- |
| Preset | Select one of five curated themes |
| Custom Colors | Override the selected preset |
| Sparkle Color | Change the dots, sparkles and grid lines |
| Background | Set the background color |
| Cell Size | Adjust glyph scale and grid spacing |
| Speed | Control how quickly clusters drift |
| Density | Set the number of active clusters (lower = denser) |
| Sparkle Point | Choose when circles become sparkles |
| Grid Opacity | Fade or hide the geometric grid |
| Pointer Glow | Control the strength of the cursor bloom |
| Paused | Stop the animation and cursor response |

## 🚀 Add to Framer

1. Open your Framer project.
2. Go to **Assets → Code → New Code File**.
3. Name the file `KarimSaifSparkleGrid.tsx`.
4. Copy the complete code from [KarimSaifSparkleGrid.tsx](./KarimSaifSparkleGrid.tsx).
5. Paste it into Framer and save.
6. Insert **KarimSaifSparkleGrid** onto your canvas, set it to fill your section, and customize it through the property panel.

> Framer is the intended runtime. This repository provides the TSX source; it is not a standalone website or packaged NPM module.

## 💡 Perfect for

- Creative portfolios and designer showcases
- AI products, SaaS and technology landing pages
- Interactive hero sections
- Studio and agency websites
- Editorial experiences and experimental interfaces
- Futuristic dashboards and product presentations

## 🧠 Under the hood

The effect uses layered deterministic noise to activate a grid of cells over time. Each cell eases toward an intensity value and smoothly changes shape as it crosses the sparkle threshold. Pointer proximity adds a localized intensity field.

The component includes `IntersectionObserver`, `ResizeObserver`, browser visibility checks, animation-frame cleanup, static-render detection and reduced-motion handling.

## 🤝 Support & feedback

Found an issue? Have an idea or want to share what you build?

**[X / Twitter — @karimsaif0](https://x.com/karimsaif0)** · **[Email — karimsaif010@gmail.com](mailto:karimsaif010@gmail.com)**

---

<div align="center">

**Design is in the details. Interaction brings it to life.**

Made with 💛 by **Karim Saif**

[Live Preview](https://sparklegridbg.framer.website/) · [X](https://x.com/karimsaif0)

</div>
