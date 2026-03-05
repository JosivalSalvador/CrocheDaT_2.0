"use client";

import Link from "next/link";
import { Menu, LogIn, UserPlus, Home, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

// Ícone Customizado e Profissional: Novelo de lã com Agulha de Crochê e fio solto
const IconCrochet = ({ className }: { className?: string }) => (
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
    {/* Corpo do novelo */}
    <circle cx="10" cy="14" r="7" />
    {/* Fios desenhados dentro do novelo */}
    <path d="M5 11.5a5 5 0 0 1 8 6" />
    <path d="M11 8.5a5 5 0 0 1 5 6" />
    {/* Agulha espetada na diagonal */}
    <line x1="20" y1="4" x2="6" y2="18" />
    {/* Gancho da agulha de crochê na ponta */}
    <path d="M20 4l1.5-1.5a1 1 0 0 1 1 1.5L21 5.5" />
    {/* Fio de lã solto puxado para a direita */}
    <path d="M14 19.5c3 0 4 2.5 8 2.5" />
  </svg>
);

export function Header() {
  return (
    <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* =========================================
            1. ESQUERDA: LOGO
        ========================================= */}
        <div className="flex flex-1 justify-start">
          <Link
            href="/"
            className="group flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="bg-primary/10 group-hover:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
              <IconCrochet className="text-primary h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight sm:text-xl">
              Crochê da T
            </span>
          </Link>
        </div>

        {/* =========================================
            2. CENTRO: NAVEGAÇÃO DESKTOP
        ========================================= */}
        <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground after:bg-primary relative pb-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Início
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground after:bg-primary relative pb-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Sobre a Loja
          </Link>
        </nav>

        {/* =========================================
            3. DIREITA: AÇÕES E MENU MOBILE
        ========================================= */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {/* ---- Botões Desktop ---- */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-9 rounded-xl px-4 font-medium"
            >
              <Link href="/login">Entrar</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="h-9 rounded-xl px-4 font-medium shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <Link href="/register">Criar Conta</Link>
            </Button>
          </div>

          {/* ---- Menu Mobile (Hambúrguer) ---- */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[85vw] max-w-[320px] flex-col p-0"
            >
              {/* Cabeçalho do Menu Mobile (com padding ajustado para o botão X) */}
              <SheetHeader className="border-b p-6 pb-4 text-left">
                <SheetTitle className="mt-2 flex items-center gap-2">
                  <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-md">
                    <IconCrochet className="text-primary h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold">Crochê da T</span>
                </SheetTitle>
              </SheetHeader>

              {/* Corpo do Menu: Navegação (com scroll se a tela for minúscula) */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <nav className="flex flex-col gap-3">
                  <Button
                    variant="ghost"
                    asChild
                    className="hover:bg-muted/60 h-12 w-full justify-start rounded-xl text-base font-medium"
                  >
                    <Link href="/">
                      <Home className="text-muted-foreground mr-3 h-5 w-5" />
                      Início
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="hover:bg-muted/60 h-12 w-full justify-start rounded-xl text-base font-medium"
                  >
                    <Link href="/about">
                      <Info className="text-muted-foreground mr-3 h-5 w-5" />
                      Sobre a Loja
                    </Link>
                  </Button>
                </nav>
              </div>

              {/* Rodapé do Menu: Ações (Sempre fixos na base, espaçados e desgrudados da borda) */}
              <div className="bg-muted/20 mt-auto border-t p-6">
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    asChild
                    className="bg-background h-12 w-full justify-center rounded-xl"
                  >
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" /> Entrar
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="h-12 w-full justify-center rounded-xl shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    <Link href="/register">
                      <UserPlus className="mr-2 h-4 w-4" /> Criar Conta
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
