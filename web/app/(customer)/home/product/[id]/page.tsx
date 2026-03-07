"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/use-products";
import { GridBackground } from "@/components/ui/grid-background";
import { ProductGallery } from "@/app/(customer)/_components/product-gallery";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  AlertCircle,
  Layers,
  Hourglass,
  Loader2, // 👈 Ícone de loading adicionado
} from "lucide-react";

// 👈 Importando a mutation do carrinho
import { useCartMutations } from "@/hooks/use-cart";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, isError } = useProduct(id);
  const product = data?.product;

  // 👈 Instanciando a action do carrinho
  const { addItem } = useCartMutations();

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product?.price || 0);

  // =========================================
  // LÓGICA DE AÇÕES DO USUÁRIO LOGADO
  // =========================================

  // Ação de adicionar ao carrinho
  const handleAddToCart = () => {
    if (!product?.id) return;
    addItem.mutate({ productId: product.id, quantity: 1 });
  };

  // Ação de ir para o chat
  const handleChat = () => {
    router.push("/home/chats");
  };

  // =========================================
  // TRATAMENTO DE ERRO OU PRODUTO INEXISTENTE
  // =========================================
  if (isError || (!isLoading && !product)) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center px-4">
        <GridBackground />
        <div className="animate-in fade-in zoom-in-95 relative z-10 flex max-w-md flex-col items-center text-center duration-500">
          <AlertCircle className="text-destructive h-12 w-12 opacity-50" />
          <h2 className="mt-4 text-xl font-bold tracking-tight">
            Obra não encontrada
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Esta peça pode ter sido removida do acervo ou o link está incorreto.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="mt-8 rounded-full px-8"
            variant="outline"
          >
            Voltar para a galeria
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="selection:bg-primary/20 relative min-h-screen pb-36 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* =========================================
          BARRA DE AÇÃO FIXA MOBILE 
      ========================================= */}
      {!isLoading && product && (
        <div className="animate-in slide-in-from-bottom-full border-border/40 bg-background/90 fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t px-4 pt-4 pb-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl lg:hidden">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Investimento
            </span>
            <span className="text-primary text-2xl font-extrabold">
              {formattedPrice}
            </span>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={addItem.isPending}
            className="shadow-primary/25 h-12 rounded-full px-8 font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-70"
          >
            {addItem.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Adicionar"
            )}
          </Button>
        </div>
      )}

      <main className="relative z-10 container mx-auto max-w-7xl px-4 pt-6 md:pt-12">
        {/* Navegação Voltar - Desktop (lg) */}
        <button
          onClick={() => router.back()}
          className="group text-muted-foreground hover:text-primary mb-10 hidden items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors lg:inline-flex"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
          Voltar ao Acervo
        </button>

        <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-16 xl:gap-20">
          {/* =========================================
              COLUNA ESQUERDA: GALERIA 
          ========================================= */}
          <div className="animate-in fade-in slide-in-from-bottom-4 w-full duration-700 lg:sticky lg:top-24 lg:w-[55%] xl:w-[60%]">
            {isLoading ? (
              <Skeleton className="bg-muted/30 aspect-square w-full rounded-4xl" />
            ) : (
              <ProductGallery images={product?.images} />
            )}
          </div>

          {/* =========================================
              COLUNA DIREITA: INFORMAÇÕES E COMPRA
          ========================================= */}
          <div className="animate-in fade-in slide-in-from-bottom-8 flex w-full flex-col delay-150 duration-700 lg:w-[45%] xl:w-[40%]">
            {isLoading ? (
              <div className="mt-4 space-y-8">
                <Skeleton className="bg-muted/30 h-8 w-3/4 rounded-lg" />
                <Skeleton className="bg-muted/30 h-10 w-1/3 rounded-lg" />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Skeleton className="bg-muted/30 h-24 w-full rounded-3xl" />
                  <Skeleton className="bg-muted/30 h-24 w-full rounded-3xl" />
                </div>
                <div className="space-y-3 pt-6">
                  <Skeleton className="bg-muted/30 h-4 w-full rounded-md" />
                  <Skeleton className="bg-muted/30 h-4 w-full rounded-md" />
                  <Skeleton className="bg-muted/30 h-4 w-3/4 rounded-md" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:pt-4">
                {/* CABEÇALHO DA OBRA */}
                <div className="mb-8">
                  {/* CATEGORIA DESTACADA */}
                  <div className="mb-5">
                    <span className="bg-primary/10 text-primary inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase">
                      {product?.category?.name || "Design Autoral"}
                    </span>
                  </div>

                  <h1 className="text-foreground text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-5xl xl:text-6xl">
                    {product?.name}
                  </h1>

                  {/* PREÇO DESKTOP */}
                  <div className="mt-8 hidden lg:block">
                    <p className="text-primary text-4xl font-extrabold tracking-tight drop-shadow-sm xl:text-5xl">
                      {formattedPrice}
                    </p>
                  </div>
                </div>

                {/* FICHA TÉCNICA - Cards com Ícones Estilizados */}
                <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {/* Card: Material */}
                  <div className="group bg-secondary/30 border-border/50 hover:bg-secondary/60 hover:border-primary/20 flex flex-col gap-3 rounded-3xl border p-5 transition-all">
                    <div className="bg-background/80 border-border/50 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-110">
                      <Layers
                        className="text-primary h-4 w-4"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground mb-1 block text-[10px] font-bold tracking-widest uppercase">
                        Material da Obra
                      </span>
                      <span className="text-foreground block text-sm leading-tight font-semibold sm:text-base">
                        {product?.material}
                      </span>
                    </div>
                  </div>

                  {/* Card: Prazo */}
                  <div className="group bg-secondary/30 border-border/50 hover:bg-secondary/60 hover:border-primary/20 flex flex-col gap-3 rounded-3xl border p-5 transition-all">
                    <div className="bg-background/80 border-border/50 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-110">
                      <Hourglass
                        className="text-primary h-4 w-4"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground mb-1 block text-[10px] font-bold tracking-widest uppercase">
                        Tempo de Produção
                      </span>
                      <span className="text-foreground block text-sm leading-tight font-semibold sm:text-base">
                        {product?.productionTime} dias úteis
                      </span>
                    </div>
                  </div>
                </div>

                {/* DESCRIÇÃO DA OBRA - Ajuste de Unidade Visual */}
                <div className="bg-secondary/30 border-border/50 hover:bg-secondary/40 mb-8 rounded-3xl border p-5 transition-colors sm:p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="bg-primary h-4 w-1 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.2)]"></div>
                    <h3 className="text-primary text-[10px] leading-none font-black tracking-[0.2em] uppercase">
                      Detalhes da Obra
                    </h3>
                  </div>

                  <p className="text-foreground/90 text-sm leading-relaxed font-medium sm:text-[15px] md:text-base">
                    {product?.description}
                  </p>
                </div>

                {/* BOTÕES DE AÇÃO DESKTOP */}
                <div className="hidden flex-col gap-4 lg:flex">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={addItem.isPending}
                    className="shadow-primary/20 h-14 w-full rounded-full text-base font-bold shadow-xl transition-transform active:scale-95 disabled:opacity-70"
                  >
                    {addItem.isPending ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <ShoppingBag className="mr-2 h-5 w-5" />
                    )}
                    {addItem.isPending
                      ? "Adicionando..."
                      : "Adicionar ao Carrinho"}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleChat}
                    className="border-border/60 hover:bg-secondary/40 h-14 w-full rounded-full text-base font-semibold transition-transform active:scale-95"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Consultar o Artesão
                  </Button>
                </div>

                {/* BOTÃO SECUNDÁRIO NO MOBILE/TABLET */}
                <div className="mt-2 lg:hidden">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleChat}
                    className="border-border/60 hover:bg-secondary/40 h-14 w-full rounded-full text-sm font-semibold transition-transform active:scale-95"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Dúvidas? Fale com o Artesão
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
