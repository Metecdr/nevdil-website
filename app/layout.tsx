import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.SITE_URL || "https://nevdil.com";
const DESCRIPTION =
  "Nevşehir'in öncü İngilizce kursu. Uzman öğretmenler, küçük grup sınıfları ve modern metodlarla hedeflerinize ulaşın. YDS, İş İngilizcesi, Junior ve İlkokul grupları.";

export const metadata: Metadata = {
  title: {
    default: "Nev-Dil Yabancı Dil Kursu | Nevşehir İngilizce Kursu",
    template: "%s | Nev-Dil",
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Nev-Dil Yabancı Dil Kursu",
    title: "Nev-Dil Yabancı Dil Kursu | Nevşehir İngilizce Kursu",
    description: DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Nev-Dil Yabancı Dil Kursu",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Nev-Dil Yabancı Dil Kursu",
    description: DESCRIPTION,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
