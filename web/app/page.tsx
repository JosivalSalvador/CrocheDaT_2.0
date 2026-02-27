import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GridBackground } from "@/components/ui/grid-background";
import { Button } from "@/components/ui/button";

export default async function RootPage() {
  const session = await getSession();

  if (session) {
    redirect(session.user.role === "ADMIN" ? "/admin/dashboard" : "/home");
  }

  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      <GridBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* HEADER LIMPO */}

        <header className="bg-background/80 border-b backdrop-blur">
          <div className="flex items-center px-6 py-5 lg:px-12">
            <span className="text-lg font-semibold tracking-tight md:text-xl">
              Crochê da T
            </span>
          </div>
        </header>

        {/* HERO */}

        <section className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
            <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
              {/* TEXTO */}

              <div className="text-center lg:text-left">
                <h1 className="text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
                  Peças artesanais feitas à mão
                </h1>

                <p className="text-muted-foreground mx-auto mt-6 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0">
                  Descubra peças únicas de crochê feitas com cuidado, qualidade
                  e atenção aos detalhes.
                </p>

                {/* BOTÕES PRINCIPAIS */}

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-xl px-10 text-base font-medium"
                  >
                    <Link href="/login">Entrar</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-xl px-10 text-base font-medium"
                  >
                    <Link href="/register">Criar conta</Link>
                  </Button>
                </div>

                <p className="text-muted-foreground mt-5 text-xs">
                  Crie sua conta para visualizar as peças disponíveis.
                </p>
              </div>

              {/* PREVIEW */}

              <div className="mx-auto w-full max-w-md lg:max-w-none">
                <div className="bg-card rounded-3xl border p-5 shadow-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted aspect-square rounded-2xl" />

                    <div className="bg-muted aspect-square rounded-2xl" />

                    <div className="bg-muted aspect-square rounded-2xl" />

                    <div className="bg-muted aspect-square rounded-2xl" />
                  </div>

                  <div className="bg-muted/60 mt-5 h-10 rounded-xl" />

                  <div className="bg-muted/60 mt-2 h-6 w-24 rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="text-muted-foreground border-t py-6 text-center text-xs">
          {new Date().getFullYear()} Crochê da T
        </footer>
      </div>
    </main>
  );
}
