import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";

import vertexShader from "@/shaders/gallery.vert";
import fragmentShader from "@/shaders/gallery.frag";

interface Props {
  geometry: THREE.BufferGeometry;
  imageSrc: string;
  index: number;
  positionY: number;
  hasText: boolean;
}

export default function SpiralTile({
  geometry,
  imageSrc,
  index,
  positionY,
  hasText,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hovered = useRef(false);

  const texture = useTexture(imageSrc);

  const textTexture = useMemo(() => {
    const width = 2048;
    const height = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (ctx && hasText) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffe0bd";
      ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
      ctx.lineWidth = 4;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 60px sans-serif";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      // ctx.shadowBlur = 16;
      const text = "SHOT ON TRACK © 2026";
      ctx.strokeText(text, width / 2, height * 0.05);
      ctx.fillText(text, width / 2, height * 0.05);
      ctx.strokeText(text, width / 2, height * 0.95);
      ctx.fillText(text, width / 2, height * 0.95);
    }

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.minFilter = THREE.LinearFilter;
    canvasTexture.magFilter = THREE.LinearFilter;
    canvasTexture.flipY = true;
    return canvasTexture;
  }, [hasText]);

  const delay = index * 0.07;

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTextMap: { value: textTexture },
      uTextureAspect: { value: 1 },
      uHover: { value: 0 },
      uOpacity: { value: 0 },
      uShowText: { value: hasText ? 1 : 0 },
      uHoles: { value: hasText ? 0 : 1 },
    }),
    [texture, textTexture, hasText],
  );

  useEffect(() => {
    const image = texture?.image as { width: number; height: number } | null;
    if (image?.width && image?.height && materialRef.current) {
      materialRef.current.uniforms.uTextureAspect.value =
        image.width / image.height;
    }
  }, [texture]);

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
  }, [index, positionY]);

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
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
