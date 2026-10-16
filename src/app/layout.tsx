import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "CaseZero — Follow the evidence",
  description:
    "Two original detective mysteries. Explore atmospheric locations, question suspects and follow the evidence to a supported conclusion.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
