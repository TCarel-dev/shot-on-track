"use client";

import { useEffect } from "react";
import gsap from "gsap";

import { useGallery } from "@/providers/GalleryProvider";

export function useIntroAnimation() {
  const { intro } = useGallery();

  useEffect(() => {
    gsap.to(intro, {
      current: 1,
      duration: 2.5,
      ease: "power4.out",
    });
  }, [intro]);
}
