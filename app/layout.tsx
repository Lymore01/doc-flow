import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import localFont from 'next/font/local'
import { ClerkProvider } from "@clerk/nextjs";

const poppins = localFont({
  src: "./fonts/Poppins/Poppins-Medium.ttf",
  variable: "--font-poppins",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: "DocX",
  description: "Your document management solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    signInUrl="/login"
    signUpUrl="/signup"
    >
      <html lang="en">
        <body className={`${poppins.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
