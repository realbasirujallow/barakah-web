import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Barakah",
  description: "Read Barakah's Terms of Service. Understand the terms and conditions for using our Islamic finance tracker application.",
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
