import { GalleryProvider } from "@/providers/GalleryProvider";
import Hero from "@/components/Hero/Hero";

export default function Home() {
  return (
    <GalleryProvider>
      <Hero />
    </GalleryProvider>
  );
}
