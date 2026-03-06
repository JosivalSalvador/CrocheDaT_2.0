"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  ShoppingBag,
  User,
  MessageCircle,
  LogOut,
  Store,
  Loader2,
  PackageSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks e Tipos que você forneceu
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { CartItemResponse } from "@/types/index";

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
    <circle cx="10" cy="14" r="7" />
    <path d="M5 11.5a5 5 0 0 1 8 6" />
    <path d="M11 8.5a5 5 0 0 1 5 6" />
    <line x1="20" y1="4" x2="6" y2="18" />
    <path d="M20 4l1.5-1.5a1 1 0 0 1 1 1.5L21 5.5" />
    <path d="M14 19.5c3 0 4 2.5 8 2.5" />
  </svg>
);

export function CustomerHeader() {
  const { logout } = useAuth();
  const { data: cartData, isLoading: isCartLoading } = useCart();

  // De acordo com seu erro e schemas: o objeto retornado tem a chave 'cart'
  // cartData é { cart: { items: [...], ... } } ou null
  const cartItems: CartItemResponse[] = cartData?.cart?.items || [];
  const totalItems = cartItems.length;

  return (
    <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="relative container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* 1. LOGO */}
        <div className="flex">
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
            <span className="bg-secondary text-muted-foreground ml-2 hidden rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase sm:inline-flex">
              Cliente
            </span>
          </Link>
        </div>

        {/* 2. NAVEGAÇÃO DESKTOP */}
        <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <Store className="h-4 w-4" /> Vitrine
          </Link>
          <Link
            href="/home/chats"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Meus Chats
          </Link>
        </nav>

        {/* 3. DIREITA: AÇÕES */}
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted/60 relative rounded-full transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="bg-primary text-primary-foreground animate-in zoom-in absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent className="flex w-[85vw] flex-col p-0 shadow-2xl sm:max-w-md">
              <SheetHeader className="border-b p-6 text-left">
                <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                  <ShoppingBag className="text-primary h-5 w-5" />
                  Sua Seleção ({totalItems})
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6">
                {isCartLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="text-primary/20 h-8 w-8 animate-spin" />
                  </div>
                ) : totalItems > 0 ? (
                  <div className="space-y-6">
                    {cartItems.map((item: CartItemResponse) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <PackageSearch className="text-muted-foreground/40 h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <h4 className="truncate text-sm font-bold">
                            {item.name}
                          </h4>
                          <p className="text-muted-foreground text-xs">
                            Qtd: {item.quantity}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
                    <ShoppingBag className="text-muted-foreground/40 mb-4 h-12 w-12" />
                    <p className="text-sm font-medium">
                      Seu carrinho está vazio.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-card/50 border-t p-6 backdrop-blur-md">
                <Button
                  asChild
                  size="lg"
                  className="h-14 w-full rounded-xl text-base font-bold shadow-xl"
                  disabled={totalItems === 0}
                >
                  <Link href="/home/cart">Revisar e Encomendar</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border-border/40 bg-card/30 rounded-full border"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl p-2 shadow-xl"
            >
              <DropdownMenuItem
                asChild
                className="focus:bg-primary/10 cursor-pointer rounded-xl"
              >
                <Link href="/home/chats" className="flex w-full items-center">
                  <MessageCircle className="mr-2 h-4 w-4" /> Meus Chats
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="focus:bg-primary/10 cursor-pointer rounded-xl"
              >
                <Link href="/home/profile" className="flex w-full items-center">
                  <User className="mr-2 h-4 w-4" /> Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="text-destructive focus:bg-destructive/10 cursor-pointer rounded-xl"
              >
                {logout.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1 md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[70vw] flex-col p-0">
              <SheetHeader className="border-b p-6 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <IconCrochet className="text-primary h-5 w-5" />
                  <span className="text-lg font-bold">Crochê da T</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 p-4">
                <nav className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    asChild
                    className="h-12 w-full justify-start rounded-xl text-base"
                  >
                    <Link href="/">
                      <Store className="text-muted-foreground mr-3 h-5 w-5" />{" "}
                      Vitrine
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="h-12 w-full justify-start rounded-xl text-base"
                  >
                    <Link href="/home/chats">
                      <MessageCircle className="text-muted-foreground mr-3 h-5 w-5" />{" "}
                      Meus Chats
                    </Link>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
