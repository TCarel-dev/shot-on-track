"use client";

import { useContext } from "react";

import { GalleryContext } from "@/providers/GalleryContext";

export function useGallery() {
  const context = useContext(GalleryContext);

  if (!context) {
    throw new Error("useGallery must be used inside GalleryProvider");
  }

  return context;
}
