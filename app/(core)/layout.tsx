import { Poppins } from "next/font/google";
import NavBar from "../../components/navbar";
import "../globals.css";

// Import Poppins font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Auth",
  description: "Authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <div className="md:w-[80%] mx-auto h-screen max-h-screen flex flex-col">
          <NavBar />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
