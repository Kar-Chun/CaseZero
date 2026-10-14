import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "CaseZero — The Quiet Hour",
  description:
    "An artifact vanishes. Four stories remain. A cinematic detective mystery inside the Halcyon Museum.",
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
