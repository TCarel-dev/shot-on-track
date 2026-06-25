"use client";

import { Canvas } from "@react-three/fiber";
import { GALLERY_CONFIG } from "@/constants/gallery";
import { useLenis } from "@/hooks/useLenis";

import SpiralScene from "./SpiralScene";
import styles from "./styles.module.scss";

export default function SpiralGallery() {
  useLenis();

  return (
    <div className={styles.spiralGallery}>
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
  );
}
