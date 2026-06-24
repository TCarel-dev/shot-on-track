import * as THREE from "three";

interface SpiralGeometryOptions {
  radius: number;
  tileHeight: number;
  tileAngle: number;
  slope: number;
  segments: number;
}

export function createSpiralGeometry({
  radius,
  tileHeight,
  tileAngle,
  slope,
  segments,
}: SpiralGeometryOptions) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= 1; row++) {
    for (let col = 0; col <= segments; col++) {
      const t = col / segments;

      const angle = (t - 0.5) * tileAngle;

      positions.push(
        Math.sin(angle) * radius,
        (row - 0.5) * tileHeight + (t - 0.5) * slope,
        Math.cos(angle) * radius,
      );

      uvs.push(t, row);
    }
  }

  for (let col = 0; col < segments; col++) {
    const a = col;
    const b = col + segments + 1;

    indices.push(
      a,
      b,
      a + 1,

      b,
      b + 1,
      a + 1,
    );
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );

  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

  geometry.setIndex(indices);

  geometry.computeVertexNormals();

  return geometry;
}
