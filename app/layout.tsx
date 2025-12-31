import type { Metadata } from "next";
import { AuthProvider } from "./context/context";
import { Toaster } from "@/components/ui/sonner";

import { inter } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalioope",
  description: "A social app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
