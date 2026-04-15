import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer & Islamic Guidance Notice — Barakah",
  description: "Barakah's Islamic guidance disclaimer. Our fiqh-informed tools support scholarly consultation — not replace it. Understand how to use zakat calculators and Islamic finance tools responsibly.",
  keywords: ["barakah disclaimer", "islamic finance disclaimer", "zakat calculator disclaimer", "fiqh guidance notice"],
  alternates: { canonical: "https://trybarakah.com/disclaimer" },
  openGraph: {
    title: "Disclaimer & Islamic Guidance Notice — Barakah",
    description: "Understand how Barakah's Islamic finance tools support scholarly consultation — not replace it.",
    url: "https://trybarakah.com/disclaimer",
    siteName: "Barakah",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
