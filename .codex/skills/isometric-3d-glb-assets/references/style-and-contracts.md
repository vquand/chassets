# Isometric GLB Style And Contracts

## Style Contract

- Compact toy-like low-poly forms with chunky proportions.
- Strong isometric silhouette from a top-down angled camera.
- Matte materials, flat shading, broad color blocks.
- Minimal tiny details; use one or two signature props for recognition.
- Cute proportions are acceptable: short limbs, oversized heads, larger props, simplified wings.
- Avoid photorealism, gritty textures, baked shadows, logos, text, and environment bases.

## Unit GLB Contract

- Root object name should be the uppercase entity code.
- Keep one centered asset per GLB with no base plate.
- Grounded assets should sit with visible feet/lowest body near `y = 0`.
- Use stable mesh and group names. Tests and composition code may look up names.
- Keep material names meaningful. Do not rename tint-target materials casually.
- Preserve known animation clip names when replacing an asset.
- When auditing a family, normalize every root to its uppercase entity code; do not rely on a consumer's child-index fallback to mask inconsistent exports.

## Mounted Unit Contract

- Mount assets must include a `RiderMountPoint` empty node at the intended seat.
- Rider assets must include `LegLeftPivot` and `LegRightPivot` so mounted composition can align and hide lower body.
- Check rider facing. Some mount assets face opposite older humanoid assets and need app-side yaw handling.
- Check clipping from the actual Guide camera, not only from the scene graph.
- Horse intentionally renders smaller in mounted composition; do not apply that assumption to all mounts.
- For mirrored animated parts, sample both pivots and verify symmetry and loop continuity at clip boundaries.

## Verification Checklist

- Inspect with `scripts/inspect-glb.mjs`.
- Confirm root name, bounds, material names, animation clips, and required marker nodes.
- Restart the consuming web app when GLB binaries or loader code change.
- Capture standalone Guide screenshots for new base assets.
- Capture mounted Guide screenshots for any mount or rider contract change.
- Run app tests and typecheck when code changes.
- Commit chassets binary updates separately from consuming app code updates.
- Check that each runtime locomotion selector covers the clips emitted by the corresponding assets in both map and Guide paths.
