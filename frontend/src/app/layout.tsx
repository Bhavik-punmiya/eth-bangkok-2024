import type { Metadata } from "next";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const OnchainProviders = dynamic(() => import("@/utils/wagmi-provider"), {
  ssr: false,
});
export const metadata: Metadata = {
  title: "ContractAi",
  description: "Think ideas, not code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-theme-off-white pt-16 min-h-screen">
        <Providers>
          <OnchainProviders>
            <Navbar />
            {children}
          </OnchainProviders>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
