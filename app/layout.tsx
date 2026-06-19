import type { Metadata } from "next";
import { Bebas_Neue, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ameen Jawhar — Full Stack Builder & Design Engineer",
  description:
    "Portfolio of Ameen Jawhar — architecting clean full-stack logic with a designer's eye. BTech CSE, Kerala.",
  keywords: [
    "Ameen Jawhar",
    "Full Stack Developer",
    "Design Engineer",
    "React",
    "FastAPI",
    "Kerala",
    "Portfolio",
  ],
  authors: [{ name: "Ameen Jawhar" }],
  openGraph: {
    title: "Ameen Jawhar — Full Stack Builder & Design Engineer",
    description: "Architecting clean full-stack logic with a designer's eye.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
