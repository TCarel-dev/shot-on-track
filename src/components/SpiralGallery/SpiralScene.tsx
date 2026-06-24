"use client";

import { useMemo, useRef, useEffect } from "react";

import * as THREE from "three";

import { useFrame } from "@react-three/fiber";

import gsap from "gsap";

import SpiralTile from "./SpiralTile";

import { GALLERY_CONFIG } from "@/constants/gallery";

import { createSpiralGeometry } from "@/lib/createSpiralGeometry";

import { useGallery } from "@/providers/GalleryProvider";

import { useLenis } from "@/hooks/useLenis";

export default function SpiralScene() {
  useLenis();

  const { intro, velocity, scrollProgress } = useGallery();

  const spiralRef = useRef<THREE.Group>(null);

  useEffect(() => {
    gsap.to(intro, {
      current: 1,
      duration: 2.5,
      ease: "power4.out",
    });
  }, [intro]);

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

        const centerY = (tileEdgesY[i] + tileEdgesY[i + 1]) / 2;

        const slope = tileEdgesY[i + 1] - tileEdgesY[i];

        return {
          geometry: createSpiralGeometry({
            radius,
            tileHeight,
            tileAngle,
            slope,
            segments: GALLERY_CONFIG.tileSegments,
          }),

          centerY,

          rotationY: i * angleStep,

          texture: `/images/${(i % GALLERY_CONFIG.totalImages) + 1}.jpg`,
        };
      },
    );
  }, []);

  useFrame((state) => {
    if (!spiralRef.current) return;

    spiralRef.current.rotation.y +=
      GALLERY_CONFIG.baseRotationSpeed + velocity.current * 0.0005;

    spiralRef.current.rotation.x = THREE.MathUtils.lerp(
      spiralRef.current.rotation.x,
      state.pointer.y * 0.15,
      0.05,
    );

    spiralRef.current.rotation.z = THREE.MathUtils.lerp(
      spiralRef.current.rotation.z,
      -state.pointer.x * 0.05,
      0.05,
    );

    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      -scrollProgress.current * 4,
      0.05,
    );
  });

  return (
    <group ref={spiralRef}>
      {tiles.map((tile, index) => (
        <group key={index} rotation-y={tile.rotationY}>
          <group position-y={tile.centerY}>
            <SpiralTile geometry={tile.geometry} texture={tile.texture} />
          </group>
        </group>
      ))}
    </group>
  );
}
