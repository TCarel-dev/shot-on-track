"use client";

import SpiralGallery from "@/components/SpiralGallery/SpiralGallery";
import MouseTracker from "@/components/MouseTracker/MouseTracker";
import HeroGrid from "./HeroGrid";

import styles from "./styles.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <HeroGrid />
      <div className={styles.heroWrapper}>
        <MouseTracker />
      </div>
      <SpiralGallery />
    </section>
  );
}
