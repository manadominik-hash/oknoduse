import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LiveTicker } from "@/components/LiveTicker";
import { ToastHost } from "@/components/ToastHost";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Vernis — originály od slovenských umelcov",
  description:
    "Galéria a obchod, kde podporuješ skutočných umelcov. Jeden klik a obraz je tvoj. Zbieraj, leveluj, odomykaj odmeny.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <LiveTicker />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastHost />
        </AppProvider>
      </body>
    </html>
  );
}
