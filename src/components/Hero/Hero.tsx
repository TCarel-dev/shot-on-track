"use client";

import SpiralGallery from "@/components/SpiralGallery/SpiralGallery";
import styles from "./styles.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
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
