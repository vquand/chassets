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
   - When exporting binary GLBs from Node, account for the runtime's missing browser `FileReader`: provide a minimal `Blob.arrayBuffer()`-backed shim or export in a browser. Run the exporter again after fixing any grounding or bounds failure; do not keep a partially written asset.

3. Preserve runtime contracts.
   - Root object name must match the entity code, such as `DRAGON`, `PEGASUS`, or `HORSE`.
   - Mount assets used with riders must include an empty `RiderMountPoint` node.
   - Rider assets must keep hip nodes used by the app: `LegLeftPivot` and `LegRightPivot`.
   - If the app tints materials by name, keep the expected material prefix. Dragon element-tinted materials use `DragonElement...`.
   - Declare the movement mode deliberately. A winged unit can be grounded and jump; do not infer `fly` from the presence of wings.
   - Keep animation clip names stable and semantic. Common names are `idle`, `walk`, `jump`, and `fly`; custom locomotion clips must be selected explicitly by every consumer.
   - When adding a custom locomotion clip, update both map rendering and standalone Guide preview selection, and add a focused test for the preferred clip so a fallback to `idle` or `fly` cannot silently regress it.

4. Design for the isometric camera.
   - Favor chunky silhouettes and oversized signature props over surface detail.
   - Make important features visible from an angled top-down view.
   - Keep forms cute, compact, low-poly, and slightly toy-like.
   - Avoid thin decorative lines unless they remain readable at Guide preview size.
   - For winged units, use separate named left/right pivots and a readable membrane material; use double-sided wing materials when the camera can see the back face.

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
- Record the intended locomotion contract beside the generator or integration change: grounded, walking, jumping, flying, or mounted. A grounded winged unit should have no `fly` clip unless the game explicitly uses it.

## Verification

Use layered verification:

- **Structural**: inspect GLB root, bounds, nodes, materials, animation clips, and marker nodes.
- **Animation**: load each required clip with an `AnimationMixer` or equivalent, sample its motion, and verify grounded clips do not sink below `y = 0` or imply unintended flight.
- **Runtime**: verify the consuming app can load the asset and reports `data-unit-model-status="loaded"`; verify the intended clip is selected in both the map renderer and Guide preview.
- **Visual**: capture and inspect Guide screenshots at the actual preview scale. Confirm the silhouette, signature features, wing separation, color blocks, ground contact, facing, and clipping read without relying on a close-up render.
- **Git**: stage files by name and keep generated binary commits separate from app-code commits when both repos are involved.

## Grounded Winged Unit Pattern

For a small winged enemy that cannot fly, treat these as explicit acceptance criteria:

- Root code matches the entity, with feet/lowest geometry at `y ≈ 0`.
- Left and right wing membranes have stable, discoverable pivot names.
- The asset has `idle` plus a grounded locomotion clip such as `jump`, not a generic `fly` clip.
- The consuming runtime chooses `jump` for movement and does not silently fall back to `fly`.
- The Guide preview loads the same binary and displays the same locomotion contract.

This pattern is intentionally generic: wings communicate silhouette and faction identity, while the animation contract communicates whether the unit is airborne.

## Cross-Repository Handoff

When `chassets` is consumed by a neighboring game repository:

1. Create matching feature branches in both repositories when both the binary and loader/registry change.
2. Commit the generated GLB separately from consuming app code.
3. Verify the app's actual asset mount path and registry, not only the file's presence in `chassets`.
4. Land or hand off the two repositories independently; do not hide a required registry change inside a binary-only commit.

## Resources

Read [references/style-and-contracts.md](references/style-and-contracts.md) when you need the detailed style contract, mount contracts, and browser verification checklist.

Run `scripts/inspect-glb.mjs models/units/dragon.glb` from the skill directory, or pass absolute GLB paths from any working directory.
