"use client";

import { useRef, useState, ReactNode } from "react";

import { GalleryContext } from "./GalleryContext";

export function GalleryProvider({ children }: { children: ReactNode }) {
  const velocity = useRef(0);
  const scrollProgress = useRef(0);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <GalleryContext.Provider
      value={{
        velocity,
        scrollProgress,
        activeImage,
        setActiveImage,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}
