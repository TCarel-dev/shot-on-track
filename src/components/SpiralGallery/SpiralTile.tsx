"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import gsap from "gsap";

import vertexShader from "@/shaders/gallery.vert";
import fragmentShader from "@/shaders/gallery.frag";

interface Props {
  geometry: THREE.BufferGeometry;
  texture: string;

  index: number;
  positionY: number;
}

export default function SpiralTile({
  geometry,
  texture,
  index,
  positionY,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hovered = useRef(false);
  const hoverProgress = useRef(0);
  const map = useTexture(texture);

  const delay = index * 0.09;

  const uniforms = useMemo(
    () => ({
      uMap: {
        value: map,
      },

      uHover: {
        value: 0,
      },

      uOpacity: {
        value: 0,
      },
    }),
    [map],
  );

  useEffect(() => {
    if (!meshRef.current || !materialRef.current) return;

    meshRef.current.position.y = positionY + 1.5;
    meshRef.current.position.z = 6;
    meshRef.current.scale.setScalar(3);

    gsap.to(meshRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      delay: delay,
      ease: "power4.out",
    });

    gsap.to(meshRef.current.position, {
      y: positionY,
      z: 0,
      duration: 1.2,
      ease: "power4.out",
      delay: delay,
    });

    gsap.to(materialRef.current.uniforms.uOpacity, {
      value: 1,
      duration: 0.5,
      delay: delay,
    });
  }, [index, positionY]);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;

    hoverProgress.current = THREE.MathUtils.lerp(
      hoverProgress.current,
      hovered.current ? 1 : 0,
      0.08,
    );

    materialRef.current.uniforms.uHover.value = hoverProgress.current;

    const targetScale = hovered.current ? 1.05 : 1;

    const scale = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      targetScale,
      0.08,
    );

    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerOver={(e) => {
        e.stopPropagation();
        hovered.current = true;
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        hovered.current = false;
      }}
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
