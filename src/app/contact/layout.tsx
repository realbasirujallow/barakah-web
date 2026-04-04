import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Barakah Islamic Finance Tracker",
  description: "Get in touch with Barakah support. Have questions, feature requests, or partnership inquiries? We read every message and respond within 1-2 business days.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
