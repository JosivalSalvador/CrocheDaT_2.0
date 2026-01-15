"use client"; // Necessário agora porque temos interatividade (mouse)
import { GridBackground } from "@/components/ui/grid-background";
import { Spotlight } from "@/components/ui/spotlight";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* O Grid fica no fundo */}
      <div className="absolute inset-0">
        <GridBackground />
      </div>

      {/* Área interativa com o Spotlight */}
      <div className="relative z-10 mx-auto max-w-lg rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
        <Spotlight
          className="-top-40 -left-40 md:-top-20 md:-left-20"
          fill="white"
        />

        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Base Ativada.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
          Passe o mouse aqui. O efeito de luz confirma que o Framer Motion e o
          Tailwind estão sincronizados.
        </p>
      </div>
    </main>
  );
}
