"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

interface GalleryContextValue {
  intro: React.MutableRefObject<number>;
  velocity: React.MutableRefObject<number>;
  scrollProgress: React.MutableRefObject<number>;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const intro = useRef(0);
  const velocity = useRef(0);
  const scrollProgress = useRef(0);

  return (
    <GalleryContext.Provider
      value={{
        intro,
        velocity,
        scrollProgress,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);

  if (!context) {
    throw new Error("useGallery must be used inside GalleryProvider");
  }

  return context;
}
