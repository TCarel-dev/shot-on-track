"use client";

import { useEffect, useMemo, useRef } from "react";

import * as THREE from "three";

import { useFrame } from "@react-three/fiber";

import gsap from "gsap";

import SpiralTile from "./SpiralTile";

import { useLenis } from "@/hooks/useLenis";

import { useGallery } from "@/hooks/useGallery";

import { createSpiralGeometry } from "@/lib/createSpiralGeometry";

import { GALLERY_CONFIG } from "@/constants/gallery";

export default function SpiralScene() {
  useLenis();

  const { velocity } = useGallery();

  const spiralRef = useRef<THREE.Group>(null);

  const scrollForce = useRef(0);

  useEffect(() => {
    if (!spiralRef.current) return;

    gsap.from(spiralRef.current.position, {
      y: 2,
      duration: 2,
      ease: "power4.out",
    });

    gsap.from(spiralRef.current.scale, {
      x: 0.95,
      y: 0.95,
      z: 0.95,
      duration: 2,
      ease: "power4.out",
    });
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

    scrollForce.current = THREE.MathUtils.lerp(
      scrollForce.current,
      velocity.current * 0.0015,
      0.08,
    );

    spiralRef.current.rotation.y +=
      GALLERY_CONFIG.baseRotationSpeed + scrollForce.current;

    scrollForce.current *= 0.95;

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
          <group position-y={tile.centerY}>
            <SpiralTile geometry={tile.geometry} texture={tile.texture} />
          </group>
        </group>
      ))}
    </group>
  );
}
