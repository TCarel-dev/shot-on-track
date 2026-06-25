"use client";

import { useGallery } from "@/hooks/useGallery";
import styles from "./styles.module.scss";

export default function DynamicBackground() {
  const { activeImage } = useGallery();

  return (
    <div
      className={styles.backgroundLayer}
      aria-hidden={activeImage ? true : false}
      style={{
        backgroundImage: activeImage ? `url(${activeImage})` : "none",
      }}
    />
  );
}
