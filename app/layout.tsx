import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Advanced Fuel Cell Calculator",
  description: "Open source tool to calculate and analyze fuel cell performance with precision",
  openGraph: {
    title: "Advanced Fuel Cell Calculator",
    description: "Open source tool for precise fuel cell performance analysis",
    siteName: "Fuel Cell Calculator",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Advanced Fuel Cell Calculator Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanced Fuel Cell Calculator",
    description: "Open source tool for precise fuel cell performance analysis",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="bg-indigo-600 text-white py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Fuel Cell Calculator</h1>
            <nav>
              <Link href="https://github.com/Misterbra/advanced-fuel-cell-calculator.git" className="text-white hover:text-indigo-200">
                GitHub
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-indigo-700 text-white py-4 mt-8">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p>&copy; 2024 Advanced Fuel Cell Calculator. Open Source Project.</p>
            <div className="flex space-x-4">
              <Link href="https://github.com/Misterbra/advanced-fuel-cell-calculator.git" className="hover:text-indigo-200">
                GitHub
              </Link>
              <a href="mailto:kenkan.vl@gmail.com" className="hover:text-indigo-200">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}