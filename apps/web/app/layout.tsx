import { PropsWithChildren } from "react";
import type { Metadata } from "next";

import { Providers } from "@/lib/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <Providers>
      <html lang="en" className="dark">
        <body>{children}</body>
      </html>
    </Providers>
  );
}
