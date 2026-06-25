"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { useGallery } from "@/hooks/useGallery";

export function useLenis() {
  const { velocity, scrollProgress } = useGallery();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    lenis.on("scroll", (e) => {
      velocity.current = e.velocity;

      scrollProgress.current = e.progress;
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [velocity, scrollProgress]);
}
