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

        const letter = words[row]?.[col];

        const classNames = [
          styles.heroGridCell,
          row === 0 && styles.firstRow,
          row === ROWS - 1 && styles.lastRow,
          col === 0 && styles.firstCol,
          col === COLS - 1 && styles.lastCol,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={index} className={classNames}>
            <div className={styles.heroGridCellLetter}>
              {letter && <span>{letter}</span>}
            </div>

            {!(row === ROWS - 1 || col === COLS - 1) && (
              <span className={styles.heroGridCross} />
            )}
          </div>
        );
      })}
    </div>
  );
}
