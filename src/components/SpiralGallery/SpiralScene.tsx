"use client";

import { useEffect, useMemo, useRef } from "react";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { useLenis } from "@/hooks/useLenis";
import { useGallery } from "@/hooks/useGallery";
import { createFilmStripGeometry } from "@/lib/createFilmStripGeometry";

import { GALLERY_CONFIG } from "@/constants/gallery";

import SpiralTile from "./SpiralTile";

export default function SpiralScene() {
  useLenis();

  const { velocity } = useGallery();

  const spiralRef = useRef<THREE.Group>(null);

  const scrollForce = useRef(0);

  useEffect(() => {
    if (!spiralRef.current) return;

    spiralRef.current.position.y = GALLERY_CONFIG.cameraPos.y;
  }, []);

  const tiles = useMemo(() => {
    const totalTiles =
      GALLERY_CONFIG.tilesPerRevolution * GALLERY_CONFIG.revolutions;

    const angleStep = (Math.PI * 2) / GALLERY_CONFIG.tilesPerRevolution;

    const tileEdgesY = [0];

    for (let i = 0; i < totalTiles; i++) {
      const progress = i / totalTiles;

      const radius =
        GALLERY_CONFIG.startRadius +
        (GALLERY_CONFIG.endRadius - GALLERY_CONFIG.startRadius) * progress;

      const arcWidth =
        (2 * Math.PI * radius) / GALLERY_CONFIG.tilesPerRevolution;

      const tileHeight = arcWidth * GALLERY_CONFIG.tileHeightRatio;

      tileEdgesY.push(
        tileEdgesY[i] -
          (tileHeight + GALLERY_CONFIG.spiralGap) /
            GALLERY_CONFIG.tilesPerRevolution,
      );
    }

    return Array.from(
      {
        length: totalTiles,
      },
      (_, i) => {
        const progress = i / totalTiles;

        const radius =
          GALLERY_CONFIG.startRadius +
          (GALLERY_CONFIG.endRadius - GALLERY_CONFIG.startRadius) * progress;

        const arcWidth =
          (2 * Math.PI * radius) / GALLERY_CONFIG.tilesPerRevolution;

        const tileHeight = arcWidth * GALLERY_CONFIG.tileHeightRatio;
        const tileAngle = arcWidth / radius + GALLERY_CONFIG.tileOverlap;
        const positionY = (tileEdgesY[i] + tileEdgesY[i + 1]) / 2;
        const slope = tileEdgesY[i + 1] - tileEdgesY[i];

        const imageSrc = `/images/${(i % GALLERY_CONFIG.totalImages) + 1}.jpg`;
        const hasText = i % GALLERY_CONFIG.hasTextDecade === 0;

        return {
          geometry: createFilmStripGeometry({
            radius,
            tileHeight,
            tileAngle,
            slope,
            segments: GALLERY_CONFIG.tileSegments,
          }),
          index: i,
          positionY,
          rotationY: i * angleStep,
          imageSrc,
          hasText,
        };
      },
    );
  }, []);

  useFrame((state) => {
    if (!spiralRef.current) return;

    scrollForce.current = THREE.MathUtils.lerp(
      scrollForce.current,
      velocity.current * 0.0015,
      0.08,
    );

    spiralRef.current.rotation.y +=
      GALLERY_CONFIG.baseRotationSpeed + scrollForce.current;

    scrollForce.current *= 0.95;

    // smooth camera
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 3,
      0.03,
    );

    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 3,
      0.03,
    );

    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={spiralRef}>
      {tiles.map((tile, index) => (
        <group key={index} rotation-y={tile.rotationY}>
          <SpiralTile {...tile} />
        </group>
      ))}
    </group>
  );
}
