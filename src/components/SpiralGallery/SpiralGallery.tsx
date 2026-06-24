"use client";

import { Canvas } from "@react-three/fiber";
import SpiralScene from "./SpiralScene";
import { useLenis } from "@/hooks/useLenis";

import styles from "./styles.module.scss";

export default function SpiralGallery() {
  useLenis();

  return (
    <section className={styles.hero}>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [0, 0, 12],
          fov: 45,
        }}
      >
        <SpiralScene />
      </Canvas>
    </section>
  );
}
