import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GridBackground } from "@/components/ui/grid-background";
import { Button } from "@/components/ui/button";

export default async function RootPage() {
  // 1. Checagem de Sessão no Servidor (BFF)
  const session = await getSession();

  // 2. Redirecionamento inteligente baseado no que definimos no Prisma e no Proxy
  if (session) {
    const dashboardUrl = session.user.role === "ADMIN" ? "/dashboard" : "/home";
    redirect(dashboardUrl);
  }

  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      {/* Background que você definiu nos seus componentes de UI */}
      <GridBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* HEADER */}
        <header className="bg-background/80 border-b backdrop-blur">
          <div className="flex items-center px-6 py-5 lg:px-12">
            <span className="text-primary text-lg font-bold tracking-tight md:text-xl">
              Crochê da T
            </span>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
            <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
              {/* ÁREA DE TEXTO */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl leading-tight font-bold sm:text-5xl md:text-6xl">
                  Peças artesanais <br />
                  <span className="text-primary">feitas à mão</span>
                </h1>

                <p className="text-muted-foreground mx-auto mt-6 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0">
                  Descubra o cuidado em cada ponto. Gerencie suas encomendas e
                  explore coleções exclusivas com a qualidade Crochê da T.
                </p>

                {/* CALL TO ACTION - BOTÕES */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-xl px-10 text-base font-semibold transition-all hover:scale-105"
                  >
                    <Link href="/login">Entrar no Sistema</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="hover:bg-muted h-12 rounded-xl px-10 text-base font-medium transition-all"
                  >
                    <Link href="/register">Criar minha conta</Link>
                  </Button>
                </div>

                <p className="text-muted-foreground mt-5 text-xs italic">
                  Acesso exclusivo para clientes e administradores.
                </p>
              </div>

              {/* PREVIEW/VISUAL (MOCKUP) */}
              <div className="mx-auto w-full max-w-md lg:max-w-none">
                <div className="bg-card/50 rounded-3xl border p-6 shadow-2xl backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Aqui entrarão os cards de produtos reais no futuro */}
                    <div className="bg-muted aspect-square animate-pulse rounded-2xl" />
                    <div className="bg-muted aspect-square animate-pulse rounded-2xl" />
                    <div className="bg-muted aspect-square animate-pulse rounded-2xl" />
                    <div className="bg-muted aspect-square animate-pulse rounded-2xl" />
                  </div>

                  <div className="bg-primary/10 border-primary/20 mt-6 flex h-12 items-center rounded-xl border px-4">
                    <div className="bg-primary/40 h-2 w-full rounded-full" />
                  </div>
                  <div className="bg-muted mt-3 h-5 w-32 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-muted-foreground bg-background/50 border-t py-6 text-center text-xs backdrop-blur-sm">
          &copy; {new Date().getFullYear()} Crochê da T — Todos os direitos
          reservados.
        </footer>
      </div>
    </main>
  );
}
