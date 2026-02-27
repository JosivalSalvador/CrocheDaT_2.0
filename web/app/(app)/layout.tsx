import { ReactNode } from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "../(auth)/_components/logout-button";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const name = session.user.name.split(" ")[0];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* HEADER */}

      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3v18M3 12h18" />
              </svg>
            </div>

            <div className="text-sm font-semibold">Crochê da T</div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden text-sm sm:block">
              Olá, {name}
            </span>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <main className="flex-1">{children}</main>

      {/* FOOTER */}

      <footer className="text-muted-foreground border-t py-6 text-center text-xs">
        {new Date().getFullYear()} Crochê da T
      </footer>
    </div>
  );
}
