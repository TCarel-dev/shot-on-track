import type { Metadata } from "next";

import Header from "@/components/Header/Header";

import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Manon Valognes | Shot on Track",
  description:
    "Photographe & vidéaste freelance basée à Cerhbourg, spécialisée dans la photographie de sport et d'action.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
