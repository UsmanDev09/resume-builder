
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

// import "./globals.css";
import "@resume/ui/globals.css"
import { Toaster } from "@resume/ui/toaster";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ['latin']});

export const metadata: Metadata = {
  title: {
    template: '%s - Resume builder',
    absolute: 'Resume builder'
  },
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <body
          className={`${inter.className} antialiased`}
        >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <Toaster />
          <Navbar />
          {children}
        </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
