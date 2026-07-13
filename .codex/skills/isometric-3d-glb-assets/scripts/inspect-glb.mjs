#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

function usage() {
  console.error("Usage: inspect-glb.mjs <asset.glb> [asset.glb...]");
  process.exit(2);
}

const files = process.argv.slice(2);
if (files.length === 0) usage();

function findThreeRoot() {
  const candidates = [
    process.env.THREE_MODULE_ROOT,
    path.resolve(process.cwd(), "node_modules/three"),
    "/home/willdo/Documents/code/underSiege/node_modules/three",
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, "build/three.module.js"))) return candidate;
  }
  throw new Error("Unable to find Three.js. Set THREE_MODULE_ROOT=/path/to/node_modules/three.");
}

const threeRoot = findThreeRoot();
const THREE = await import(pathToFileURL(path.join(threeRoot, "build/three.module.js")).href);
const { GLTFLoader } = await import(pathToFileURL(path.join(threeRoot, "examples/jsm/loaders/GLTFLoader.js")).href);
const loader = new GLTFLoader();

function round(value) {
  return Number(value.toFixed(3));
}

for (const input of files) {
  const file = path.resolve(input);
  if (!existsSync(file)) {
    console.error(`Missing GLB: ${file}`);
    process.exitCode = 1;
    continue;
  }

  const buffer = readFileSync(file);
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  const gltf = await new Promise((resolve, reject) => {
    loader.parse(arrayBuffer, "", resolve, reject);
  });
  const source = gltf.scene.children[0] ?? gltf.scene;
  source.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(source);
  const size = bounds.getSize(new THREE.Vector3());
  const materials = new Map();
  const nodes = [];

  source.traverse((node) => {
    nodes.push({
      name: node.name || "(unnamed)",
      type: node.type,
      children: node.children.length,
      visible: node.visible,
    });
    if (!(node instanceof THREE.Mesh)) return;
    const nodeMaterials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of nodeMaterials) {
      const color = material.color instanceof THREE.Color ? material.color.getHexString() : null;
      materials.set(material.name || "(unnamed)", {
        color,
        roughness: material.roughness,
        metalness: material.metalness,
      });
    }
  });

  console.log(JSON.stringify({
    file,
    root: source.name || "(unnamed)",
    bounds: {
      min: bounds.min.toArray().map(round),
      max: bounds.max.toArray().map(round),
      size: size.toArray().map(round),
    },
    animations: gltf.animations.map((clip) => ({
      name: clip.name,
      duration: round(clip.duration),
      tracks: clip.tracks.length,
    })),
    materials: [...materials.entries()],
    nodes,
  }, null, 2));
}
