import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Melhora a performance de carregamento da fonte
});

export const metadata: Metadata = {
  title: "Crochê da T | Gerenciamento",
  description: "Sistema de gerenciamento de encomendas e peças.",
  icons: {
    icon: "/favicon.ico", // Garante que o navegador ache o ícone
  },
};

// No Next.js 16, configurações de viewport são separadas da metadata
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark" suppressHydrationWarning>
      <body
        className={` ${inter.className} bg-background text-foreground selection:bg-primary/30 selection:text-primary min-h-screen antialiased`}
      >
        <Providers>
          {/* O layout raíz só entrega os Providers e o children. 
              Toda a estética de Grid ou Spotlight deve ficar nas páginas ou nos layouts de grupo. */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
