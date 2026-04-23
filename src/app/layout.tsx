import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
 title: "SaaSify — Multi-Tenant Dashboard",
 description: "A production-grade SaaS dashboard with workspaces, billing, and team management.",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en" className="h-full antialiased font-sans" suppressHydrationWarning>
 <body className="min-h-full flex flex-col bg-[#0F0F1A] text-[#E5E7EB]">
 {children}
 </body>
 </html>
 );
}
