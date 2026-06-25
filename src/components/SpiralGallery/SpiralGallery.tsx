"use client";

import { Canvas } from "@react-three/fiber";
import { useLenis } from "@/hooks/useLenis";
import { GALLERY_CONFIG } from "@/constants/gallery";

import SpiralScene from "./SpiralScene";

export default function SpiralGallery() {
  useLenis();

  return (
    <section className="spiral-wrapper">
      <div className="scroll-container">
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
          }}
          camera={{
            position: [0, 0, GALLERY_CONFIG.cameraZ],
            fov: GALLERY_CONFIG.cameraFov,
          }}
        >
          <SpiralScene />
        </Canvas>
      </div>
    </section>
  );
}
