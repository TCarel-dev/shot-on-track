"use client";

import { useEffect } from "react";
import { useGallery } from "@/providers/GalleryProvider";

export function useScrollProgress() {
  const { scrollProgress } = useGallery();

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      const max = document.body.scrollHeight - window.innerHeight;

      scrollProgress.current = max > 0 ? window.scrollY / max : 0;

      frameId = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(frameId);
  }, [scrollProgress]);
}
