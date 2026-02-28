import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Configuração da fonte como variável CSS
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Crochê da T | Gerenciamento",
    template: "%s | Crochê da T", // Permite páginas internas mudarem o título (ex: Dashboard | Crochê da T)
  },
  description: "Sistema de gerenciamento de encomendas e peças de crochê.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Evita zoom indesejado em inputs no iOS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 'dark' fixa pois seu design é focado nisso.
    // lang 'pt-BR' corrigido (o padrão oficial usa o R maiúsculo)
    <html
      lang="pt-BR"
      className={`dark ${inter.variable}`}
      suppressHydrationWarning
    >
      <body
        className={` ${inter.className} bg-background text-foreground selection:bg-primary/30 selection:text-primary min-h-screen antialiased`}
      >
        <Providers>
          {/* Main para garantir acessibilidade e estrutura semântica */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
