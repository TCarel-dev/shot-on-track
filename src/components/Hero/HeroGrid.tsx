"use client";

import styles from "./styles.module.scss";

export default function HeroGrid() {
  const ROWS = 3;
  const COLS = 8;

  const cells = Array.from({ length: ROWS * COLS });

  return (
    <div className={styles.heroGrid}>
      {cells.map((_, index) => {
        const row = Math.floor(index / COLS);
        const col = index % COLS;

        const isLastRow = row === ROWS - 1;
        const isLastCol = col === COLS - 1;

        return (
          <div key={index} className={styles.heroGridCell}>
            {!isLastCol && !isLastRow && (
              <span className={styles.heroGridCross} />
            )}
          </div>
        );
      })}
    </div>
  );
}
