"use client";

import styles from "./styles.module.scss";

const ROWS = 3;
const COLS = 10;

const words = ["MANON", "VALOGNES", ""];

export default function HeroGrid() {
  const cells = Array.from({ length: ROWS * COLS });

  return (
    <div className={styles.heroGrid}>
      {cells.map((_, index) => {
        const row = Math.floor(index / COLS);
        const col = index % COLS;

        const isLastRow = row === ROWS - 1;
        const isLastCol = col === COLS - 1;

        const letter = words[row]?.[col];

        return (
          <div key={index} className={styles.heroGridCell}>
            <div key={index} className={styles.heroGridCellLetter}>
              {letter && <span>{letter}</span>}
            </div>
            {!isLastCol && !isLastRow && (
              <span className={styles.heroGridCross} />
            )}
          </div>
        );
      })}
    </div>
  );
}
