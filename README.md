# chassets

Reusable character assets for simple games.

## Layout

```text
sprites/
  allies/   friendly bodies, mounts, and creatures
  enemies/  hostile bodies and creatures
  items/    weapons, shields, and other equippable props
  parts/    composable body and equipment parts
```

This repository is intentionally scoped to character-related assets: humans,
weapons, mounts, and animals. Terrain tiles, map props, buildings, and other
game-specific environment art should stay in the consuming game repository.

The current source game links these folders into
`apps/web/public/sprites/{allies,enemies,items,parts}`.
