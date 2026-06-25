"use client";

import { useEffect } from "react";
import { useGallery } from "@/hooks/useGallery";

export function useScrollVelocity() {
  const { velocity } = useGallery();

  useEffect(() => {
    let lastY = window.scrollY;

    let frameId = 0;

    const update = () => {
      velocity.current = window.scrollY - lastY;

      lastY = window.scrollY;

      frameId = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(frameId);
  }, [velocity]);
}
