"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import vertexShader from "@/shaders/gallery.vert";
import fragmentShader from "@/shaders/gallery.frag";

import { useGallery } from "@/hooks/useGallery";

interface Props {
  geometry: THREE.BufferGeometry;
  texture: string;
}

export default function SpiralTile({ geometry, texture }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const hovered = useRef(false);

  const hoverProgress = useRef(0);

  const { setActiveImage } = useGallery();

  const map = useTexture(texture);

  const uniforms = useMemo(
    () => ({
      uMap: {
        value: map,
      },

      uHover: {
        value: 0,
      },
    }),
    [map],
  );

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;

    hoverProgress.current = THREE.MathUtils.lerp(
      hoverProgress.current,
      hovered.current ? 1 : 0,
      0.08,
    );

    materialRef.current.uniforms.uHover.value = hoverProgress.current;

    const scale = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      hovered.current ? 1.05 : 1,
      0.08,
    );

    meshRef.current.scale.setScalar(scale);
  });

  const handleOver = () => {
    hovered.current = true;
    setActiveImage(texture);
  };

  const handleOut = () => {
    hovered.current = false;
    setActiveImage(null);
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      raycast={THREE.Mesh.prototype.raycast}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
