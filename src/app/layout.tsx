import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
 title: "ContentCore AI | Next-Gen Content Operations",
 description: "Stop editing generic ChatGPT output. Train our AI on your exact tone, audience, and core values to generate multi-channel campaigns in seconds.",
 keywords: ["AI content generation", "multi-tenant SaaS", "brand voice", "marketing automation", "content operations"],
 authors: [{ name: "ContentCore Team" }],
 openGraph: {
   type: "website",
   locale: "en_US",
   url: "https://saas-next-dashboard.vercel.app/", // TODO: Replace with your actual production domain
   title: "ContentCore AI | Next-Gen Content Operations",
   description: "Train our AI on your exact tone to generate multi-channel campaigns in seconds.",
   siteName: "ContentCore AI",
 },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ContentCore AI",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "AI Content Generation SaaS with Brand Voice Memory and Multi-Channel Campaigns."
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en" className="h-full antialiased font-sans" suppressHydrationWarning>
 <body className="min-h-full flex flex-col bg-[#0F0F1A] text-[#E5E7EB]">
 <script
   type="application/ld+json"
   dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
 />
 {children}
 </body>
 </html>
 );
}
