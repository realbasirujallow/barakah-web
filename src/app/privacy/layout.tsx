import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Barakah",
  description: "Barakah's Privacy Policy. Learn how we collect, use, and protect your personal and financial data.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
