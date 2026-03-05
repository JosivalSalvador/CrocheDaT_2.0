import Link from "next/link";
import { GridBackground } from "@/components/ui/grid-background";
import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      {/* O mesmo background elegante com os glows pink */}
      <GridBackground />

      <div className="animate-in fade-in zoom-in-95 relative z-10 flex min-h-screen flex-col items-center justify-center px-6 duration-700">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-primary text-8xl font-extrabold tracking-tight opacity-80 sm:text-9xl">
            404
          </h1>

          <h2 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Página não encontrada.
          </h2>

          <p className="text-muted-foreground mx-auto mt-4 text-base leading-relaxed sm:text-lg">
            Parece que você procurou por uma peça que não está no nosso
            catálogo. O link pode estar quebrado ou a página foi movida.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Botão principal reaproveitando o seu estilo exato */}
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl px-10 text-base font-semibold transition-all hover:scale-105"
            >
              <Link href="/">Voltar para a vitrine</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
