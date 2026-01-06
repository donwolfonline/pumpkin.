import type { Metadata } from "next";
import { Nunito, Open_Sans, Fira_Code, Permanent_Marker } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-nunito",
});

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-permanent-marker",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-open-sans",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "Pumpkin - Code for Humans",
  description: "The programming language you can actually read. Built for beginners, designed for clarity.",
  icons: {
    icon: '/favicon.png',
  },
};

import InteractiveBackground from "./components/InteractiveBackground";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${nunito.variable} ${permanentMarker.variable} ${openSans.variable} ${firaCode.variable} font-body antialiased overflow-x-hidden`}
      >
        <ThemeProvider>
          <InteractiveBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
