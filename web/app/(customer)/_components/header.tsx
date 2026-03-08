"use client";

import Link from "next/link";
import {
  Menu,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";

// 👇 Importando o nosso novo e maravilhoso CartSheet
import { CartSheet } from "./card";

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

export function HeaderCustomer() {
  const pathname = usePathname();
  const { data: profileData } = useProfile();
  const { logout } = useAuth();

  const user = profileData?.user;
  const isIndividualChatPage =
    pathname.startsWith("/home/chats/") && pathname.split("/").length > 3;

  if (isIndividualChatPage) {
    return null; // Oculta o header inteiro se estiver no chat
  }

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="relative container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex">
          <Link
            href="/home"
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

        <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/home"
            className="text-muted-foreground hover:text-foreground after:bg-primary relative pb-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Vitrine
          </Link>
          <Link
            href="/home/about"
            className="text-muted-foreground hover:text-foreground after:bg-primary relative pb-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Sobre a Loja
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-2 md:gap-4">
          {/* =========================================
              CARRINHO OFICIAL INJETADO AQUI!
          ========================================= */}
          <CartSheet />

          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="bg-background z-50 w-56 border shadow-md"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {user?.name || "Carregando..."}
                    </p>
                    <p className="text-muted-foreground truncate text-xs leading-none">
                      {user?.email || "..."}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className="hover:bg-muted cursor-pointer"
                >
                  <Link href="/home/chats">
                    <MessageSquare className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Meus Chats</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-muted cursor-pointer"
                >
                  <Link href="/home/profile">
                    <Settings className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer data-disabled:opacity-50"
                >
                  {logout.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  <span>Sair da conta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-background flex w-[65vw] flex-col p-0 sm:max-w-xs"
            >
              <SheetHeader className="border-b p-6 pb-4 text-left">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>

                <div className="mt-2 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="w-40 truncate text-sm font-bold">
                      {user?.name || "Usuário"}
                    </span>
                    <span className="text-muted-foreground w-40 truncate text-xs">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <nav className="flex flex-col gap-3">
                  <Button
                    variant="ghost"
                    asChild
                    className="hover:bg-muted/60 h-12 w-full justify-start rounded-xl text-base font-medium"
                  >
                    <Link href="/home">
                      <Home className="text-muted-foreground mr-3 h-5 w-5" />{" "}
                      Vitrine
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    asChild
                    className="hover:bg-muted/60 h-12 w-full justify-start rounded-xl text-base font-medium"
                  >
                    <Link href="/home/about">
                      <Info className="text-muted-foreground mr-3 h-5 w-5" />{" "}
                      Sobre a Loja
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    asChild
                    className="hover:bg-muted/60 h-12 w-full justify-start rounded-xl text-base font-medium"
                  >
                    <Link href="/home/chats">
                      <MessageSquare className="text-muted-foreground mr-3 h-5 w-5" />{" "}
                      Meus Chats
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="hover:bg-muted/60 h-12 w-full justify-start rounded-xl text-base font-medium"
                  >
                    <Link href="/home/profile">
                      <Settings className="text-muted-foreground mr-3 h-5 w-5" />{" "}
                      Meu Perfil
                    </Link>
                  </Button>
                </nav>
              </div>

              <div className="bg-muted/20 mt-auto border-t p-6">
                <Button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-12 w-full justify-center rounded-xl"
                >
                  {logout.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Sair da conta
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
