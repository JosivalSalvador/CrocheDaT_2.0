"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";
import { ImageOff } from "lucide-react";

interface ProductGalleryProps {
  // Seguindo o padrão que vi no seu ProductCard: product.images?.[0]?.url
  images?: { url: string }[];
}

export function ProductGallery({ images = [] }: ProductGalleryProps) {
  // Controlamos apenas o índice. A URL da imagem é derivada disso.
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Fallback se não houver imagens no array
  if (!images.length) {
    return (
      <div className="border-border/60 bg-muted/20 flex aspect-square w-full flex-col items-center justify-center rounded-2xl border border-dashed">
        <ImageOff className="text-muted-foreground/40 h-12 w-12" />
        <p className="text-muted-foreground/60 mt-2 text-sm">Sem fotos</p>
      </div>
    );
  }

  // Imagem atual baseada no índice selecionado
  const currentImage = images[selectedIndex]?.url;

  return (
    <div className="flex flex-col gap-4">
      {/* IMAGEM PRINCIPAL */}
      <div className="border-border/40 bg-muted/10 relative aspect-square w-full overflow-hidden rounded-2xl border">
        {currentImage && !imgError ? (
          <Image
            src={currentImage}
            alt="Foto do produto"
            fill
            priority
            className="object-cover transition-all duration-500 hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="bg-secondary/30 text-muted-foreground flex h-full w-full flex-col items-center justify-center">
            <ImageOff className="h-10 w-10 opacity-40" />
            <span className="mt-2 text-xs font-medium uppercase">
              Imagem Indisponível
            </span>
          </div>
        )}
      </div>

      {/* CARROSSEL DE MINIATURAS */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          {images.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  setImgError(false); // Reset do erro para tentar carregar a nova imagem
                }}
                className={cn(
                  "relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  isSelected
                    ? "border-primary ring-primary/20 ring-2"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={img.url}
                  alt={`Miniatura ${idx}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  // Se a miniatura falhar, apenas esconde o botão daquela thumb específica
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
