"use client";

import SpiralGallery from "@/components/SpiralGallery/SpiralGallery";
import HeroGrid from "./HeroGrid";

import styles from "./styles.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <HeroGrid />
      <div className={styles.heroWrapper}>
        <h1>
          <div>MANON</div>
          <div>VALOGNES</div>
        </h1>
      </div>
      <SpiralGallery />
    </section>
  );
}
