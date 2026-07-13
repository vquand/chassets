# chassets

Reusable character assets for simple games.

## Layout

```text
sprites/
  allies/   friendly bodies, mounts, and creatures
  enemies/  hostile bodies and creatures
  items/    weapons, shields, and other equippable props
  parts/    composable body and equipment parts
models/
  units/    runtime-ready 3D character models in binary glTF format
```

This repository is intentionally scoped to character-related assets: humans,
weapons, mounts, and animals. Terrain tiles, map props, buildings, and other
game-specific environment art should stay in the consuming game repository.

The current source game links these folders into
`apps/web/public/sprites/{allies,enemies,items,parts}`.

3D models use `.glb`, `+Y` up, and a feet-center origin. Unit files may
include lowercase `idle` and `walk` animation clips when available.
