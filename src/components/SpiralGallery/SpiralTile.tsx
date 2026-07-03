import { useEffect, useMemo, useRef } from "react";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import gsap from "gsap";

import vertexShader from "@/shaders/gallery.vert";
import fragmentShader from "@/shaders/gallery.frag";

interface Props {
  geometry: THREE.BufferGeometry;
  index: number;
  imageSrc: string;
  positionY: number;
  rotationY: number;
}

export default function SpiralTile({
  geometry,
  index,
  imageSrc,
  positionY,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hovered = useRef(false);
  const texture = useTexture(imageSrc);

  const delay = index * 0.07;

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uHover: { value: 0 },
      uOpacity: { value: 0 },
    }),
    [texture],
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
      delay: delay,
      ease: "power4.out",
    });

    gsap.to(materialRef.current.uniforms.uOpacity, {
      value: 1,
      duration: 0.5,
      delay: delay,
    });
  }, [index, positionY, delay]);

  useFrame(() => {
    if (!materialRef.current || !meshRef.current) return;

    const targetHover = hovered.current ? 1 : 0;

    materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uHover.value,
      targetHover,
      0.1,
    );

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
      onPointerOver={() => (hovered.current = true)}
      onPointerOut={() => (hovered.current = false)}
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
