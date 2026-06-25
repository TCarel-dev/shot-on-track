"use client";

import { useEffect, useState } from "react";

import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import { GALLERY_CONFIG } from "@/constants/gallery";
import { useLenis } from "@/hooks/useLenis";

import SpiralScene from "./SpiralScene";
import styles from "./styles.module.scss";

export default function SpiralGallery() {
  useLenis();

  const [loaded, setLoaded] = useState(false);

  const { x, y, z } = GALLERY_CONFIG.cameraPos;

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={clsx(
        styles.spiralGallery,
        loaded ? styles.spiralLoaded : styles.spiralLoading,
      )}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [x, y, z],
          fov: GALLERY_CONFIG.cameraFov,
        }}
      >
        <SpiralScene />
      </Canvas>
    </div>
  );
}
