import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "../components/ui/toaster";
import { ReactQueryProvider } from "../lib/react-query-provider";

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
      signInForceRedirectUrl={"/dashboard"}
      signUpFallbackRedirectUrl={"/dashboard"}
    >
      <html lang="en">
        <body className={`${poppins.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>{children}</ReactQueryProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
