"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";
import { Image as ImageIcon } from "lucide-react"; // Consistência visual com o ProductCard

interface ProductGalleryProps {
  images?: { url: string }[];
}

export function ProductGallery({ images = [] }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // =========================================
  // 1. FALLBACK DE PRODUTO SEM FOTOS
  // Usando a mesma linguagem visual de "vazio" da sua vitrine
  // =========================================
  if (!images.length) {
    return (
      <div className="border-border/60 bg-card/30 text-muted-foreground flex aspect-square w-full flex-col items-center justify-center rounded-4xl border border-dashed backdrop-blur-sm">
        <ImageIcon className="mb-3 h-12 w-12 opacity-40" />
        <span className="text-sm font-semibold tracking-wider uppercase opacity-60">
          Sem fotos
        </span>
      </div>
    );
  }

  const currentImage = images[selectedIndex]?.url;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* =========================================
          2. IMAGEM PRINCIPAL (Responsiva e Fluida)
      ========================================= */}
      <div className="border-border/50 bg-card/50 relative aspect-square w-full overflow-hidden rounded-4xl border shadow-sm backdrop-blur-sm">
        {currentImage && !imgError ? (
          <Image
            src={currentImage}
            alt="Foto principal do produto"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="bg-secondary/30 text-muted-foreground flex h-full w-full flex-col items-center justify-center">
            <ImageIcon className="mb-3 h-12 w-12 opacity-40" />
            <span className="text-sm font-semibold tracking-wider uppercase opacity-60">
              Imagem Indisponível
            </span>
          </div>
        )}
      </div>

      {/* =========================================
          3. CARROSSEL DE MINIATURAS INTELIGENTE
          Mobile: Scroll horizontal escondido
          Desktop: Quebra de linha automática (flex-wrap)
      ========================================= */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {images.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                aria-label={`Ver imagem ${idx + 1}`}
                onClick={() => {
                  setSelectedIndex(idx);
                  setImgError(false); // Permite tentar carregar a nova foto principal
                }}
                className={cn(
                  "focus-visible:ring-primary relative aspect-square w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-20",
                  isSelected
                    ? "border-primary ring-primary/20 scale-105 shadow-sm ring-2"
                    : "bg-card/50 border-transparent opacity-60 hover:scale-105 hover:opacity-100",
                )}
              >
                <Image
                  src={img.url}
                  alt={`Miniatura ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 64px, 80px"
                  className="object-cover"
                  // Correção do Bug: Se a miniatura quebrar, escondemos o botão inteiro (parentElement)
                  onError={(e) => {
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.style.display = "none";
                    }
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
