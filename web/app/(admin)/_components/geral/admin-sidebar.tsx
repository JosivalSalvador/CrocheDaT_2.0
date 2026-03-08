"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Users,
  MessageCircle,
  User,
  LogOut,
  Loader2,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

// Hooks da arquitetura
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-users";

// Ícone Customizado
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

const navItems = [
  { title: "Catálogo", href: "/dashboard/products", icon: Package },
  { title: "Clientes", href: "/dashboard/users", icon: Users },
  { title: "Atendimento", href: "/dashboard/chats", icon: MessageCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { data: profileResponse, isLoading: isProfileLoading } = useProfile();

  const user = profileResponse?.user;

  const [isCollapsed, setIsCollapsed] = useState(false);

  const isIndividualChatPage =
    pathname.startsWith("/dashboard/chats/") && pathname.split("/").length > 3;

  if (isIndividualChatPage) {
    return null;
  }

  // ==============================================================
  // RENDERIZADOR REUTILIZÁVEL: Itens do Menu
  // ==============================================================
  const renderNavItems = (collapsed: boolean, isMobile: boolean = false) => (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <div
            key={item.href}
            className={`group relative ${collapsed && !isMobile ? "flex justify-center" : ""}`}
          >
            <Button
              variant={isActive ? "secondary" : "ghost"}
              asChild
              className={`rounded-xl transition-all ${
                collapsed && !isMobile
                  ? "h-11 w-11 justify-center p-0"
                  : "h-11 w-full justify-start px-4"
              } ${isActive ? "text-foreground bg-secondary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"}`}
            >
              <Link href={item.href}>
                <Icon
                  className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : ""} ${collapsed && !isMobile ? "" : "mr-3"}`}
                />
                {(!collapsed || isMobile) && (
                  <span className="truncate">{item.title}</span>
                )}
              </Link>
            </Button>

            {/* Tooltip super ajustado e com z-index alto */}
            {collapsed && !isMobile && (
              <div className="bg-foreground border-border text-background pointer-events-none absolute top-1/2 left-[calc(100%+15px)] z-100 -translate-y-1/2 rounded-md border px-3 py-1.5 text-xs font-semibold whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {item.title}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  // ==============================================================
  // RENDERIZADOR REUTILIZÁVEL: Perfil e Logout
  // ==============================================================
  const renderProfile = (collapsed: boolean, isMobile: boolean = false) => (
    <div className="border-border/40 flex justify-center border-t p-4">
      {isProfileLoading ? (
        <div
          className={`flex items-center gap-3 ${collapsed && !isMobile ? "justify-center" : "w-full"}`}
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          {(!collapsed || isMobile) && (
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          )}
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`hover:bg-accent focus-visible:ring-primary rounded-xl transition-colors focus-visible:ring-1 ${
                collapsed && !isMobile
                  ? "h-11 w-11 justify-center p-0"
                  : "flex h-auto w-full justify-start p-3"
              }`}
            >
              <div className="flex w-full items-center justify-center">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <User className="h-5 w-5" />
                </div>
                {(!collapsed || isMobile) && (
                  <div className="ml-3 flex min-w-0 flex-1 flex-col items-start">
                    <span className="w-full truncate text-left text-sm font-bold">
                      {user?.name || "Administrador"}
                    </span>
                    <span className="text-muted-foreground w-full truncate text-left text-xs">
                      {user?.email || "Carregando..."}
                    </span>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={collapsed && !isMobile ? "right" : "top"}
            align={collapsed && !isMobile ? "end" : "center"}
            sideOffset={collapsed && !isMobile ? 40 : 20}
            // 👇 AQUI ESTAVA O PROBLEMA: Adicionado bg-background e z-50
            className="border-border bg-background text-foreground z-50 mb-2 w-56 rounded-2xl border p-2 shadow-xl"
          >
            <DropdownMenuItem
              asChild
              className="focus:bg-primary/10 cursor-pointer rounded-xl"
            >
              <Link
                href="/dashboard/profile"
                className="flex w-full items-center"
              >
                <User className="mr-2 h-4 w-4" /> Ver Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/40 my-1" />
            <DropdownMenuItem
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-xl"
            >
              {logout.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  return (
    <>
      {/* =========================================
          📱 VERSÃO MOBILE (Botão Flutuante + Sheet Lateral)
      ========================================= */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-border bg-background/80 text-foreground hover:bg-accent focus:ring-primary h-10 w-10 rounded-full border shadow-md backdrop-blur-sm focus:ring-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="border-r/40 bg-background flex w-70 max-w-[65vw] flex-col p-0 shadow-2xl [&>button]:hidden"
          >
            <SheetHeader className="hidden border-b p-6 text-left">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <IconCrochet className="text-primary h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Crochê da T
                </span>
              </div>

              <SheetClose asChild>
                <button className="border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground focus:ring-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all focus:ring-2 focus:outline-none">
                  <Menu className="h-4 w-4" />
                </button>
              </SheetClose>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {renderNavItems(false, true)}
            </div>
            {renderProfile(false, true)}
          </SheetContent>
        </Sheet>
      </div>

      {/* =========================================
          💻 VERSÃO DESKTOP (Sidebar Automática e Retrátil)
      ========================================= */}
      <aside
        // 👇 Forcei larguras exatas (w-[80px]) para garantir que o retraído fique perfeito
        className={`bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 left-0 z-40 hidden h-screen shrink-0 flex-col border-r backdrop-blur-md transition-[width] duration-300 ease-in-out md:flex ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className={`flex h-16 items-center border-b transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "justify-between px-4"}`}
        >
          {!isCollapsed && (
            <Link
              href="/dashboard"
              className="flex w-full items-center gap-2 overflow-hidden transition-opacity hover:opacity-80"
            >
              <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <IconCrochet className="text-primary h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight whitespace-nowrap">
                Crochê da T
              </span>
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground focus:ring-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all focus:ring-2 focus:outline-none ${isCollapsed ? "mx-auto" : ""}`}
            title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto px-3 py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {renderNavItems(isCollapsed)}
        </div>

        {renderProfile(isCollapsed)}
      </aside>
    </>
  );
}
