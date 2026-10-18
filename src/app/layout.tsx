import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "CaseZero — Follow the evidence",
  description:
    "Three original detective mysteries. Explore atmospheric locations, question suspects and follow the evidence to a supported conclusion.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <noscript>
          CaseZero needs JavaScript to open your investigations. Enable it in
          your browser settings, then reload.
        </noscript>
        {children}
      </body>
    </html>
  );
}
