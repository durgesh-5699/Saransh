import type { Metadata } from "next";
import { Source_Sans_3 as FontSans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Saransh",
  description: "saransh is an app for summarizing the PDF documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", geist.variable)}
    >
      <body className="relative min-h-screen flex flex-col">
        <Header/>
        <main className="flex-1">{children}</main>
        <Footer/>
        </body>
    </html>
  );
}