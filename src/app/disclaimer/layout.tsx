import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer & Islamic Guidance Notice — Barakah",
  description: "Important disclaimer about Barakah. Learn about our limitations, scholarly references, and how to use our app responsibly.",
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
