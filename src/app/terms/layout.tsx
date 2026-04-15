import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Barakah Islamic Finance App",
  description: "Read Barakah's Terms of Service for the fiqh-aware Islamic household finance platform covering zakat calculation, halal budgeting, Islamic investing, and estate planning.",
  keywords: ["barakah terms of service", "islamic finance app terms", "barakah legal", "barakah user agreement"],
  alternates: { canonical: "https://trybarakah.com/terms" },
  openGraph: {
    title: "Terms of Service — Barakah",
    description: "Terms of Service for Barakah, the Islamic household finance and zakat calculator app.",
    url: "https://trybarakah.com/terms",
    siteName: "Barakah",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
