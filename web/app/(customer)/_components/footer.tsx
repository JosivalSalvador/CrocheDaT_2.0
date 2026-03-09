"use client";

import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";

// Ícones SVG nativos (livres de depreciação e dependências)
const IconInstagram = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const IconTikTok = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  const pathname = usePathname();
  const isIndividualChatPage =
    pathname.startsWith("/home/chats/") && pathname.split("/").length > 3;

  if (isIndividualChatPage) {
    return null; // Oculta o header inteiro se estiver no chat
  }
  return (
    <footer className="border-border/40 bg-background/60 supports-backdrop-filter:bg-background/40 mt-auto w-full border-t backdrop-blur-lg">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="text-muted-foreground flex flex-col items-center justify-between gap-6 text-xs md:flex-row">
          {/* LADO ESQUERDO: Copyright */}
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-foreground/80 font-semibold">
              Crochê da T
            </span>
            . Todos os direitos reservados.
          </p>

          {/* LADO DIREITO: Redes Sociais e Assinatura */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {/* Ícones de Redes Sociais com Links Reais */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/croche.dat/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors hover:scale-110"
                aria-label="Instagram"
              >
                <IconInstagram className="h-4 w-4" />
              </a>

              <a
                href="https://www.tiktok.com/@croche.dat?_r=1&_t=ZS-94WtWEHgPHJ"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors hover:scale-110"
                aria-label="TikTok"
              >
                <IconTikTok className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-border/50 hidden h-3 w-px sm:block" />

            <span className="flex items-center gap-1.5 opacity-80">
              Feito com <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
