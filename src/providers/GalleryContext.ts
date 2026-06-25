"use client";

import { createContext } from "react";

export interface GalleryContextValue {
  velocity: React.MutableRefObject<number>;
  scrollProgress: React.MutableRefObject<number>;

  activeImage: string | null;
  setActiveImage: (image: string | null) => void;
}

export const GalleryContext = createContext<GalleryContextValue | null>(null);
