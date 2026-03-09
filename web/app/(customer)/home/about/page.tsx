"use client";

import Image from "next/image";
import Link from "next/link";
import { GridBackground } from "@/components/ui/grid-background";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  MessageCircle,
  ShoppingBag,
  Palette,
  Wallet,
  ArrowRight,
  HelpCircle,
  Scissors,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="selection:bg-primary/30 relative min-h-screen overflow-hidden pb-20">
      {/* Background Base */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Luzes de Fundo (Glow) responsivas com medidas absolutas do Tailwind */}
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-0 -z-10 h-75 w-full max-w-2xl -translate-x-1/4 -translate-y-1/4 rounded-full blur-[100px] sm:h-125 sm:max-w-3xl sm:blur-[120px]" />
      <div className="bg-primary/5 pointer-events-none absolute right-0 bottom-0 -z-10 h-62.5 w-full max-w-xl translate-x-1/4 translate-y-1/4 rounded-full blur-[80px] sm:h-100 sm:max-w-2xl sm:blur-[100px]" />

      <main className="relative z-10 container mx-auto px-4 pt-12 md:pt-20">
        {/* =========================================
            1. CABEÇALHO DA PÁGINA
        ========================================= */}
        <header className="animate-in fade-in slide-in-from-top-6 mb-16 flex flex-col items-center text-center duration-1000 md:mb-24">
          <div className="border-primary/20 bg-background/50 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md sm:text-xs">
            <Scissors className="h-3.5 w-3.5" />
            <span>Arte em Crochê</span>
          </div>

          <h1 className="text-foreground mb-4 text-4xl font-extrabold tracking-tight text-balance sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            Mais que uma loja,
            <br className="hidden md:block" /> a materialização das suas ideias.
          </h1>

          <p className="text-muted-foreground max-w-2xl px-2 text-sm leading-relaxed text-balance sm:text-base md:text-lg">
            Na Croche da T, nós não temos prateleiras cheias de produtos iguais.
            Nosso foco é criar peças únicas, com identidade e sob medida para a
            sua necessidade.
          </p>
        </header>

        {/* =========================================
            2. A MARCA E A CRIADORA (Grid Dividido e Responsivo)
        ========================================= */}
        <section className="animate-in fade-in mb-16 grid gap-6 delay-150 duration-1000 sm:mb-20 sm:gap-8 md:mb-32 md:gap-12 lg:grid-cols-2 lg:items-stretch">
          {/* Card da Essência */}
          <div className="group border-border/40 bg-card/20 hover:bg-card/30 relative flex flex-col overflow-hidden rounded-4xl border p-5 backdrop-blur-sm transition-colors sm:p-6 md:p-8">
            {/* Imagem do Cloudinary: Essência/Local/Peça */}
            <div className="border-border/20 bg-muted/30 relative mb-6 aspect-video w-full overflow-hidden rounded-xl border">
              <Image
                src="https://res.cloudinary.com/derzus8uh/image/upload/v1772774590/about_ehwbtn.jpg" // 🔴 COLOQUE SUA URL AQUI
                alt="Essência da Croche da T"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
              Croche da T
            </h2>
            <p className="text-muted-foreground flex-1 text-sm leading-relaxed sm:text-base">
              Tudo começou com a vontade de transformar fios em arte.
              Acreditamos que cada peça deve ter personalidade própria, fugindo
              do padrão industrial. Trabalhamos com cuidado em cada detalhe, do
              primeiro rascunho até o acabamento final.
            </p>
          </div>

          {/* Card da Thayssa */}
          <div className="group border-border/40 bg-card/20 hover:bg-card/30 relative flex flex-col overflow-hidden rounded-4xl border p-5 backdrop-blur-sm transition-colors sm:p-6 md:p-8">
            <div className="mb-6 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
              {/* Imagem do Cloudinary: Foto da Thayssa */}
              <div className="border-primary/20 bg-muted/30 relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 shadow-md sm:h-32 sm:w-32">
                <Image
                  src="https://res.cloudinary.com/derzus8uh/image/upload/v1754094984/babado1_y72wen.jpg" // 🔴 COLOQUE SUA URL AQUI
                  alt="Foto da Thayssa Santos Lima"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 96px, 128px"
                />
              </div>
              <div className="mt-2 text-center sm:mt-0 sm:text-left">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Thayssa Santos Lima
                </h2>
                <p className="text-primary mt-1 text-xs font-medium sm:text-sm">
                  Quem dá vida às ideias
                </p>
              </div>
            </div>
            <p className="text-muted-foreground flex-1 text-center text-sm leading-relaxed sm:text-left sm:text-base">
              Sou apaixonada por materializar ideias através do crochê. Cada
              pedido que recebo na Croche da T é tratado de forma exclusiva. Meu
              objetivo é garantir que você receba algo que foi pensado e
              executado com máxima dedicação.
            </p>
          </div>
        </section>

        {/* =========================================
            3. COMO FUNCIONA (O Fluxo de Encomenda)
        ========================================= */}
        <section className="animate-in fade-in slide-in-from-bottom-8 mb-20 delay-300 duration-700 md:mb-32">
          <div className="mb-10 px-4 text-center sm:mb-12">
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight sm:mb-4 sm:text-3xl md:text-4xl">
              Como funciona nossa produção?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm text-balance sm:text-base">
              Nossa vitrine é só o ponto de partida. O seu pedido não é
              processado por robôs, mas sim de forma direta e pessoal com a
              Thayssa.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-4">
            {/* Passo 1 */}
            <div className="bg-background/40 border-border/50 hover:shadow-primary/5 relative flex flex-col items-center rounded-3xl border p-5 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-2 text-base font-bold sm:text-lg">
                1. Seleção
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Navegue pelas categorias, veja as opções disponíveis e adicione
                suas escolhas ao carrinho.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="bg-background/40 border-border/50 hover:shadow-primary/5 relative flex flex-col items-center rounded-3xl border p-5 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-2 text-base font-bold sm:text-lg">
                2. Conexão
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Ao fechar o pedido, nada é cobrado. Nós abrimos um canal de
                atendimento exclusivo com você.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="bg-background/40 border-border/50 hover:shadow-primary/5 relative flex flex-col items-center rounded-3xl border p-5 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12">
                <Palette className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-2 text-base font-bold sm:text-lg">
                3. Personalização
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                No chat, ajustamos os detalhes finais. Cor, tamanho e alterações
                específicas são combinadas aqui.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="bg-background/40 border-border/50 hover:shadow-primary/5 relative flex flex-col items-center rounded-3xl border p-5 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-2 text-base font-bold sm:text-lg">
                4. Confirmação
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Com tudo definido, o pagamento é feito em duas partes: 50% para
                iniciarmos a produção e 50% na hora da entrega.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            4. PEDIDOS EXCLUSIVOS E REDES SOCIAIS
        ========================================= */}
        <section className="bg-card/30 border-border/40 animate-in fade-in zoom-in-95 mx-auto w-full max-w-4xl rounded-4xl border p-6 text-center shadow-2xl backdrop-blur-xl delay-500 duration-700 sm:rounded-[2.5rem] sm:p-8 md:p-12">
          <HelpCircle className="text-primary/50 mx-auto mb-4 h-10 w-10 sm:mb-6 sm:h-12 sm:w-12" />
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight sm:mb-4 sm:text-3xl md:text-4xl">
            Quer algo fora do catálogo?
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl px-2 text-sm text-balance sm:mb-8 sm:text-base md:text-lg">
            Tem uma ideia específica de crochê em mente que não encontrou na
            vitrine? Nós topamos o desafio! Abra um chamado de suporte ou nos
            mande uma mensagem direta nas redes sociais.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 px-2 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-full px-6 text-sm font-bold shadow-md sm:h-14 sm:w-auto sm:px-8 sm:text-base"
            >
              <Link href="/home/chats">
                Iniciar Orçamento
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>

            {/* Links Ativos apontando para as plataformas reais */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-background/50 h-12 w-full rounded-full px-6 text-sm font-bold backdrop-blur-md sm:h-14 sm:w-auto sm:px-8 sm:text-base"
            >
              <a
                href="https://www.instagram.com/croche.dat/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="mr-2 h-4 w-4 text-pink-500 sm:h-5 sm:w-5" />
                Instagram
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-background/50 h-12 w-full rounded-full px-6 text-sm font-bold backdrop-blur-md sm:h-14 sm:w-auto sm:px-8 sm:text-base"
            >
              <a
                href="https://www.tiktok.com/@croche.dat?_r=1&_t=ZS-94WtWEHgPHJ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  className="sm:h-5 sm:w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                TikTok
              </a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
