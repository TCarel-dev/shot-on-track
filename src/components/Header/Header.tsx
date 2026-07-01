"use client";

import MouseTracker from "@/components/MouseTracker/MouseTracker";

import styles from "./styles.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <MouseTracker />
      </div>
    </header>
  );
}
