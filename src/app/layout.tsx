import type { Metadata } from "next";
import { Eagle_Lake, Inter, Lexend, Roboto } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
})

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-headline'
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-landing-sans',
  weight: ['400', '500', '700'],
});

const eagleLake = Eagle_Lake({
  subsets: ['latin'],
  variable: '--font-landing-headline',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Smart Todo List with AI',
  description: 'An intelligent todo list application powered by AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, lexend.variable, roboto.variable, eagleLake.variable)} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
