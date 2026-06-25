"use client";

import { Canvas } from "@react-three/fiber";
import { useLenis } from "@/hooks/useLenis";

import DynamicBackground from "./DynamicBackground";
import SpiralScene from "./SpiralScene";

import styles from "./styles.module.scss";

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
            position: [0, 0, 12],
            fov: 75,
          }}
        >
          <SpiralScene />
        </Canvas>
      </div>
    </section>
  );
}
