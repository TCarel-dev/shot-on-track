import * as THREE from "three";

interface FilmStripOptions {
  radius: number;
  tileAngle: number;
  tileHeight: number;
  slope: number;
  segments: number;
  perforationCount?: number;
}

export function createFilmStripGeometry({
  radius,
  tileAngle,
  tileHeight,
  slope,
  segments,
  perforationCount = 8,
}: FilmStripOptions) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // -----------------------------
  // film layout proportions
  // -----------------------------
  const topBand = 0.12;
  const bottomBand = 0.12;

  const perforationRadius = 0.03;

  const rows = 40;
  const cols = segments;

  // helper: check perforation hole
  // const isHole = (u: number, v: number) => {
  //   const step = 1 / perforationCount;

  //   for (let i = 0; i < perforationCount; i++) {
  //     const center = i * step + step * 0.5;

  //     // left and right film edges only
  //     const leftHole = u < 0.06;
  //     const rightHole = u > 0.94;

  //     const inY = Math.abs(v - center) < step * 0.18;

  //     if ((leftHole || rightHole) && inY) {
  //       return true;
  //     }
  //   }

  //   return false;
  // };

  const isHole = (u: number, v: number) => {
    const perforationCount = 10;
    const step = 1 / perforationCount;

    const inEdge = v < 0.07 || v > 0.93;

    if (!inEdge) return false;

    const localU = u % step;

    const holeSize = step * 0.4;

    return localU < holeSize;
  };

  const isValidVertex = (i: number) => {
    return !Number.isNaN(positions[i * 3]);
  };

  // -----------------------------
  // vertices
  // -----------------------------
  for (let y = 0; y <= rows; y++) {
    const v = y / rows;

    for (let x = 0; x <= cols; x++) {
      const u = x / cols;

      // skip perforation vertices (creates real holes)
      if (isHole(u, v)) {
        positions.push(NaN, NaN, NaN);
        uvs.push(u, v);
        continue;
      }

      const angle = (u - 0.5) * tileAngle;

      const yPos = (v - 0.5) * tileHeight + (u - 0.5) * slope;

      positions.push(Math.sin(angle) * radius, yPos, Math.cos(angle) * radius);

      uvs.push(u, v);
    }
  }

  const stride = cols + 1;

  // -----------------------------
  // indices (skip holes)
  // -----------------------------
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const a = y * stride + x;
      const b = a + stride;

      const isValid =
        isValidVertex(a) &&
        isValidVertex(b) &&
        isValidVertex(a + 1) &&
        isValidVertex(b + 1);

      if (!isValid) continue;

      indices.push(
        a,
        b,
        a + 1,

        b,
        b + 1,
        a + 1,
      );
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
