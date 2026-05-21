import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/top-bar";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Frame Shop",
  description: "Order, inventory, and customer management for Frame Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${libreBaskerville.variable} h-full antialiased`}>
      <body className="h-full flex flex-col font-sans p-3 gap-3">
        <TopBar />
        <div className="flex flex-1 overflow-hidden gap-3">
          <LeftSidebar />
          <main className="flex-1 overflow-y-auto scrollbar-hide bg-panel rounded-2xl shadow-lg p-8 border border-warm-border">
            {children}
          </main>
          <RightSidebar />
        </div>
      </body>
    </html>
  );
}
