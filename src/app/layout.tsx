import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "@vercel/analytics/react";
import { siteCofig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: siteCofig.name,
  description: siteCofig.description,
  keywords: ["bible", "zawhna", "chhanna", "apologia", "mizo"],
  authors: [
    {
      name: "Reckson Zirsangzela Khiangte",
      url: "https://recksonk.in",
    },
  ],
  creator: "Reckson",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteCofig.url,
    title: siteCofig.name,
    description: siteCofig.description,
    siteName: siteCofig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteCofig.name,
    description: siteCofig.description,
    images: [`${siteCofig.url}/og.jpeg`],
    creator: "@RecksonKhiangte",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </TRPCReactProvider>
        <Toaster />
        <Analytics />
        <TailwindIndicator />
      </body>
    </html>
  );
}
