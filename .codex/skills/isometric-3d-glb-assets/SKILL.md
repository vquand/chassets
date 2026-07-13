---
name: isometric-3d-glb-assets
description: Generate, modify, validate, and integrate isometric low-poly 3D `.glb` assets in the chassets repository. Use when Codex needs to create or revise chassets GLB files for isometric/top-down game units, mounts, buildings, props, terrain pieces, or mounted unit combinations, especially when exporting from Three.js procedural geometry and checking the result in Under Siege.
---

# Isometric 3D GLB Assets

## Overview

Use this skill to create compact, readable `.glb` assets for the `chassets` repository and verify them inside the consuming Under Siege browser guide. Prefer small procedural Three.js generators for repeatable low-poly assets, then commit the generated binary GLBs in `chassets`.

## Workflow

1. Inspect the target asset path and neighboring assets first.
   - Use `models/units/*.glb` as the active unit asset pattern.
   - Inspect scene graph, material names, bounds, animation clips, and required marker nodes before editing.
   - If the asset is consumed by Under Siege, verify the matching registry in `apps/web/src/threeUnitModels.ts`.

2. Generate with a temporary or repo-local Three.js script.
   - Import `three/build/three.module.js` and `GLTFExporter.js` from the consuming project when `chassets` has no local `node_modules`.
   - Use matte `MeshStandardMaterial` with `flatShading: true`.
   - Build from simple boxes, ellipsoids, cylinders, cones, and named `THREE.Group` pivots.
   - Export binary GLB with `GLTFExporter.parseAsync(..., { binary: true, animations, trs: false })`.

3. Preserve runtime contracts.
   - Root object name must match the entity code, such as `DRAGON`, `PEGASUS`, or `HORSE`.
   - Mount assets used with riders must include an empty `RiderMountPoint` node.
   - Rider assets must keep hip nodes used by the app: `LegLeftPivot` and `LegRightPivot`.
   - If the app tints materials by name, keep the expected material prefix. Dragon element-tinted materials use `DragonElement...`.
   - Keep animation clip names stable; common names are `idle`, `walk`, and `fly`.

4. Design for the isometric camera.
   - Favor chunky silhouettes and oversized signature props over surface detail.
   - Make important features visible from an angled top-down view.
   - Keep forms cute, compact, low-poly, and slightly toy-like.
   - Avoid thin decorative lines unless they remain readable at Guide preview size.

5. Validate before committing.
   - Run `scripts/inspect-glb.mjs <glb...>` from this skill to inspect root, bounds, clips, materials, and node names.
   - Run the consuming app tests/typecheck when app code changes.
   - Restart the local web server and capture Guide screenshots for visual changes.
   - Inspect screenshots manually for silhouette, scale, clipping, rider placement, and facing.

## Generation Conventions

Use these conventions unless the existing asset set clearly says otherwise:

- `+Y` up, ground-contact bottom near `y = 0`.
- Root pivot at the center of the gameplay footprint.
- Mesh names should be descriptive and stable enough for tests and inspection.
- Keep bounds roughly comparable to sibling assets unless the user asks for a scale change.
- Prefer one GLB per asset: `models/units/<lowercase-code>.glb`.
- Use a temporary generator under `/tmp` for one-off work, or add a repo-local generator only when it will be reused.

## Verification

Use layered verification:

- **Structural**: inspect GLB root, bounds, nodes, materials, animation clips, and marker nodes.
- **Runtime**: verify the consuming app can load the asset and reports `data-unit-model-status="loaded"`.
- **Visual**: capture and inspect Guide screenshots for standalone and mounted variants.
- **Git**: stage files by name and keep generated binary commits separate from app-code commits when both repos are involved.

## Resources

Read [references/style-and-contracts.md](references/style-and-contracts.md) when you need the detailed style contract, mount contracts, and browser verification checklist.

Run `scripts/inspect-glb.mjs models/units/dragon.glb` from the skill directory, or pass absolute GLB paths from any working directory.
