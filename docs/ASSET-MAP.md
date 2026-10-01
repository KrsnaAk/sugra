# SUGRA asset inventory

## Initial checkout inspection

Inspected the full repository tree, all visible and hidden directories (excluding Git internals), and the tracked-file list before implementation.

| Asset class requested | Found in checkout | Notes |
|---|---:|---|
| SUGRA logo / orb artwork | No | No image or vector files were present. |
| Eyes / eye characters | No | No image or model files were present. |
| Sugar cubes / cube characters | No | No image or model files were present. |
| Backgrounds / banners | No | No image files were present. |
| Environments / 3D artwork | No | No model, scene, texture, or environment files were present. |
| Animation / video | No | No animation or video files were present. |

The repository initially contained only `README.md`. No supplied source artwork has been replaced or hidden. The current experience uses original procedural Three.js geometry and clearly identified procedural gallery studies until real SUGRA assets are added.

## Add supplied artwork

Place original source files in `src/assets/sugra/`. Supported gallery formats: PNG, JPG/JPEG, WebP, SVG, GIF, MP4 and WebM. `GalleryApp` discovers these files at build time, groups filenames into archive/character/world/art categories, and opens them in an in-app viewer. Use filenames containing `character`, `world`, `art`, `banner`, or `background` for more useful automatic grouping.
