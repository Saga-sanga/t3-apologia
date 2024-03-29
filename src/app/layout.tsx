import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Mizo Apologia",
  description: "Bible zawhna leh chhanna",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
