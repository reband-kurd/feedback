import { Inter } from "next/font/google";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Load Inter font for Latin characters
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Load Noto Sans Arabic for RTL content
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "FeedbackHub | Share Your Thoughts",
  description: "Share your feedback with us",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansArabic.variable}`}>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
