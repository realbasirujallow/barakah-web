import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Barakah Support | Islamic Household Finance",
  description: "Get in touch with Barakah support for product questions, billing help, feature requests, or partnership inquiries. We reply personally within 1-2 business days.",
  alternates: { canonical: "https://trybarakah.com/contact" },
  openGraph: {
    title: "Contact Barakah Support",
    description: "Questions, billing help, feature requests, or partnership inquiries — we respond personally within 1-2 business days.",
    url: "https://trybarakah.com/contact",
    siteName: "Barakah",
    type: "website",
  },
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
