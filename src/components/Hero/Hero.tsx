"use client";

import SpiralGallery from "@/components/SpiralGallery/SpiralGallery";
import HeroGrid from "./HeroGrid";

import styles from "./styles.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <HeroGrid />
      <SpiralGallery />
    </section>
  );
}
