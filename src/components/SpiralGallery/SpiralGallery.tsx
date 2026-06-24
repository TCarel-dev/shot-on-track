"use client";

import { Canvas } from "@react-three/fiber";
import SpiralScene from "./SpiralScene";
import { useLenis } from "@/hooks/useLenis";

export default function SpiralGallery() {
  useLenis();

  return (
    <section
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [0, 0, 12],
          fov: 40,
        }}
      >
        <SpiralScene />
      </Canvas>
    </section>
  );
}
