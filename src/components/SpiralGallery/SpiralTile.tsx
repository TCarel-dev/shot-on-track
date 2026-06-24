"use client";

import { useMemo, useRef } from "react";

import * as THREE from "three";

import { useFrame, useThree } from "@react-three/fiber";

import { useTexture } from "@react-three/drei";

import vertexShader from "@/shaders/gallery.vert";

import fragmentShader from "@/shaders/gallery.frag";

import { useGallery } from "@/providers/GalleryProvider";

import { GALLERY_CONFIG } from "@/constants/gallery";

interface Props {
  geometry: THREE.BufferGeometry;
  texture: string;
}

export default function SpiralTile({ geometry, texture }: Props) {
  const { intro, velocity, scrollProgress } = useGallery();

  const hovered = useRef(false);

  const hover = useRef(0);

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const { camera } = useThree();

  const map = useTexture(texture);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uMap: { value: map },
          uTime: { value: 0 },
          uHover: { value: 0 },
          uVelocity: { value: 0 },
          uIntro: { value: 0 },
          uScrollProgress: { value: 0 },
          uCameraPosition: {
            value: new THREE.Vector3(),
          },
        },
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [map],
  );

  useFrame((state) => {
    const material = materialRef.current;
    const mesh = meshRef.current;

    if (!material || !mesh) return;

    hover.current = THREE.MathUtils.lerp(
      hover.current,
      hovered.current ? 1 : 0,
      0.08,
    );

    mesh.scale.setScalar(
      THREE.MathUtils.lerp(
        mesh.scale.x,
        hovered.current
          ? GALLERY_CONFIG.tileHoveredScale
          : GALLERY_CONFIG.tileScale,
        0.08,
      ),
    );

    material.uniforms.uTime.value = state.clock.elapsedTime;

    material.uniforms.uHover.value = hover.current;

    material.uniforms.uVelocity.value = velocity.current;

    material.uniforms.uIntro.value = intro.current;

    material.uniforms.uScrollProgress.value = scrollProgress.current;

    material.uniforms.uCameraPosition.value.copy(camera.position);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerEnter={() => {
        hovered.current = true;
      }}
      onPointerLeave={() => {
        hovered.current = false;
      }}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={material.uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
