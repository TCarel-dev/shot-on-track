"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

export default function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={styles.mouseTracker}>
      <div>
        <span>x</span>:<span>{pos.x}</span>
      </div>
      <div>
        <span>y</span>:<span>{pos.y}</span>
      </div>
    </div>
  );
}
