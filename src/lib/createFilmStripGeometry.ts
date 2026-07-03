import * as THREE from "three";

interface FilmStripOptions {
  radius: number;
  tileAngle: number;
  tileHeight: number;
  slope: number;
  segments: number;
}

export function createFilmStripGeometry({
  radius,
  tileAngle,
  tileHeight,
  slope,
  segments,
}: FilmStripOptions) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const rows = 80;
  const cols = segments;

  const vertexIndex: number[][] = Array.from({ length: rows + 1 }, () =>
    new Array(cols + 1).fill(-1),
  );

  // -----------------------------
  // vertices
  // -----------------------------
  for (let y = 0; y <= rows; y++) {
    const v = y / rows;

    for (let x = 0; x <= cols; x++) {
      const u = x / cols;

      const angle = (u - 0.5) * tileAngle;
      const yPos = (v - 0.5) * tileHeight + (u - 0.5) * slope;

      vertexIndex[y][x] = positions.length / 3;
      positions.push(Math.sin(angle) * radius, yPos, Math.cos(angle) * radius);
      uvs.push(u, v);
    }
  }

  // -----------------------------
  // indices (skip holes)
  // -----------------------------
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const a = vertexIndex[y][x];
      const b = vertexIndex[y + 1][x];
      const c = vertexIndex[y][x + 1];
      const d = vertexIndex[y + 1][x + 1];

      if (a < 0 || b < 0 || c < 0 || d < 0) continue;

      indices.push(a, b, c, b, d, c);
    }
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
