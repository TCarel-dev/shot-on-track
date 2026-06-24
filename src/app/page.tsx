import SpiralGallery from "@/components/SpiralGallery/SpiralGallery";

export default function Home() {
  return (
    <>
      <section
        style={{
          height: "100vh",
          background: "#171717",
        }}
      >
        <SpiralGallery />
      </section>

      <section
        style={{
          height: "200vh",
          background: "#111",
        }}
      />
    </>
  );
}
